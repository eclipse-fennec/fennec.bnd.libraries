// The published, user-facing docs (allowlist). Shared by the sync script and the
// VitePress config so the set and its order are defined exactly once.
//   file  — source markdown, relative to the REPOSITORY ROOT (so module readmes
//           can be published alongside docs/)
//   title — sidebar / nav label
//   group — sidebar section the entry belongs to
//   slug  — optional route name override; defaults to the file's base name
//
// Internal dev docs (ci.md, agent notes) are deliberately NOT listed here and
// stay unpublished (browsed on GitHub).
export const GUIDES = [
  { file: 'docs/getting-started.md', title: 'Getting Started', group: 'Getting Started' },
  {
    file: 'org.eclipse.fennec.bnd.library/readme.md',
    title: 'fennec — Workspace Setup',
    group: 'Libraries',
    slug: 'fennec-library',
  },
  {
    file: 'org.eclipse.fennec.osgitest.bnd.library/readme.md',
    title: 'fennecTest — JUnit 5 & OSGi-Test',
    group: 'Libraries',
    slug: 'fennectest-library',
  },
  {
    file: 'org.eclipse.fennec.osgitest.project.bnd.library/readme.md',
    title: 'enableOSGi-Test — Integration Tests',
    group: 'Libraries',
    slug: 'enableosgi-test-library',
  },
  {
    file: 'org.eclipse.fennec.jacoco.bnd.library/readme.md',
    title: 'fennecJacoco — Code Coverage',
    group: 'Libraries',
    slug: 'fennecjacoco-library',
  },
]

// Route name for a guide: an explicit `slug`, otherwise the file's base name
// without the .md extension, e.g. 'docs/getting-started.md' ->
// 'getting-started', served at /guides/getting-started.
export function slugFor(guide) {
  if (guide.slug) return guide.slug
  return guide.file.replace(/^.*\//, '').replace(/\.md$/, '')
}
