import { defineConfig } from 'vitepress';
import { URLS } from './constants';

export default defineConfig({
  title: 'Mocking GUI',
  description: 'MSW-based Mocking GUI Library',
  lang: 'en-US',
  base: URLS.DOCS,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#000000' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Documentation', link: '/guide/introduction' },
      { text: 'GitHub', link: URLS.GITHUB },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'GUI Panel', link: '/guide/usage/gui-guide' },
            { text: 'API Reference', link: '/guide/usage/api-guide' },
            { text: 'Handler Management', link: '/guide/usage/handler-guide' },
            { text: 'Swagger Automation', link: '/guide/usage/swagger-guide' },
            { text: 'Scenario Management', link: '/guide/usage/scenario-guide' },
          ],
        },
        {
          text: 'Troubleshooting',
          items: [{ text: 'Common Issues', link: '/guide/troubleshooting' }],
        },
        {
          text: 'Agentic Harness',
          items: [
            { text: 'Overview', link: '/guide/agentic-usage' },
            { text: 'Contribution Guide', link: '/guide/agentic-harness' },
          ],
        },
        {
          text: 'Community',
          items: [{ text: 'Contributing', link: '/guide/contributing' }],
        },
      ],
    },

    socialLinks: [{ icon: 'npm', link: URLS.NPM }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Kakao Cloud Team',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },

  ignoreDeadLinks: true,

  vite: {
    optimizeDeps: {
      exclude: ['@kakaocloud/mocking-gui'],
    },
    define: {
      __GITHUB_URL__: JSON.stringify(URLS.GITHUB),
      __GITHUB_ISSUES_URL__: JSON.stringify(URLS.GITHUB_ISSUES),
      __NPM_URL__: JSON.stringify(URLS.NPM),
    },
  },
});
