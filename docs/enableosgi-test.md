# enableOSGi-Test — Integration Testing

`-library: enableOSGi-Test` configures **OSGi in-framework integration tests**:
tests that launch a real OSGi framework, resolve a set of bundles and exercise
your services with JUnit 5 and [OSGi-Test](https://github.com/osgi/osgi-test).
It is provided by the `org.eclipse.fennec.osgitest.project.bnd.library` bundle
and — unlike `fennec`/`fennecTest` — is enabled at the **project and `.bndrun`
level**, in a project's `bnd.bnd`.

```properties
# in the integration test project's bnd.bnd
-library: enableOSGi-Test
```

Requires **bnd 7.0 or newer**.

::: tip
If your workspace already enables [`-library: fennecTest`](fennectest.md), the
JUnit 5 / OSGi-Test *dependencies* are available workspace-wide;
`enableOSGi-Test` is the companion that turns a specific project into an
integration test.
:::

## On project level (`bnd.bnd`)

- Adds the JUnit 5, Mockito and OSGi-Test dependencies to the project
  `-buildpath`.
- Sets `Test-Cases` to discover every concrete class (indirectly) annotated
  with `org.junit.platform.commons.annotation.Testable`, so test classes are
  found automatically.

## On `.bndrun` level

- Selects the OSGi-Test tester (`-tester: biz.aQute.tester.junit-platform`).
- Adds the JUnit 5 launcher/engine, Mockito and OSGi-Test bundles to
  `-runbundles`, so a resolve/launch of the `.bndrun` produces a runnable
  integration test.
- Sets `-runproperties` including the
  `org.osgi.framework.bootdelegation=org.mockito.internal.creation.bytebuddy.inject`
  entry that Mockito 5 needs inside a framework.

## JaCoCo coverage

When [`fennecJacoco`](fennecjacoco.md) is enabled (`jacoco: true`),
`enableOSGi-Test` automatically adds the JaCoCo agent to the launch: it puts
`org.jacoco.agent` on the `-runpath` and adds a
`-javaagent:…=destfile=${target-dir}/test-osgi.exec` VM argument, so integration
test runs produce a coverage file.

## Project templates

The library ships two Bndtools **project** templates (visible in *New → Bnd
OSGi Project*):

- **OSGi-Test/JUnit5 Integration Test Project** — a ready-to-run integration
  test project for a given bundle, with `bnd.bnd`, a `test.bndrun`, a Gradle
  `build.gradle` wired for `testOSGi`, and an `ExampleTest`.
- **OSGi-Test/JUnit5 Integration TCK Test Project** — the same, shaped for TCK
  style test suites.

Both require `-library: enableOSGi-Test` to be active in the generated project.
See [Templates](templates.md).

## Related guides

- [fennecTest](fennectest.md) — the workspace-level dependency setup
- [fennecJacoco](fennecjacoco.md) — coverage for integration tests
- [Templates](templates.md) — the project templates in detail
