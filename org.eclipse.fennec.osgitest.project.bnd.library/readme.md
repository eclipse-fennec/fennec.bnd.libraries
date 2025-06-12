# Bnd OSGi-Test Integration Test Support

This library brings a default setup to use OSGi-Test integration testing in Bndtools.

You can find the project here:
https://github.com/osgi/osgi-test

It uses AssertJ, JUnit5 and also brings dependencies to Mockito.

You simple have to include the Maven Dependency in your setup:

```
<dependency>
	<groupId>org.eclipse.fennec.bnd</groupId>
	<artifactId>org.eclipse.fennec.osgittest.project.bnd.library</artifactId>
	<version>0.0.x</version>
</dependency>

org.eclipse.fennec.bnd:org.eclipse.fennec.osgittest.project.bnd.library:0.0.x
```
Please note: If you use the library instruction **-library: fennecTest** in your workspace (*build.bnd*), you will automatically have the current dependencies for JUnit 5 and OSGi Test. This library comes a companion to **org.eclipse.fennec.osgittest.bnd.library**.

## Library enableOSGi-Test

Calling the instruction:

**-library: enableOSGi-Test**

works on *bnd.bnd*, so on project and on *.bndrun* level. On project level, this library configures additional instruction to get an integration test and sets all JUnit 5 and OSGi-Test related dependencies on the build path.

On *bndrun* level, it configures the needed run-dependencies for JUnit 5 and OSGi-Test to conveniently resolve and launch an integration test.


## OSGi-Test Project Template

This project template creates an integration test project for a given bundle. It contains support for the OSGi-Test project and JUnit5 / Jupiter. It contains the configuration to run the integration tests with gradle, based on a bndrun-setup. 

For that it brings a *build.gradle* file that, activates that. Otherwise the task *testOSGi* will look into the *bnd.bnd* and try to run that.

this template works only together with the activated library **-library: enableOSGi-Test** in your project configuration set in the *bnd.bnd*.

This template creates a ready to run integration test project. 