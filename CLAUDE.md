# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fennec Bnd Libraries provides Bndtools library definitions for the Eclipse Fennec ecosystem. These libraries are distributed as Maven artifacts and provide standardized workspace/project templates, testing infrastructure, and code coverage for OSGi/bnd-based development.

## Build Commands

```bash
# Build (runs tests automatically)
./gradlew build --info

# Release build (for Maven Central)
./gradlew release --info

# Clean snapshot release
./gradlew clean release
```

The build uses Gradle with the `biz.aQute.bnd.workspace` plugin (v7.2.1). Java 17 is the target version; CI uses Java 21.

## Architecture

This is a **Bnd workspace** with four library modules, each providing a `-library:` instruction:

| Module | Library Name | Purpose |
|--------|-------------|---------|
| `org.eclipse.fennec.bnd.library` | `fennec` | Default workspace/project templates (GitHub CI, Configurator, library repackaging) |
| `org.eclipse.fennec.osgitest.bnd.library` | `fennecTest` | JUnit5 Jupiter + OSGi-Test + AssertJ + Mockito dependencies |
| `org.eclipse.fennec.osgitest.project.bnd.library` | `enableOSGi-Test` | Integration test project templates (osgi-test, osgi-tck) |
| `org.eclipse.fennec.jacoco.bnd.library` | `fennecJacoco` | Jacoco code coverage for OSGi testing |

### Key Configuration

- **`cnf/build.bnd`** — Master workspace config (group ID: `org.eclipse.fennec.bnd`, base version: `0.0.4`)
- **`cnf/releng/`** — Release engineering: `release.bnd` (removes -SNAPSHOT), `snapshot.bnd` (adds -SNAPSHOT), `central.bnd` (Maven Central config)
- **`build.gradle`** — Root config with SonarQube, Jacoco, and JUnit5 platform setup

### Module Structure

Each module contains:
- `bnd.bnd` — Bundle configuration declaring provided capabilities (workspace templates, library resources, project templates)
- `resources/` — Template files (build.gradle, bnd files, project scaffolding) that get included in the library artifact
- `readme.md` — Usage instructions

### CI/CD Workflows

- **`build.yml`** — Runs on all branches except `main`/`snapshot` and all PRs
- **`release.yml`** — Triggered on push to `main`; GPG-signs and stages to Sonatype Central Portal
- **`snapshot.yml`** — Triggered on push to `snapshot`; publishes to Maven snapshots
- **`.github/scripts/stage.sh`** — Manages Sonatype Central Portal staging repositories
