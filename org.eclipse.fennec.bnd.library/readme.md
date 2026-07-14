# Bnd Fennec Setup Library

This library brings a default setup for Eclipse Fennec Projects in Bndtools.

You simple have to include the Maven Dependency in your setup:

```
<dependency>
	<groupId>org.eclipse.fennec.bnd</groupId>
	<artifactId>org.eclipse.fennec.bnd.library</artifactId>
	<version>0.0.x</version>
</dependency>

org.eclipse.fennec.bnd:org.eclipse.fennec.bnd.library:0.0.x
```

## Workspace Template
This project contains a workspace extension to Bndworkspace that adds a special *build.gradle*, that can be used with the **OSGi-Test** project. 

It enabled JUnit5 / Jupiter unit testing for all projects.

The setup also contains some files for the github actions. Sonarcube checks and license header checks are also activated.


## Library - fennec

Calling the instruction:

**-library: fennec**

will enable the setup automatically in Bnd.

A new Eclipse Fennec release repository will appear. 

In addition to that some pre-configurations are done to ease the use on project level. Defaults for the Manifests are set as well as license including.

### Default behavior

There are some mandatory properties to be set:

**github-project:** - The name of the GitHub Repository e.g. **github-project: org.eclipse.fennec.foo**
**base-version:** - The default Bundle Version that is used, e.g. **base-version: 1.2.3**

You should provide these information in your **build.bnd**, when this library is enabled.

### Releasing

If you want to release SNAPSHOTS just call:

**gradlew clean release**

This will release all artifacts into the **cnf/release** folder.

If you want to release final versions just call:

**gradlew clean release -Drelease.dir=cnf/release**

This will release all artifacts into the provided folder.

This setup also contains a configuration for automatically releasing snapshot to Maven Central Snapshots and Releases to the Staging repositories.

This action can only be triggered from our internal Jenkins instance.

### Release OBR

The library defines the `Release` repository as a `LocalIndexedRepo` in `cnf/release`. A release run (`DO_RELEASE=true`) publishes the exact bundles that go to Maven Central into this OBR as well — in the same run, so the checksums match. The release workflow can then push the content of `cnf/release` to a `release-obr` branch, where the index is served at `https://raw.githubusercontent.com/<orga>/<repo>/release-obr/index.xml`.

### Baselining

Baselining against the last release OBR is pre-configured but **off by default**. Activate it in your *build.bnd*:

**fennec-baselining: true**

This baselines all bundles (`-baseline: *`) against the `release-obr` branch of your repository (using `github-orga` and `github-project`). Package changes are only reported at MINOR/MAJOR level (`-diffpackages: *;threshold=MINOR`), so inlined generated version constants don't cause MICRO-level noise. Remember to bump `base-version` after each release.

The repository location can be overridden with **fennec-baseline-url** in your *build.bnd*.

