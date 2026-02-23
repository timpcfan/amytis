export interface NavChildItem {
  name: string;
  url: string;
  external?: boolean;
  dividerBefore?: boolean; // render a separator line before this item
}

export interface NavItem {
  name: string;
  url: string;
  weight: number;
  external?: boolean;
  dropdown?: string[];
  children?: NavChildItem[]; // static sub-links rendered as a dropdown
}

// Defined up-front so footer.connect can reference these URLs without duplication
const social = {
  github: "https://github.com/hutusi/amytis",
  twitter: "https://twitter.com/hutusi",
  email: "mailto:huziyong@gmail.com",
};

export const siteConfig = {

  // ── Site identity ─────────────────────────────────────────────────────────
  title: { en: "Amytis", zh: "Amytis" },
  description: { en: "Amytis — an open-source Next.js 15 framework for building your digital garden, with posts, series, books, notes, knowledge graph, and full-text search.", zh: "Amytis — 开源 Next.js 15 数字花园框架，内置文章、系列、书籍、随笔、知识图谱和全文搜索。" },
  baseUrl: "https://example.com", // Replace with your actual domain
  ogImage: "/og-image.png", // Default OG/social preview image — place a 1200×630 PNG at public/og-image.png
  footerText: { en: `© ${new Date().getFullYear()} Amytis. All rights reserved.`, zh: `© ${new Date().getFullYear()} Amytis. 保留所有权利。` },

  // ── i18n ──────────────────────────────────────────────────────────────────
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { name: "Flow", url: "/flows", weight: 1 },
    { name: "Posts", url: "/posts", weight: 2 },
    { name: "Series", url: "/series", weight: 3, dropdown: ["digital-garden", "markdown-showcase", "ai-nexus-weekly"] },
    { name: "Books", url: "/books", weight: 4, dropdown: [] },
    { name: "About", url: "/about", weight: 5 },
    { name: "More", url: "", weight: 6, children: [
      { name: "Archive", url: "/archive" },
      { name: "Tags", url: "/tags" },
      { name: "Links", url: "/links" },
      { name: "Subscribe", url: "/subscribe", dividerBefore: true },
    ]},
  ] as NavItem[],

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    explore: [
      { name: "Archive", url: "/archive", weight: 1 },
      { name: "Tags", url: "/tags", weight: 2 },
      { name: "Links", url: "/links", weight: 3 },
      { name: "About", url: "/about", weight: 4 },
    ],
    connect: [
      { name: "GitHub", url: social.github, weight: 1 },
      { name: "Twitter", url: social.twitter, weight: 2 },
      { name: "RSS Feed", url: "/feed.xml", weight: 3 },
      { name: "Subscribe", url: "/subscribe", weight: 4 },
    ],
    builtWith: {
      show: true,
      url: "https://github.com/hutusi/amytis",
      text: { en: "Built with Amytis", zh: "基于 Amytis 构建" },
    },
  },

  // ── Social & sharing ──────────────────────────────────────────────────────
  social,
  share: {
    enabled: true,
    // Supported: twitter, facebook, linkedin, weibo, reddit, hackernews,
    //            telegram, bluesky, mastodon, douban, zhihu, copy
    platforms: ['twitter', 'facebook', 'linkedin', 'weibo', 'copy'],
  },
  subscribe: {
    substack: '',       // Substack publication URL, e.g., 'https://yourname.substack.com'
    telegram: '',       // Telegram channel URL, e.g., 'https://t.me/yourchannel'
    wechat: {
      qrCode: '',       // Path to QR image in public/, e.g., '/images/wechat-qr.png'
      account: '',      // WeChat official account ID/name shown below QR
    },
    email: '',          // Newsletter/mailing list URL (distinct from social.email contact address)
  },

  // ── Features ──────────────────────────────────────────────────────────────
  features: {
    posts: {
      enabled: true,
      name: { en: "Posts", zh: "文章" },
    },
    series: {
      enabled: true,
      name: { en: "Series", zh: "系列" },
    },
    books: {
      enabled: true,
      name: { en: "Books", zh: "书籍" },
    },
    flows: {
      enabled: true,
      name: { en: "Flow", zh: "随笔" },
    },
    notes: {
      enabled: true,
      name: { en: "Notes", zh: "笔记" },
    },
  },

  // ── Homepage ──────────────────────────────────────────────────────────────
  hero: {
    tagline: { en: "Open Source Digital Garden", zh: "开源数字花园框架" },
    title: { en: "A home for ideas to grow, link, and evolve.", zh: "让想法生长、关联、演化的地方。" },
    subtitle: { en: "Amytis is a Next.js 15 framework for your personal knowledge space — posts, series, books, notes, knowledge graph, and full-text search. Open source and ready to fork.", zh: "Amytis 是一个开源的 Next.js 15 数字花园框架，内置文章、系列、书籍、随笔、知识图谱和全文搜索，开箱即用，随时 fork。" },
  },
  homepage: {
    sections: [
      { id: 'hero',            enabled: true, weight: 1 },
      { id: 'featured-series', enabled: true, weight: 2, maxItems: 6, scrollThreshold: 2 },
      { id: 'featured-books',  enabled: true, weight: 3, maxItems: 4, scrollThreshold: 2 },
      { id: 'featured-posts',  enabled: true, weight: 4, maxItems: 4, scrollThreshold: 1 },
      { id: 'latest-posts',    enabled: true, weight: 5, maxItems: 5 },
      { id: 'recent-flows',    enabled: true, weight: 6, maxItems: 5 },
    ],
  },

  // ── Content ───────────────────────────────────────────────────────────────
  pagination: {
    posts: 5,
    series: 5,
    flows: 20,
    notes: 20,
  },
  posts: {
    toc: true,
    showFuturePosts: false,
    includeDateInUrl: false,
    // trailingSlash is configured in next.config.ts (Next.js handles URL normalization)
    archive: {
      showAuthors: true,
    },
  },
  flows: {
    recentCount: 5,
  },

  // ── Appearance ────────────────────────────────────────────────────────────
  themeColor: 'default', // 'default' | 'blue' | 'rose' | 'amber'

  // ── Analytics ─────────────────────────────────────────────────────────────
  analytics: {
    provider: 'umami', // 'umami' | 'plausible' | 'google' | null
    umami: {
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '', // Your Umami Website ID
      src: process.env.NEXT_PUBLIC_UMAMI_URL || 'https://us.umami.is/script.js', // Default or self-hosted URL
    },
    plausible: {
      domain: '', // Your domain
      src: 'https://plausible.io/js/script.js',
    },
    google: {
      measurementId: '', // G-XXXXXXXXXX
    },
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  comments: {
    provider: 'giscus', // 'giscus' | 'disqus' | null
    giscus: {
      repo: 'hutusi/amytis', // username/repo
      repoId: 'R_kgDOQ1YSwA',
      category: 'Announcements',
      categoryId: 'DIC_kwDOQ1YSwM4C2NmL',
    },
    disqus: {
      shortname: '',
    },
  },

  // ── Authors ───────────────────────────────────────────────────────────────
  authors: {
    // Map display name (as used in post frontmatter) to author profile
    // "Author Name": { bio: "Short bio shown in author card below each post." },
  } as Record<string, { bio?: string }>,

};
