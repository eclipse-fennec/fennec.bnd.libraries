# Contributing to Eclipse Fennec — Bnd Libraries

Thank you for your interest in this project. Eclipse Fennec is an open-source
project hosted by the [Eclipse Foundation](https://www.eclipse.org) and
operated under the [Eclipse Development Process](https://www.eclipse.org/projects/dev_process/).
Contributions are welcome from the whole community.

* Project home: https://projects.eclipse.org/projects/technology.fennec
* This repository: https://github.com/eclipse-fennec/fennec.bnd.libraries
* Issue tracker: https://github.com/eclipse-fennec/fennec.bnd.libraries/issues
* Developer mailing list: https://accounts.eclipse.org/mailing-list/fennec-dev

## Eclipse Development Process

All contributions are governed by the Eclipse Foundation Development Process.
The most important points for new contributors:

* **Eclipse Contributor Agreement (ECA).** Every contributor must have a
  signed ECA on file at the Eclipse Foundation before any contribution can be
  merged. Sign it once at https://www.eclipse.org/legal/eca.html — it covers
  all your future contributions to any Eclipse project.
* **Sign your commits (DCO).** Every commit must carry a `Signed-off-by:`
  trailer that matches the email on your Eclipse Foundation account. This is
  the project's *Developer Certificate of Origin* declaration; see
  ["Sign your work"](#sign-your-work) below.
* **License.** All contributions are licensed under the
  [Eclipse Public License 2.0](https://www.eclipse.org/legal/epl-2.0/).
* **Intellectual Property.** Third-party dependencies introduced by a
  contribution must clear Eclipse IP review. Run the
  [Eclipse Dash License Tool](https://github.com/eclipse-dash/dash-licenses)
  before opening a pull request that touches dependencies (see
  ["Adding dependencies"](#adding-dependencies)).

Background reading:

* [Eclipse Development Process](https://www.eclipse.org/projects/dev_process/)
* [Eclipse Foundation Contributor Guide](https://www.eclipse.org/projects/handbook/#contributing)
* [Eclipse Code of Conduct](https://www.eclipse.org/org/documents/Community_Code_of_Conduct.php)

## What lives in this repository

This repository publishes [Bndtools Library](https://bnd.bndtools.org/instructions/library.html)
definitions and BND project / workspace templates that the rest of the
Eclipse Fennec source tree consumes via `-library:` directives. Changes here
ripple through every downstream Fennec build — please keep that in mind when
reviewing your own diff.

## Reporting issues

* Search the [issue tracker](https://github.com/eclipse-fennec/fennec.bnd.libraries/issues)
  first — your problem may already be reported.
* When filing a new issue, include the library name (`fennec`, `fennecTest`,
  `enableOSGi-Test`, `fennecJacoco`), the consumer's BND version, and a
  minimal reproducer.
* Security issues must **not** be reported as public GitHub issues. Follow
  the coordinated-disclosure process described in [`SECURITY.md`](SECURITY.md).

## Contributing code

We use a fork-and-pull-request workflow:

1. **Check the ECA.** Sign the Eclipse Contributor Agreement if you have not
   yet done so. The CI bot will block any PR without a signed ECA.
2. **Fork** this repository and create a topic branch off `snapshot`.
3. **Make focused commits.** Each commit should do one thing and keep the
   build green. Prefer several small, reviewable commits over a single large
   one. Use descriptive commit messages with a short subject line (≤ 72
   chars) and a body explaining *why* the change is needed.
4. **Add or update tests** for any behavior change. For library definitions,
   that often means a smoke build against a known downstream consumer.
5. **Run the build locally:**
   ```bash
   ./gradlew clean build
   ```
6. **Push** to your fork and open a Pull Request against the `snapshot`
   branch. Link the PR to an existing issue when possible.
7. **Wait for CI.** All status checks (build, license header check) must be
   green before review. See [docs/ci.md](docs/ci.md) for what each workflow
   does.

### Sign your work

Every commit must include a `Signed-off-by:` line that matches the email
registered with your Eclipse Foundation account. This is the project's DCO
sign-off — it declares that you wrote the change or otherwise have the right
to contribute it under the project's license.

The easiest way is to commit with `-s`:

```bash
git commit -s -m "Bump SLF4J coordinate in fennec library"
```

This appends a trailer like:

```
Signed-off-by: Jane Developer <jane@example.org>
```

To sign off all commits in an existing branch, use `git rebase` with
`--signoff`:

```bash
git rebase --signoff snapshot
```

### License headers

Every new source file (`.java`, `.gradle`, etc.) must start with the
following header. The license-header workflow rejects PRs that introduce
files without one.

```
/**
 * Copyright (c) 2026 Contributors to the Eclipse Foundation.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */
```

Excluded paths and supported file types are configured in
[`.licenserc.yaml`](.licenserc.yaml). The check is run locally with:

```bash
docker run --rm -v $(pwd):/github/workspace ghcr.io/apache/skywalking-eyes/license-eye header check
```

### Adding dependencies

Adding a new third-party library requires Eclipse IP clearance:

1. Run the Eclipse Dash License Tool over the project's dependencies.
2. Add any newly cleared dependencies to the [`DEPENDENCIES`](DEPENDENCIES)
   file at the repository root.
3. For dependencies that Dash marks as "restricted", file a Contribution
   Questionnaire (CQ) with the Eclipse IP team before merging the PR.

This is especially relevant in this repository because every coordinate
added to a library is automatically inherited by every consumer that
references the library.

## Coding style

* Match the surrounding files. Library definitions are terse — keep them
  that way.
* When changing a coordinate, also bump the library's own version so
  downstream BND workspaces can pin to the change explicitly.

## Build prerequisites

* Java 21 (LTS).
* No separate Gradle install needed — the project ships the Gradle Wrapper.

```bash
./gradlew clean build
```

## Project leads & committers

Current committers are listed on the
[Eclipse Fennec project page](https://projects.eclipse.org/projects/technology.fennec/who).
Becoming a committer follows the standard Eclipse process — sustained,
high-quality contributions over time, followed by a committer election.

## Contact

* Mailing list: [fennec-dev@eclipse.org](mailto:fennec-dev@eclipse.org)
  ([subscribe](https://accounts.eclipse.org/mailing-list/fennec-dev))
* Issues: https://github.com/eclipse-fennec/fennec.bnd.libraries/issues
