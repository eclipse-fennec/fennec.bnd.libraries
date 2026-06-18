# Eclipse Fennec workspace template fragments (PoC)

This folder holds **bndtools workspace template fragments**. A fragment models one aspect of
a workspace and is layered on top of a base workspace template (we target bndtools
`workspace-minimal`). Fragments are registered in [`../index.bnd`](../index.bnd) via the
`-workspace-templates` instruction; fragment ids resolve to subfolders of this repository
(`eclipse-fennec/fennec.bnd.libraries/fragments/<name>#<ref>`), so everything stays in the
monorepo with no binaries and no OSGi index / Maven hosting needed.

## `gradle/` — Gradle setup (PoC)

Adds the Fennec Gradle build to a workspace:

| File | Role | `tool.bnd` handling |
|------|------|---------------------|
| `build.gradle`, `settings.gradle` | Gradle build (Sonar + Jacoco + JUnit) | copied |
| `gradle.properties` | `bnd_version`, `bnd_snapshots` | `macro=true;append=true` |
| `gradlew`, `gradlew.bat`, `gradle/wrapper/*` | Gradle wrapper | `gradlew;exec=true` |
| `cnf/ext/fennec.bnd` | additive bnd props (`-library`, Central repo, javac 21) | copied to `cnf/ext` |
| `cnf/ext/central.mvn` | Maven Central index for `-library` resolution | copied to `cnf/ext` |

### Design: additive on `workspace-minimal`

The base `workspace-minimal` already provides the `Local` + `Release` `LocalIndexedRepo`s and
`-releaserepo: Release`. The fragment is **purely additive** and deliberately:

* uses `cnf/ext/fennec.bnd` (merged *before* `build.bnd`) instead of replacing `build.bnd`;
* only **adds** the read-only `Central` repo (does **not** redefine `Local`/`Release` — that
  would collide on the repo name);
* does **not** override `-releaserepo` (Maven Central release is driven by GitHub Actions);
* adds Gradle root files that do not exist in `workspace-minimal` (no overwrite needed).

This sidesteps both open fragment questions (`tool.bnd` overwrite behaviour and
`cnf/ext`-vs-`build.bnd` precedence) by construction.

### PoC verification

Simulated the fragment application onto `workspace-minimal` and loaded the merged workspace
with Gradle (`gradlew projects`): **BUILD SUCCESSFUL** — the merged `cnf` (base `build.bnd` +
`cnf/ext/fennec.bnd` + `central.mvn`) parses cleanly, `rootProject.name` from the fragment is
applied, and there is **no repository name collision**.

### Still to verify in bndtools (needs the IDE / `bnd` CLI)

* Real fragment **selection + application** through the New Bnd Workspace wizard via the
  `-workspace-templates` index (this PoC only simulated the file copy).
* `gradle.properties` `macro=true;append=true` preprocessing/append onto an existing file.
* `-library: fennec` resolving from Maven Central (needs the published library version; the
  PoC pins `central.mvn` to a concrete version instead of the template's `${Bundle-Version}`).
