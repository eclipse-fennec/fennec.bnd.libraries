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

**github-project:** - The name of the GitHub Repository e.g. **github-project: org.eclipse.fennec.emf.osgi**
**base-version:** - The default Bundle Version that is used, e.g. **base-version: 1.2.3.SNAPSHOT**

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

### Baselining 

Baselining is pre-configured for the Maven Central release repository. Baselining can then be activated for each project, if wanted using `-baseline: *`.

There is a variable that is preset to `fennecBaselining: true`.

If you set this variable to false in your *build.bnd*, baselining will be deactivated.

