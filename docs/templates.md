# Templates

The libraries ship Bndtools workspace and project templates. They appear in the
Bndtools **New** wizards once the bundles are available in a workspace
repository.

## Workspace templates

Available under *File → New → Bnd Workspace* (category *Workspace Extensions*).

### Eclipse Fennec GitHub Workspace

From the [`fennec`](fennec-library.md) library. Creates a complete Eclipse
Fennec workspace:

- `cnf/build.bnd` with `fennec`, `fennecTest` and `fennecJacoco` pre-enabled,
- `cnf/central.mvn` repository index already listing the library artifacts,
- GitHub Actions workflows for build, license check, release and Sonar,
- a `cnf/SETUP.MD` describing the one-time steps still required.

After generating the workspace, work through `cnf/SETUP.MD`:

1. **Maven group ID** — defaulted from the project symbolic name via `-groupid`
   in `cnf/build.bnd`; adjust if needed.
2. **SonarCloud** — add the project on SonarCloud and store the `SONAR_TOKEN`
   as a GitHub Actions repository secret.
3. **Gradle** — on Linux, `chmod +x gradlew` and verify `./gradlew --version`.
4. **Git** — initialise the repository and push `main`, then create and push the
   `snapshot` development branch.
5. **License check** — runs as a GitHub Action on `main` and `snapshot`; you can
   run it locally with the SkyWalking Eyes `license-eye` Docker image. Adjust
   inclusions/exclusions in `.licenserc.yaml`.

### Fennec OSGi-Test/JUnit5 Workspace Extension

From the [`fennecTest`](fennectest.md) library. Adds the `build.gradle` that
enables the JUnit Platform for all subprojects (and the `mavenCentral()`
repository JaCoCo needs on newer Gradle). Use it on workspaces that are **not**
based on the Fennec workspace template.

::: warning
This template overwrites `build.gradle`. If you already have content there,
apply its snippet manually instead.
:::

## Project templates

Available under *File → New → Bnd OSGi Project*. Both come from the
[`enableOSGi-Test`](enableosgi-test.md) library and require
`-library: enableOSGi-Test` to be active in the generated project.

- **OSGi-Test/JUnit5 Integration Test Project** — a ready-to-run in-framework
  integration test project for a given bundle: `bnd.bnd`, a `test.bndrun`, a
  Gradle `build.gradle` wired for the `testOSGi` task, and an `ExampleTest` to
  start from.
- **OSGi-Test/JUnit5 Integration TCK Test Project** — the same setup shaped for
  TCK-style test suites.

## Related guides

- [Getting Started](getting-started.md) — using the workspace template vs.
  manual setup
- [enableOSGi-Test](enableosgi-test.md) — what the project templates rely on
