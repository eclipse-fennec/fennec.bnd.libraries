# Releasing &amp; Baselining

The [`fennec`](fennec-library.md) library preconfigures the full release
pipeline: snapshot and release publication to Maven Central, a release OBR, and
optional baselining against the last release. This guide covers how they fit
together. For the CI workflows that drive it, see
[`docs/ci.md`](https://github.com/eclipse-fennec/fennec.bnd.libraries/blob/snapshot/docs/ci.md).

## Branch model

| Branch | Purpose | Publishes to |
|---|---|---|
| `snapshot` | Active development. PRs target this branch. | Sonatype Central — `-SNAPSHOT` versions |
| `main` | Latest release; matches what is on Maven Central. | Sonatype Central → Maven Central — signed final versions |

Every push to `snapshot` publishes `-SNAPSHOT` artifacts; a push to `main`
publishes signed releases.

## Releasing locally

A release run writes the exact artifacts into the release repository
(`cnf/release`):

```bash
# SNAPSHOT release into cnf/release
./gradlew clean release

# Release into a specific folder
./gradlew clean release -Drelease.dir=cnf/release
```

Bump `base-version` in `cnf/build.bnd` after each release so the next
development cycle carries the new version.

::: info
Publishing to Maven Central (staging/release) and GPG signing run from CI with
the project's credentials and GPG key. Local runs populate `cnf/release` but do
not publish to Central.
:::

## Release OBR

The library defines the `Release` repository as a `LocalIndexedRepo` in
`cnf/release`. A release run (`DO_RELEASE=true`) publishes the exact bundles that
go to Maven Central into this OBR as well, in the **same run**, so the checksums
match. The release workflow then pushes the content of `cnf/release` to a
`release-obr` branch, where the index is served at:

```
https://raw.githubusercontent.com/<github-orga>/<github-project>/release-obr/index.xml
```

This OBR is what baselining compares against.

## Baselining

Baselining against the last release OBR is preconfigured but **off by default**.
Enable it in `cnf/build.bnd`:

```properties
fennec-baselining: true
```

When enabled:

- all bundles are baselined (`-baseline: *`) against the `release-obr` branch of
  your repository (resolved from `github-orga` and `github-project`);
- package changes are reported only at MINOR/MAJOR level
  (`-diffpackages: *;threshold=MINOR`), so inlined generated version constants
  do not cause MICRO-level noise.

Override the baseline repository location with `fennec-baseline-url` in
`cnf/build.bnd` if it differs from the derived `release-obr` URL. Remember to
bump `base-version` after each release so new development is not baselined
against its own version.

## Related guides

- [fennec — Workspace Setup](fennec-library.md) — the release configuration this
  builds on
- [Getting Started](getting-started.md) — where the artifacts are published
