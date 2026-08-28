# GitHub CI

The repository runs five GitHub Actions workflows: pull-request validation,
license-header enforcement, the Eclipse Dash IP license check, snapshot
publication from the `snapshot` branch, and release publication from the
`main` branch.

All workflow definitions live in [`.github/workflows`](../.github/workflows).

## Branch model

`snapshot` is the active development line — all PRs target it, and every push
publishes a `-SNAPSHOT` artifact. `main` always holds the latest released
version, which is available on
[Maven Central](https://repo1.maven.org/maven2/org/eclipse/fennec/) under
`org.eclipse.fennec:*`.

| Branch     | Purpose                                            | Publishes to                                              |
|------------|----------------------------------------------------|-----------------------------------------------------------|
| `snapshot` | Active development. PRs target this branch.        | Sonatype Central — `-SNAPSHOT` versions                   |
| `main`     | Latest release — code here matches what is on Maven Central. | Sonatype Central → Maven Central — final versions, signed with project GPG key |

## Workflow overview

```
┌─────────────────────────┐
│   PR / feature branch   │
└────────────┬────────────┘
             │  push / pull_request
             ▼
    ┌─────────────────┐    ┌──────────────────┐
    │   build.yml     │    │   license.yml    │
    │   (CI Build)    │    │ (License header) │
    └─────────────────┘    └──────────────────┘
             │
             │  merge into snapshot
             ▼
    ┌─────────────────┐
    │  snapshot.yml   │  →  publishes SNAPSHOT artifacts
    └─────────────────┘
             │
             │  merge into main
             ▼
    ┌─────────────────┐
    │   release.yml   │  →  publishes signed release artifacts
    └─────────────────┘
```

## `build.yml` — CI Build

* **File:** [`.github/workflows/build.yml`](../.github/workflows/build.yml)
* **Triggers:**
  * `push` on any branch **except** `main` and `snapshot`
  * `pull_request` on any branch
* **Purpose:** Validate that the source tree compiles and tests pass.
* **JDK:** Java 21 (Temurin) on `ubuntu-latest`.
* **Steps:** checkout → Gradle wrapper validation → set up JDK with Gradle
  cache → `./gradlew build --info`.
* **Secrets used:** none — this workflow does not publish anything.

A green run is the gating signal for review.

## `license.yml` — License header check

* **File:** [`.github/workflows/license.yml`](../.github/workflows/license.yml)
* **Triggers:** `push`, `pull_request`, and manual `workflow_dispatch`.
* **Purpose:** Verify every source file carries the Eclipse Public License
  2.0 header. Uses [apache/skywalking-eyes](https://github.com/apache/skywalking-eyes)
  (pinned to `v0.8.0`) driven by [`.licenserc.yaml`](../.licenserc.yaml).
* **What it checks:** the SPDX header pattern declared in `.licenserc.yaml`,
  applied to every file *not* listed under `paths-ignore`.
* **Failure mode:** on a PR the action comments on the offending lines via
  `GITHUB_TOKEN`. The fix is to add the standard header (template in
  [`CONTRIBUTING.md`](../CONTRIBUTING.md#license-headers)) and push again.

## `dash-licenses.yml` — Eclipse Dash IP license check

* **File:** [`.github/workflows/dash-licenses.yml`](../.github/workflows/dash-licenses.yml)
* **Triggers:** `push` to `main`/`snapshot`, all pull requests, and manual
  `workflow_dispatch`.
* **Purpose:** Verify that every third-party dependency the workspace
  resolves has been vetted by the Eclipse IP process. Runs
  [`tools/dash-licenses.sh`](../tools/dash-licenses.sh), which exports the
  dependency GAVs with `bnd repo deps` and feeds them to the
  [Eclipse Dash License Tool](https://github.com/eclipse-dash/dash-licenses).
* **Failure mode:** the job fails when any dependency is `restricted`
  (not yet vetted). Regenerate and review locally with
  `tools/dash-licenses.sh` (or `.bat` on Windows) and commit the updated
  [`DEPENDENCIES`](../DEPENDENCIES) file; submit IP reviews with `--review`.

## `snapshot.yml` — Snapshot Build

* **File:** [`.github/workflows/snapshot.yml`](../.github/workflows/snapshot.yml)
* **Triggers:** `push` to the `snapshot` branch only. Pull requests are
  explicitly excluded so untrusted code cannot reach the publishing step.
* **Purpose:** Build, sign, and publish `-SNAPSHOT` artifacts whenever the
  `snapshot` branch advances.
* **JDK:** Java 21 (Temurin) on `ubuntu-latest`.
* **Command:** `./gradlew release --info`.
* **Secrets used:**
  * `CENTRAL_SONATYPE_TOKEN_USERNAME`, `CENTRAL_SONATYPE_TOKEN_PASSWORD` — Sonatype Central credentials
  * `GPG_PRIVATE_KEY`, `GPG_PASSPHRASE`, `GPG_KEY_ID` — signing key (imported into the runner's keyring, deleted at the end of the job)

## `release.yml` — Release Build

* **File:** [`.github/workflows/release.yml`](../.github/workflows/release.yml)
* **Triggers:** `push` to the `main` branch only. PRs are explicitly excluded.
* **Purpose:** Cut a signed release to Sonatype Central whenever `main` advances.
* **JDK:** Java 21.
* **Command:** `./gradlew release --info` with `DO_RELEASE=true`.
* **Secrets used:** same set as `snapshot.yml`.
* **Result:** signed artifacts pushed to Sonatype Central and (after the
  Central sync) to Maven Central.
* **Release OBR:** the same release run also populates the local `Release`
  repository (`cnf/release`) with the exact bundles that went to Sonatype.
  The follow-up `obr` job force-pushes that content as the single-commit
  orphan branch `release-obr`, served at
  `https://raw.githubusercontent.com/eclipse-fennec/fennec.bnd.libraries/release-obr/index.xml`
  — the baseline repository for the next development cycle.

## Published artifacts

Releases and snapshots are published to **Sonatype Central**, from which
releases sync to Maven Central. The group id is `org.eclipse.fennec`.

| Channel    | Repository URL                                                                                                                | Pushed by                    |
|------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| Release    | [Maven Central](https://repo1.maven.org/maven2/org/eclipse/fennec/) — `org.eclipse.fennec:*`                                  | `release.yml` on `main`      |
| Snapshot   | [Sonatype Central snapshots](https://central.sonatype.com/repository/maven-snapshots/org/eclipse/fennec/) — `*-SNAPSHOT`      | `snapshot.yml` on `snapshot` |
| Browse     | [search.maven.org `org.eclipse.fennec`](https://search.maven.org/search?q=g:org.eclipse.fennec) — find a specific version     |                              |

Downstream BND workspaces typically consume these via library directives:

```
# In cnf/build.bnd
-library: fennec
-library: fennecTest
-library: enableOSGi-Test
-library: fennecJacoco
```

Each library JAR carries its own version. Pin the workspace to a specific
released version of the library project to avoid surprises when a new
snapshot lands.

## Secrets

The following repository / organisation secrets must be defined for
`snapshot.yml` and `release.yml` to succeed:

| Secret name                          | Purpose                                  |
|--------------------------------------|------------------------------------------|
| `CENTRAL_SONATYPE_TOKEN_USERNAME`    | Sonatype Central user token              |
| `CENTRAL_SONATYPE_TOKEN_PASSWORD`    | Sonatype Central token password          |
| `GPG_PRIVATE_KEY`                    | ASCII-armored GPG private key            |
| `GPG_PASSPHRASE`                     | Passphrase for the private key           |
| `GPG_KEY_ID`                         | Long-form key id (used by the build)     |

The GPG key is imported on the fly and the keyring is removed in a final
step that runs even when the job fails (`if: always()`). The build never
echoes secret values.

## Reproducing CI locally

* Full PR build:
  ```bash
  ./gradlew clean build --info
  ```
* License headers:
  ```bash
  docker run --rm -v $(pwd):/github/workspace \
    ghcr.io/apache/skywalking-eyes/license-eye header check
  ```
* The snapshot / release workflows cannot be reproduced locally because they
  publish to Sonatype Central and require the project signing key.
