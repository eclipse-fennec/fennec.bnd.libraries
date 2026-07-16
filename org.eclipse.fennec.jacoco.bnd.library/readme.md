# Bnd JaCoCo Support

This library enables [JaCoCo](https://www.jacoco.org/jacoco/) code coverage
for OSGi projects in a bnd workspace: it adds the JaCoCo agent to the test
setup so unit and OSGi integration tests produce coverage data.

You simply have to include the Maven dependency in your setup:

```
<dependency>
	<groupId>org.eclipse.fennec.bnd</groupId>
	<artifactId>org.eclipse.fennec.jacoco.bnd.library</artifactId>
	<version>0.0.x</version>
</dependency>

org.eclipse.fennec.bnd:org.eclipse.fennec.jacoco.bnd.library:0.0.x
```

## Library fennecJacoco

Calling the instruction:

**-library: fennecJacoco**

in your workspace (*build.bnd*) will enable the JaCoCo setup automatically in
Bnd. It requires **bnd 7.1 or newer**.

The library:

* registers a read-only *Jacoco Dependencies* Maven repository that provides
  the JaCoCo artifacts (`jacoco.version` currently defaults to `0.8.14`),
* sets the `jacoco: true` flag so the workspace build wires the JaCoCo agent
  into test execution.

### Gradle and newer Jacoco versions

If you run JaCoCo with a newer version of Gradle (> 7.5.1), the workspace
*build.gradle* needs a `repositories { mavenCentral() }` block, otherwise
Gradle cannot fetch the JaCoCo Ant dependencies. The Gradle OSGi-Test
workspace template of
[org.eclipse.fennec.osgitest.bnd.library](../org.eclipse.fennec.osgitest.bnd.library/readme.md)
sets this up for you.
