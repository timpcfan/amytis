'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { resolveLocaleValue } from '@/lib/i18n';

type LocaleValue = string | Record<string, string>;

type HeroStats = {
  posts?: number;
  series?: number;
  books?: number;
  flows?: number;
};

type LatestPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
};

interface HeroProps {
  tagline: LocaleValue;
  title: LocaleValue;
  subtitle: LocaleValue;
  stats?: HeroStats;
  latestPost?: LatestPost;
}

export default function Hero({ tagline, title, subtitle, stats, latestPost }: HeroProps) {
  const { language, t } = useLanguage();
  const resolvedTagline = resolveLocaleValue(tagline, language);
  const resolvedTitle = resolveLocaleValue(title, language);
  const resolvedSubtitle = resolveLocaleValue(subtitle, language);
  const statItems = [
    { key: 'posts', label: t('posts'), value: stats?.posts },
    { key: 'series', label: t('series'), value: stats?.series },
    { key: 'books', label: t('books'), value: stats?.books },
    { key: 'flows', label: t('flow'), value: stats?.flows },
  ].filter(item => typeof item.value === 'number') as { key: string; label: string; value: number }[];

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent pointer-events-none" />
      <div className="absolute -top-10 -left-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-16 right-0 h-52 w-52 rounded-full bg-heading/5 blur-3xl pointer-events-none" />

      <div className="layout-main pt-8 md:pt-12 pb-10 md:pb-14">
        <div className="relative rounded-3xl border border-muted/20 bg-background/90 backdrop-blur-sm px-6 py-8 md:px-10 md:py-12 shadow-sm">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-accent/35" />
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-accent/90">
              {resolvedTagline}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-heading leading-[1.08] tracking-tight max-w-4xl text-balance">
            {resolvedTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-sm md:text-base text-muted leading-relaxed">
            {resolvedSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/posts" className="btn-primary rounded-full no-underline">
              {t('all_posts')}
            </Link>
            <Link href="/archive" className="btn-secondary rounded-full no-underline">
              {t('view_archive')}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {statItems.map(item => (
              <Link
                key={item.key}
                href={
                  item.key === 'posts' ? '/posts'
                    : item.key === 'series' ? '/series'
                    : item.key === 'books' ? '/books'
                    : '/flows'
                }
                className="rounded-2xl border border-muted/15 bg-muted/5 px-4 py-3 no-underline hover:border-accent/25 hover:bg-accent/5 transition-colors"
              >
                <p className="font-serif text-2xl text-heading">{item.value.toLocaleString()}</p>
                <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
              </Link>
            ))}
          </div>

          {latestPost && (
            <Link
              href={`/posts/${latestPost.slug}`}
              className="mt-8 block rounded-2xl border border-muted/15 bg-muted/5 p-5 no-underline hover:border-accent/25 hover:bg-accent/5 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2">
                <span className="font-semibold text-accent">{t('latest_writing')}</span>
                <span>•</span>
                <span>{latestPost.date}</span>
                <span>•</span>
                <span>{latestPost.readingTime}</span>
                <span>•</span>
                <span>{latestPost.category}</span>
              </div>
              <h2 className="font-serif text-xl text-heading leading-snug mb-2">{latestPost.title}</h2>
              <p className="text-sm text-muted leading-relaxed line-clamp-2">{latestPost.excerpt}</p>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
