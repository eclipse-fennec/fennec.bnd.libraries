# Getting Started

The Fennec Bnd Libraries are [Bndtools library](https://bnd.bndtools.org/instructions/library.html)
definitions for the Eclipse Fennec ecosystem. Each library is a plain OSGi
bundle, published to Maven Central under the group ID `org.eclipse.fennec.bnd`,
that a bnd workspace activates with a single `-library:` instruction:

| Library | Artifact | What it does |
|---|---|---|
| `fennec` | `org.eclipse.fennec.bnd.library` | Standard Eclipse Fennec workspace setup: manifest defaults, licensing, Maven Central release, release OBR, baselining |
| `fennecTest` | `org.eclipse.fennec.osgitest.bnd.library` | JUnit 5 Jupiter, [OSGi-Test](https://github.com/osgi/osgi-test), AssertJ and Mockito on the test path of every project |
| `enableOSGi-Test` | `org.eclipse.fennec.osgitest.project.bnd.library` | Per-project / per-`.bndrun` setup for OSGi integration tests |
| `fennecJacoco` | `org.eclipse.fennec.jacoco.bnd.library` | JaCoCo code coverage for OSGi tests |

Some of the bundles additionally carry Bndtools **workspace and project
templates** (an Eclipse Fennec GitHub workspace, an OSGi Configurator project,
library repackaging, OSGi-Test integration test projects).

## Requirements

- A [bnd workspace](https://bnd.bndtools.org/chapters/123-tour-workspace.html)
  built with **bnd 7.1 or newer** (Bndtools 7.1+, or the
  `biz.aQute.bnd.workspace` Gradle plugin).

## Option 1: start from the workspace template

`org.eclipse.fennec.bnd.library` provides the Bndtools workspace template
**“Eclipse Fennec GitHub Workspace”** (category *Workspace Extensions*). It
creates a complete workspace with the libraries pre-wired: `cnf/build.bnd`
enables `fennec`, `fennecTest` and `fennecJacoco`, `cnf/central.mvn` already
lists the library artifacts, and GitHub Actions workflows for build, license
check and release are included.

## Option 2: add the libraries to an existing workspace

1. Make the library bundles available in a workspace repository, e.g. by
   adding them to the index of a
   [Maven Bnd Repository](https://bnd.bndtools.org/plugins/maven.html):

   ```properties
   # cnf/central.mvn (repository index)
   org.eclipse.fennec.bnd:org.eclipse.fennec.bnd.library:0.0.4
   org.eclipse.fennec.bnd:org.eclipse.fennec.osgitest.bnd.library:0.0.4
   org.eclipse.fennec.bnd:org.eclipse.fennec.jacoco.bnd.library:0.0.4
   ```

2. Activate the libraries you want in `cnf/build.bnd`:

   ```properties
   -library: fennec, fennecTest, fennecJacoco
   ```

3. The `fennec` library expects two properties in your `build.bnd`
   (see the [fennec guide](../org.eclipse.fennec.bnd.library/readme.md)):

   ```properties
   github-orga:    <your GitHub organisation>
   github-project: <your GitHub repository>
   base-version:   1.0.0
   ```

For integration test projects, additionally enable
[`-library: enableOSGi-Test`](../org.eclipse.fennec.osgitest.project.bnd.library/readme.md) in the project's
`bnd.bnd` and in your `.bndrun` files.

## Where the artifacts come from

- Releases: [Maven Central](https://repo1.maven.org/maven2/org/eclipse/fennec/bnd/)
  (`org.eclipse.fennec.bnd:*`)
- Snapshots: [Sonatype Central snapshots](https://central.sonatype.com/repository/maven-snapshots/org/eclipse/fennec/),
  published from the `snapshot` branch

## Next steps

- [fennec — Workspace Setup](../org.eclipse.fennec.bnd.library/readme.md): manifest defaults, releasing,
  the release OBR and baselining
- [fennecTest — JUnit 5 & OSGi-Test](../org.eclipse.fennec.osgitest.bnd.library/readme.md): unit testing
  defaults
- [enableOSGi-Test — Integration Tests](../org.eclipse.fennec.osgitest.project.bnd.library/readme.md): project
  and `.bndrun` level integration test setup
- [fennecJacoco — Code Coverage](../org.eclipse.fennec.jacoco.bnd.library/readme.md): coverage for OSGi
  tests
