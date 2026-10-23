import { defineConfig } from 'vitepress'
import { GUIDES, slugFor } from '../../guides.mjs'

// Per-project docs are served under a versioned sub-path, matching the org
// convention (https://eclipse-fennec.github.io/<repo>/<version>/). The snapshot
// branch publishes to /fennec.bnd.libraries/snapshot/; tagged releases /
// `latest` get added once the first release lands.
const version = process.env.DOCS_BRANCH || 'snapshot'
const base = `/fennec.bnd.libraries/${version}/`

// Canonical published origin. Links that point OUTSIDE the current docs base
// (other doc versions) must be full URLs — VitePress auto-prepends `base` to any
// root-absolute (`/…`) link, which would otherwise double the path. Links to
// pages WITHIN this version stay base-relative (e.g. `/guides/getting-started`).
const SITE = 'https://eclipse-fennec.github.io/fennec.bnd.libraries'

// Version selector. Only `snapshot` is deployed today; keep as data so adding
// `latest` and tagged versions later is a one-liner.
const versions = [{ text: 'snapshot', link: `${SITE}/snapshot/` }]

// Build the sidebar as one section per `group`, preserving the order in which
// groups first appear in GUIDES.
const groupOrder = []
const byGroup = new Map()
for (const g of GUIDES) {
  if (!byGroup.has(g.group)) {
    byGroup.set(g.group, [])
    groupOrder.push(g.group)
  }
  byGroup.get(g.group).push({ text: g.title, link: `/guides/${slugFor(g)}` })
}
const sidebarGuides = groupOrder.map((name) => ({
  text: name,
  collapsed: false,
  items: byGroup.get(name),
}))

// Compact nav dropdown: the group headers, each linking to its first page.
const navGuides = groupOrder.map((name) => ({
  text: name,
  link: byGroup.get(name)[0].link,
}))

export default defineConfig({
  title: 'Fennec Bnd Libraries',
  description:
    'Bndtools library definitions for the Eclipse Fennec ecosystem — standardized workspace setup, JUnit 5 / OSGi-Test support, integration testing and JaCoCo code coverage for OSGi/bnd-based development.',
  lang: 'en-US',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  markdown: {
    // Shiki has no dedicated 'gradle' grammar; Gradle build files are Groovy.
    languageAlias: { gradle: 'groovy', bnd: 'properties' },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}fennec-logo.png` }],
    ['meta', { name: 'theme-color', content: '#c0631c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Fennec Bnd Libraries' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Bndtools library definitions for the Eclipse Fennec ecosystem — one -library: instruction per concern.',
      },
    ],
  ],

  themeConfig: {
    logo: '/fennec-logo.png',
    siteTitle: 'Fennec Bnd Libraries',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', items: navGuides },
      { text: `version: ${version}`, items: versions },
    ],

    sidebar: {
      '/guides/': sidebarGuides,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eclipse-fennec/fennec.bnd.libraries' },
    ],

    search: { provider: 'local' },

    // No editLink: published pages are synced from several source locations
    // (docs/ and module readmes), so a single :path edit pattern cannot map
    // back to the right source file.

    footer: {
      message:
        'Released under the EPL-2.0 License. Eclipse Fennec is part of the Eclipse Foundation.',
      copyright: 'Copyright © Eclipse Foundation and contributors',
    },
  },
})
