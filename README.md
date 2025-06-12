[![CI Build](https://github.com/eclipse-fennec/fennec.bnd.libraries/actions/workflows/build.yml/badge.svg)](https://github.com/eclipse-fennec/fennec.bnd.libraries/actions/workflows/build.yml)

# Fennec Bnd Libraries

This project contains **Bndtools Library** definitions..

You can take a look here about bnd libraries:

[https://bnd.bndtools.org/instructions/library.html](https://bnd.bndtools.org/instructions/library.html)

Beside that, some projects also contain *Bndtools* workspace and/or project templates.

## org.eclipse.fennec.bnd.library

Please refer to [Fennec Library Readme](org.eclipse.fennec.bnd.library/readme.md).

This project contains:

* Library **fennec**
* Workspace Template for Github *eclipse-fennec* - setup including sonar build and license check
* Project Templates:
  * **Configurator** - Template for the OSGi Configurator
  * **Library Repackaging** - OSGify external Libraries

## org.eclipse.fennec.osgitest.bnd.library

Please refer to [OSGi-Test/JUnit5 Readme](org.eclipse.fennec.osgitest.bnd.library/readme.md).

This project contains:

* Library **fennecTest** to enable JUnit5 and OSGi-Test dependencies
* Workspace extension to enable JUnit5 Jupiter and OSGi-Test for Gradle builds in bnd-workspace shapes

## org.eclipse.fennec.osgitest.project.bnd.library

Please also refer to [OSGi-Test Integration Test Readme](org.elcipse.fennec.osgitest.project.bnd.library/readme.md).

This project contains:

* Library **enableOSGi-Test** for integration test projects and *bndrun*-files
* Project Template for **OSGi-Test** - integration testing

## org.eclipse.fennec.jacoco.bnd.library

* Library **fennecJacoco** - Enables Jacoco for your OSGi Project. Its adds the agent to the setup

## Maven Central Release

