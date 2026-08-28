# fennecTest — Unit Testing

`-library: fennecTest` puts JUnit 5, [OSGi-Test](https://github.com/osgi/osgi-test),
AssertJ and Mockito on the test path of **every project** in the workspace, so
plain unit tests run without any per-project configuration. It is provided by
the `org.eclipse.fennec.osgitest.bnd.library` bundle and is enabled at the
**workspace level**, in `cnf/build.bnd`.

```properties
# cnf/build.bnd
-library: fennecTest
```

Requires **bnd 7.2 or newer**.

## What it configures

- Registers a read-only **“OSGi-Test Dependencies”** Maven repository (indexed
  by the library's `osgi-test.maven`) providing the JUnit, Mockito, AssertJ and
  OSGi-Test artifacts.
- Adds JUnit 5 Jupiter, AssertJ and Mockito to the workspace `-testpath`, so
  `src/test/java` tests compile and run out of the box.
- Adds `sun.misc`/`sun.reflect` to `-runsystempackages` for Mockito/Objenesis.
- Pulls in the companion **`enableOSGi-Test`** library
  (`org.eclipse.fennec.osgitest.project.bnd.library`), which adds the
  project-level and `.bndrun`-level setup for OSGi *integration* tests — see
  [enableOSGi-Test](enableosgi-test.md).

With `fennecTest` enabled you write ordinary JUnit 5 tests; the `-testpath` is
already configured for you.

## Dependency versions

The bundled dependency versions (defined in the library's `bnd.bnd`) are:

| Dependency | Version |
|---|---|
| JUnit Jupiter | 5.14.2 |
| JUnit Platform | 1.14.2 |
| OSGi-Test | 1.3.0 |
| Mockito | 5.21.0 |
| AssertJ | 3.27.7 |
| Byte Buddy | 1.18.4 |
| Objenesis | 3.5 |

## Gradle: enabling JUnit 5 on non-fennec workspaces

If your workspace is **not** based on the `fennec` workspace template, Gradle
still needs to be told to use the JUnit Platform. The library ships a
**“Fennec OSGi-Test/JUnit5 Workspace Extension”** template that writes the
required `build.gradle` for you:

```groovy
repositories {
    mavenCentral()
}

subprojects {
  tasks.withType(Test) {
    useJUnitPlatform()
  }
}
```

The `repositories { mavenCentral() }` block is also required when running JaCoCo
on Gradle &gt; 7.5.1, so it can fetch the JaCoCo Ant dependencies (see
[fennecJacoco](fennecjacoco.md)).

::: warning
The template overwrites `build.gradle`. If you already have content there, apply
the snippet manually instead of running the template.
:::

## Related guides

- [enableOSGi-Test](enableosgi-test.md) — OSGi in-framework integration tests
- [fennecJacoco](fennecjacoco.md) — code coverage for those tests
- [Templates](templates.md) — the workspace and project templates
