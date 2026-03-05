'use client';

import { useEffect, useMemo, useRef } from 'react';
import { siteConfig } from '../../site.config';
import { getPostsBasePath } from '@/lib/urls';

type WalineClientInstance = {
  destroy?: () => void;
};

type WalineGlobal = {
  init: (options: {
    el: HTMLElement | string;
    serverURL: string;
    path?: string;
    lang?: string;
    pageSize?: number;
    dark?: string | boolean;
  }) => WalineClientInstance | null;
};

declare global {
  interface Window {
    Waline?: WalineGlobal;
  }
}

// Maps site locale codes to Waline-supported language codes.
const WALINE_LANG: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
  'zh-TW': 'zh-TW',
  ja: 'jp',
  de: 'de',
  fr: 'fr',
  ru: 'ru',
  'pt-BR': 'pt-BR',
  pt: 'pt-BR',
};

const WALINE_STYLE_ID = 'waline-client-style';
const WALINE_SCRIPT_ID = 'waline-client-script';
const WALINE_STYLE_URL = 'https://unpkg.com/@waline/client@3/dist/waline.css';
const WALINE_SCRIPT_URL = 'https://unpkg.com/@waline/client@3/dist/waline.umd.js';

function normalizeCommentPath(pathname: string): string {
  const cleanPath = pathname.split('#')[0].split('?')[0];
  if (!cleanPath || cleanPath === '/') return '/';
  return cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
}

function ensureWalineStyle(): void {
  if (document.getElementById(WALINE_STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = WALINE_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = WALINE_STYLE_URL;
  document.head.appendChild(link);
}

function ensureWalineScript(): Promise<WalineGlobal> {
  if (window.Waline?.init) return Promise.resolve(window.Waline);

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(WALINE_SCRIPT_ID) as HTMLScriptElement | null;

    const onLoad = () => {
      if (window.Waline?.init) {
        resolve(window.Waline);
      } else {
        reject(new Error('Waline script loaded but global API is missing.'));
      }
    };

    const onError = () => reject(new Error('Failed to load Waline script.'));

    if (existingScript) {
      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = WALINE_SCRIPT_ID;
    script.src = WALINE_SCRIPT_URL;
    script.async = true;
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    document.head.appendChild(script);
  });
}

export default function Comments({ slug, postUrl }: { slug: string; postUrl?: string }) {
  const { provider, waline, disqus } = siteConfig.comments;
  const walineRef = useRef<HTMLDivElement | null>(null);
  const fallbackPath = `/${getPostsBasePath()}/${slug}`;
  const commentPath = useMemo(() => {
    const source = postUrl ?? `${siteConfig.baseUrl.replace(/\/+$/, '')}${fallbackPath}`;
    try {
      return normalizeCommentPath(new URL(source, siteConfig.baseUrl).pathname);
    } catch {
      return normalizeCommentPath(fallbackPath);
    }
  }, [fallbackPath, postUrl]);

  const walineLang = waline.lang || WALINE_LANG[siteConfig.i18n.defaultLocale] || siteConfig.i18n.defaultLocale;

  useEffect(() => {
    const walineElement = walineRef.current;
    if (provider !== 'waline' || !waline.serverURL || !walineElement) return;

    let instance: WalineClientInstance | null = null;
    let cancelled = false;

    ensureWalineStyle();

    void ensureWalineScript()
      .then((walineGlobal) => {
        if (cancelled) return;
        instance = walineGlobal.init({
          el: walineElement,
          serverURL: waline.serverURL,
          path: commentPath,
          lang: walineLang,
          pageSize: waline.pageSize,
          dark: 'html.dark',
        });
      })
      .catch(() => {
        // Keep the page usable if CDN loading fails.
      });

    return () => {
      cancelled = true;
      instance?.destroy?.();
      walineElement.innerHTML = '';
    };
  }, [commentPath, provider, waline.lang, waline.pageSize, waline.serverURL, walineLang]);

  if (provider === 'waline' && waline.serverURL) {
    return (
      <div className="mt-12 pt-12 border-t border-muted/20">
        <div id="waline" ref={walineRef} />
      </div>
    );
  }

  if (provider === 'disqus' && disqus.shortname) {
    return (
      <div className="mt-12 pt-12 border-t border-muted/20">
        <div id="disqus_thread"></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var disqus_config = function () {
                this.page.url = ${JSON.stringify(postUrl ?? `${siteConfig.baseUrl.replace(/\/+$/, '')}/${getPostsBasePath()}/${slug}`)};
                this.page.identifier = ${JSON.stringify(slug)};
              };
              (function() {
                var d = document, s = d.createElement('script');
                s.src = 'https://${disqus.shortname}.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
              })();
            `,
          }}
        />
        <noscript>
          Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
        </noscript>
      </div>
    );
  }

  return null;
}
