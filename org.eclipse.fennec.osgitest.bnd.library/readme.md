# Bnd JUnit5 Jupiter and OSGi-Test Support

This library brings a default setup to use OSGi Test in Bndtools.

You can find the project here:
https://github.com/osgi/osgi-test

It uses AssertJ, JUnit5 and also brings dependencies to Mockito.

You simple have to include the Maven Dependency in your setup:

```
<dependency>
	<groupId>org.eclipse.fennec.bnd</groupId>
	<artifactId>org.eclipse.fennec.osgittest.bnd.library</artifactId>
	<version>0.0.x</version>
</dependency>

org.eclipse.fennec.bnd:org.eclipse.fennec.osgittest.bnd.library:0.0.x
```
## Library fennecTest

Calling the instruction:

**-library: fennecTest**

will enable the dependency setup automatically in Bnd.

A new repository will appear, that includes the JUnit5 Jupiter and OSGi-Test dependencies. In addition to that, some pre-configurations are done regarding setting a general test-path for Bnd projects.

### Default behavior

For ordinary unit testing in your project. You do not to do anything. JUnit5 testing is already configured, because the *-testpath* is configured by the library.

This library brings also the dependency *org.eclipse.fennec.osgittest.project.bnd.library*. This is also a library on top and contains project templates for JUnit5 / OSGi-Test enabled integration test projects.

## Gradle OSGi-Test Workspace Template

To enable JUnit5 and OSGi-Test testing on projects that are not based on the **fennec** library workspace, you have to enable JUnit5 testing for sub-projects in Gradle. The repositories definition is in any case needed, if you run Jacoco in a newer version of Gradle (> 7.5.1), otherwise it cannot fetch the Jacoco Ant dpendencies
For that you need to modify the *build.gradle* in your workspace:

```
repositories {
    mavenCentral()
}

subprojects {
  tasks.withType(Test) {
    useJUnitPlatform()
  }
}
```

This workspace template will do that for you. Please note, that it maybe possible, that you already have something in the *build.gradle* file, that would then be overwritten. In that case, you should not apply this template.