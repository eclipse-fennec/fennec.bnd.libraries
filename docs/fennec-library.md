# fennec — Workspace Setup

`-library: fennec` turns a plain bnd workspace into a standard Eclipse Fennec
workspace: sensible manifest defaults, EPL-2.0 licensing, a Maven Central
release configuration, a release OBR and optional baselining. It is provided by
the `org.eclipse.fennec.bnd.library` bundle and is enabled at the **workspace
level**, in `cnf/build.bnd`.

```properties
# cnf/build.bnd
-library: fennec
```

Requires **bnd 7.1 or newer**.

## Required properties

The library expects a few properties to be set in `cnf/build.bnd`. They feed the
generated bundle manifests and the Maven coordinates:

| Property | Meaning | Example |
|---|---|---|
| `github-orga` | GitHub organisation that owns the repository | `eclipse-fennec` |
| `github-project` | GitHub repository name | `my.project` |
| `base-version` | Default bundle version (before the `.SNAPSHOT`/release qualifier) | `1.0.0` |
| `-groupid` | Maven group ID; for Eclipse Fennec it must start with `org.eclipse.fennec` | `org.eclipse.fennec.my` |

`github-orga` and `github-project` are woven into `Bundle-DocURL` and
`Bundle-SCM`, so they must match the real repository.

## What it configures

Enabling `fennec` applies a set of workspace-wide defaults so individual
projects need almost no boilerplate:

- **Manifest defaults** — `Bundle-DocURL`, `Bundle-SCM`,
  `Bundle-License` (`Eclipse Public License 2.0`), `Bundle-Vendor`,
  `Bundle-Copyright`, `Bundle-ContactAddress` and `Bundle-Developers` are
  pre-filled and derived from the properties above.
- **Version handling** — `project-version` defaults to
  `${base-version}.SNAPSHOT`; release engineering strips or replaces the
  qualifier (see [Releasing &amp; Baselining](releasing.md)).
- **Sources and JPMS** — `-sources: true` embeds sources, and a
  `module-info` is generated (`-jpms-module-info`).
- **License resource** — the EPL-2.0 `LICENSE` file is embedded into
  `META-INF/` of every bundle.
- **Base build path** — the common OSGi annotations
  (`org.osgi.annotation.versioning`, `org.osgi.annotation.bundle`,
  `org.osgi.service.component.annotations`,
  `org.osgi.service.metatype.annotations`) are added to `-buildpath` so
  Declarative Services and versioning annotations are available everywhere.
- **Repositories** — a read-only *Central* Maven repository (indexed by
  `cnf/central.mvn`) plus `Local` and `Temp` indexed repositories.
- **Release configuration** — `maven-central: true`, a `Release` OBR in
  `cnf/release`, POM generation and SHA-256 digests. See
  [Releasing &amp; Baselining](releasing.md).

## The workspace template

Rather than wiring this up by hand, you can generate a ready-made workspace from
the **“Eclipse Fennec GitHub Workspace”** Bndtools template that ships with this
library. It creates `cnf/build.bnd` with `fennec`, `fennecTest` and
`fennecJacoco` already enabled, a `cnf/central.mvn` repository index listing the
library artifacts, GitHub Actions workflows (build, license check, release,
Sonar) and a `cnf/SETUP.MD` with the remaining one-time steps (SonarCloud, git
init, license check). See [Templates](templates.md).

## Related guides

- [Templates](templates.md) — the workspace and project templates in detail
- [Releasing &amp; Baselining](releasing.md) — snapshot/release publication, the
  release OBR and baselining
- [fennecTest](fennectest.md) — add JUnit 5 / OSGi-Test on top
