---
layout: home

hero:
  name: Fennec Bnd Libraries
  text: One instruction per concern
  tagline: Bndtools library definitions for the Eclipse Fennec ecosystem — standardized workspace setup, JUnit 5 / OSGi-Test support, integration testing and JaCoCo code coverage, each enabled with a single -library instruction.
  image:
    src: /fennec-logo.png
    alt: Eclipse Fennec logo
  actions:
    - theme: brand
      text: Getting Started
      link: /guides/getting-started
    - theme: alt
      text: fennec Library
      link: /guides/fennec-library
    - theme: alt
      text: View on GitHub
      link: https://github.com/eclipse-fennec/fennec.bnd.libraries

features:
  - icon: 🏗️
    title: fennec — workspace setup
    details: "The standard Eclipse Fennec workspace: manifest and license defaults, Maven Central release configuration, a release OBR, and pre-configured baselining — enabled with -library: fennec."
    link: /guides/fennec-library
    linkText: fennec guide
  - icon: 🧪
    title: fennecTest — JUnit 5 & OSGi-Test
    details: "JUnit 5 Jupiter, OSGi-Test, AssertJ and Mockito on the test path of every project in the workspace — unit testing works without any per-project configuration."
    link: /guides/fennectest-library
    linkText: fennecTest guide
  - icon: 🔌
    title: enableOSGi-Test — integration tests
    details: "Per-project and per-.bndrun setup for real in-framework integration tests: build path, run requirements and a ready-to-run project template based on osgi-test."
    link: /guides/enableosgi-test-library
    linkText: enableOSGi-Test guide
  - icon: 📊
    title: fennecJacoco — code coverage
    details: "Adds the JaCoCo agent to the test setup and provides the JaCoCo dependencies from a dedicated repository — coverage for unit and OSGi integration tests."
    link: /guides/fennecjacoco-library
    linkText: fennecJacoco guide
  - icon: 📋
    title: Workspace & project templates
    details: "Bndtools templates ship with the libraries: an Eclipse Fennec GitHub workspace (CI, Sonar, license check included), an OSGi Configurator project, library repackaging, and OSGi-Test integration test projects."
    link: /guides/getting-started
    linkText: Getting started
  - icon: 🚀
    title: Release engineering included
    details: "Snapshot and release publication to Maven Central, a release OBR served from the release-obr branch, and baselining against the last release — preconfigured by the fennec library."
    link: /guides/fennec-library
    linkText: Releasing & baselining
---

## Getting started

The Fennec Bnd Libraries are
[Bndtools libraries](https://bnd.bndtools.org/instructions/library.html):
OSGi bundles, published to Maven Central under the group ID
`org.eclipse.fennec.bnd`, that configure a bnd workspace when activated with
the `-library:` instruction.

Make the library bundles available in a workspace repository (for example via
a Maven Bnd Repository index) and activate them in `cnf/build.bnd`:

```properties
# cnf/build.bnd
-library: fennec, fennecTest, fennecJacoco

github-orga:    my-organisation
github-project: my.repository
base-version:   1.0.0
```

Integration test projects additionally enable the project-level library in
their `bnd.bnd` and `.bndrun` files:

```properties
-library: enableOSGi-Test
```

See the [Getting Started guide](/guides/getting-started) for the full setup,
including the ready-made Bndtools workspace template.

The documentation here is the user-facing manual. Internal development notes
(CI details) live in the
[`docs/` folder on GitHub](https://github.com/eclipse-fennec/fennec.bnd.libraries/tree/snapshot/docs).
