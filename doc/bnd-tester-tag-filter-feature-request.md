# Feature Request: JUnit 5 Tag Filtering for `biz.aQute.tester.junit-platform`

## Summary

Add support for JUnit 5 `@Tag` based test filtering in the bnd JUnit Platform tester via new `tester.include.tags` and `tester.exclude.tags` framework properties. This enables use cases like separating performance tests (`@Tag("perf")`) from regular test runs in OSGi integration testing.

## Motivation

JUnit 5 provides `@Tag` annotations for categorizing tests (e.g., `@Tag("perf")`, `@Tag("slow")`, `@Tag("integration")`). Gradle's native `Test` task supports filtering by tags via `useJUnitPlatform { includeTags / excludeTags }`, and the JUnit Platform Launcher API provides `TagFilter` for this purpose.

However, OSGi integration tests executed via `biz.aQute.tester.junit-platform` currently have **no mechanism to filter by tags**. The only existing filter is `tester.names`, which matches by fully-qualified class or method name — it has no tag awareness.

This gap means that OSGi projects cannot use the same `@Tag`-based workflow that works for plain JUnit tests. For example, a project wanting to run performance tests separately must either:

- Create entirely separate test bundles (structural overhead)
- List test classes explicitly via `tester.names` (brittle, defeats the purpose of tags)

### Use Case: Performance Test Separation

In a typical Gradle + bnd workspace:

```groovy
// Regular JUnit tests: exclude @Tag("perf")
test {
    useJUnitPlatform {
        excludeTags 'perf'
    }
}

// Dedicated performance test task
tasks.register('perfTest', Test) {
    useJUnitPlatform {
        includeTags 'perf'
    }
    ignoreFailures = true
}
```

The equivalent for OSGi tests would be a `perfTestOSGi` task using a separate `.bndrun` file with `-runproperties: tester.include.tags=perf`. This is currently not possible.

## Current State Analysis

### `Activator.buildRequest()` (lines 379-390)

The `LauncherDiscoveryRequest` is built with only selectors and configuration parameters — **no filters are ever added**:

```java
LauncherDiscoveryRequest buildRequest(List<? extends DiscoverySelector> selectors) {
    Optional<String> captureStdout = Optional
        .ofNullable(context.getProperty(LauncherConstants.CAPTURE_STDOUT_PROPERTY_NAME));
    Optional<String> captureStderr = Optional
        .ofNullable(context.getProperty(LauncherConstants.CAPTURE_STDERR_PROPERTY_NAME));
    return LauncherDiscoveryRequestBuilder.request()
        .configurationParameter(BundleEngine.CHECK_UNRESOLVED, unresolved)
        .configurationParameter(LauncherConstants.CAPTURE_STDOUT_PROPERTY_NAME, captureStdout.orElse("true"))
        .configurationParameter(LauncherConstants.CAPTURE_STDERR_PROPERTY_NAME, captureStderr.orElse("true"))
        .selectors(selectors)
        .build();
}
```

The `LauncherDiscoveryRequestBuilder.filters()` API is never called. The `SubDiscoveryRequest` proxy in `BundleSelectorResolver` already delegates `getFiltersByType()` to the original request, so any filters added here would propagate correctly to sub-engines like JUnit Jupiter.

### `TesterConstants` (existing properties)

```
tester.controlport   - IDE control protocol port
tester.port          - JUnit Eclipse listener port
tester.host          - JUnit listener host
tester.names         - FQN class/method name filter
tester.dir           - Test report output directory
tester.continuous    - Re-run on bundle restart
tester.trace         - Enable trace logging
tester.unresolved    - Unresolved bundle handling
tester.separatethread - Run tests on separate thread
```

### Why `${classes}` macros cannot solve this

The bnd `${classes}` macro (used to populate the `Test-Cases` header) only matches on annotation **type names**, not annotation **values**. The annotation element values are discarded during class analysis in `Clazz.processAnnotation()`. Therefore:

- `${classes;ANNOTATED;org.junit.jupiter.api.Tag}` matches **any** `@Tag` regardless of value
- There is no way to write `${classes;ANNOTATED;org.junit.jupiter.api.Tag("perf")}` — this is not supported

Filtering must happen at the JUnit Platform Launcher level, not at the `Test-Cases` header level.

## Proposed Implementation

### 1. Add constants to `TesterConstants.java`

**File:** `biz.aQute.tester/src/aQute/junit/constants/TesterConstants.java`

```java
/**
 * Comma-separated list of JUnit 5 tags to include. Only tests with at
 * least one of these tags will be executed. Requires the JUnit Platform
 * tester. Uses {@link org.junit.platform.launcher.TagFilter#includeTags}.
 */
String TESTER_INCLUDE_TAGS = "tester.include.tags";

/**
 * Comma-separated list of JUnit 5 tags to exclude. Tests with any of
 * these tags will be skipped. Requires the JUnit Platform tester. Uses
 * {@link org.junit.platform.launcher.TagFilter#excludeTags}.
 */
String TESTER_EXCLUDE_TAGS = "tester.exclude.tags";
```

### 2. Modify `Activator.buildRequest()`

**File:** `biz.aQute.tester.junit-platform/src/aQute/tester/junit/platform/Activator.java`

```java
import org.junit.platform.launcher.TagFilter;

// ...

LauncherDiscoveryRequest buildRequest(List<? extends DiscoverySelector> selectors) {
    Optional<String> captureStdout = Optional
        .ofNullable(context.getProperty(LauncherConstants.CAPTURE_STDOUT_PROPERTY_NAME));
    Optional<String> captureStderr = Optional
        .ofNullable(context.getProperty(LauncherConstants.CAPTURE_STDERR_PROPERTY_NAME));

    LauncherDiscoveryRequestBuilder builder = LauncherDiscoveryRequestBuilder.request()
        .configurationParameter(BundleEngine.CHECK_UNRESOLVED, unresolved)
        .configurationParameter(LauncherConstants.CAPTURE_STDOUT_PROPERTY_NAME, captureStdout.orElse("true"))
        .configurationParameter(LauncherConstants.CAPTURE_STDERR_PROPERTY_NAME, captureStderr.orElse("true"))
        .selectors(selectors);

    String includeTags = context.getProperty(TESTER_INCLUDE_TAGS);
    if (includeTags != null && !includeTags.isBlank()) {
        builder.filters(TagFilter.includeTags(
            Arrays.stream(includeTags.split("\\s*,\\s*"))
                .filter(s -> !s.isEmpty())
                .toList()));
        trace("include tags filter set to %s", includeTags);
    }

    String excludeTags = context.getProperty(TESTER_EXCLUDE_TAGS);
    if (excludeTags != null && !excludeTags.isBlank()) {
        builder.filters(TagFilter.excludeTags(
            Arrays.stream(excludeTags.split("\\s*,\\s*"))
                .filter(s -> !s.isEmpty())
                .toList()));
        trace("exclude tags filter set to %s", excludeTags);
    }

    return builder.build();
}
```

### 3. Add import for static constants

Add to the existing static imports at the top of `Activator.java`:

```java
import static aQute.junit.constants.TesterConstants.TESTER_INCLUDE_TAGS;
import static aQute.junit.constants.TesterConstants.TESTER_EXCLUDE_TAGS;
```

## How It Would Be Used

### In a `.bndrun` file

```properties
# Run only performance-tagged tests
-runproperties: \
    tester.include.tags=perf

# Or exclude performance tests from the default run
-runproperties: \
    tester.exclude.tags=perf
```

### In a Fennec bnd workspace with Gradle

A project could have two `.bndrun` files:

**`test.bndrun`** (default OSGi tests, excluding perf):
```properties
-library: enableOSGi-Test
-runrequires: bnd.identity;id='${project.name}'
-runbundles.test: ${project.name};version=snapshot
-runfw: org.apache.felix.framework
-runee: JavaSE-17
-runproperties: \
    tester.exclude.tags=perf
```

**`perf-test.bndrun`** (performance tests only):
```properties
-library: enableOSGi-Test
-runrequires: bnd.identity;id='${project.name}'
-runbundles.test: ${project.name};version=snapshot
-runfw: org.apache.felix.framework
-runee: JavaSE-17
-runproperties: \
    tester.include.tags=perf
```

**`build.gradle`** (Gradle task for perf OSGi tests):
```groovy
def resolveTask = tasks.named("resolve.test") {
    outputBndrun = layout.buildDirectory.file("test.bndrun")
}

tasks.named("testOSGi") {
    bndrun = resolveTask.flatMap { it.outputBndrun }
}

// Performance OSGi tests
def resolvePerfTask = tasks.register("resolve.perfTest", Resolve) {
    outputBndrun = layout.buildDirectory.file("perf-test.bndrun")
}

tasks.register("perfTestOSGi", TestOSGi) {
    bndrun = resolvePerfTask.flatMap { it.outputBndrun }
    ignoreFailures = true
}
```

## Scope of Changes

| File | Change |
|------|--------|
| `biz.aQute.tester/src/aQute/junit/constants/TesterConstants.java` | Add `TESTER_INCLUDE_TAGS` and `TESTER_EXCLUDE_TAGS` constants |
| `biz.aQute.tester.junit-platform/src/aQute/tester/junit/platform/Activator.java` | Read tag properties and add `TagFilter` to `LauncherDiscoveryRequest` |

### Dependencies

The `TagFilter` class is part of `org.junit.platform.launcher` which is already on the tester's classpath (it uses `Launcher`, `LauncherDiscoveryRequest`, etc. from the same package).

## Testing

### Unit/Integration Tests to Add

1. **No tags configured** — existing behavior unchanged, all tests run
2. **`tester.include.tags=perf`** — only `@Tag("perf")` tests execute
3. **`tester.exclude.tags=perf`** — all tests except `@Tag("perf")` execute
4. **Both properties set** — include + exclude are additive (JUnit Platform handles precedence)
5. **Multiple tags** — `tester.include.tags=perf,slow` includes tests tagged with either
6. **Empty/blank values** — gracefully ignored, no filter applied

### Existing Test Suite

Check for existing tester tests in:
- `biz.aQute.tester.junit-platform/test/`
- `biz.aQute.tester.test/`

## Compatibility

- **Backward compatible** — when neither property is set, behavior is identical to current implementation
- **JUnit Platform tester only** — the older `aQute.junit` tester (JUnit 4) does not use the Launcher API and would not support this. The constants are defined in the shared `TesterConstants` but only read by the JUnit Platform tester
- **Tag expressions** — JUnit 5.1+ supports tag expressions (e.g., `perf & !slow`). A future enhancement could support `tester.tag.expression` using `TagFilter.includeTags(TagExpression)`, but simple comma-separated lists cover the primary use case
