# fennecJacoco — Code Coverage

`-library: fennecJacoco` enables [JaCoCo](https://www.jacoco.org/jacoco/) code
coverage for OSGi projects: it makes the JaCoCo dependencies available and sets
the flag that wires the JaCoCo agent into test execution. It is provided by the
`org.eclipse.fennec.jacoco.bnd.library` bundle and is enabled at the
**workspace level**, in `cnf/build.bnd`.

```properties
# cnf/build.bnd
-library: fennecJacoco
```

Requires **bnd 7.1 or newer**.

## What it configures

- Registers a read-only **“Jacoco Dependencies”** Maven repository providing the
  JaCoCo artifacts. The version defaults to `jacoco.version = 0.8.14`; override
  it in `cnf/build.bnd` if you need a different release.
- Sets `jacoco: true`, the flag the workspace build and the
  [`enableOSGi-Test`](enableosgi-test.md) library check to decide whether to
  attach the JaCoCo agent.

## Coverage for OSGi integration tests

`fennecJacoco` on its own provides the dependencies and the flag. The actual
agent attachment for **in-framework integration tests** happens in
[`enableOSGi-Test`](enableosgi-test.md): when `jacoco` is set, it adds
`org.jacoco.agent` to the `-runpath` and a
`-javaagent:…=destfile=${target-dir}/test-osgi.exec` VM argument to the launch,
producing a coverage file per test run.

## Gradle note

When running JaCoCo with Gradle &gt; 7.5.1, the workspace `build.gradle` needs a
`repositories { mavenCentral() }` block so Gradle can fetch the JaCoCo Ant
dependencies. The Gradle OSGi-Test workspace extension template from
[`fennecTest`](fennectest.md) sets this up for you.

## Related guides

- [enableOSGi-Test](enableosgi-test.md) — where the agent is attached to
  integration test launches
- [fennecTest](fennectest.md) — the JUnit 5 / OSGi-Test dependency setup
