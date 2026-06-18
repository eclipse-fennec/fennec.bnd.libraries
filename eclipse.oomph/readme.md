# Eclipse Fennec / DIM Oomph Setup

This folder contains the Eclipse Oomph setup for a ready-to-use Eclipse Fennec / DIM
development IDE based on **bndtools** (no PDE).

[Eclipse Oomph Project](https://projects.eclipse.org/projects/tools.oomph)

The `Fennec-IDE.setup` product brings a default Eclipse IDE with the features we use:

* Platform / RCP / JDT
* EGit + m2e
* EMF SDK (+ EMF Compare)
* Bndtools (pinned to **7.3.0**, supports Eclipse trains 2025-06 … 2026-03)

It also applies our defaults:

* **EPL-2.0 license header** code template matching our projects (e.g. `emf.codec`)
* Java **21** compiler compliance + a JavaSE-21 JRE task
* bndtools perspective, UTF-8 encoding, EGit user / signed-off-by, console buffer sizes
* Fennec / DIM bndtools workspace template repository

## Setting up the IDE with Oomph

1. Download the Eclipse Installer from <https://www.eclipse.org/downloads/> and start it.
2. Switch to **Advanced Mode** (menu, upper-right).
3. Press the green **+** and add this setup URL:

   ```
   https://raw.githubusercontent.com/eclipse-fennec/fennec.bnd.libraries/oomph/eclipse.oomph/Fennec-IDE.setup
   ```

   > Testing phase: the setup and fragment URLs currently point at the temporary `oomph`
   > branch (not `snapshot`/`main`) so the in-progress work can be tried without touching the
   > release branches. They will be switched to `snapshot`/`main` once promoted.

4. Pick **Eclipse Fennec / DIM IDE** under `<User Products>`, choose a *Product Version*
   (the Eclipse train, 2025-06 or newer), and continue.
5. On the variables page enable *Show all variables* and fill in the install location,
   workspace name and your Git name / email.
6. Finish to install.

## Supported Eclipse trains

| Version            | Java |
|--------------------|------|
| 2026-06 (latest)   | 21   |
| 2026-03            | 21   |
| 2025-12            | 21   |
| 2025-09            | 21   |
| 2025-06 (minimum)  | 21   |

## Notes / open items

* `eclipse.png` (Linux desktop branding icon) still needs to be committed to this folder.
* Workspace templates use the bndtools **fragment** mechanism (`-workspace-templates` /
  `../index.bnd`, see `../fragments/`). bndtools has no preference to pre-seed extra fragment
  indexes, so the Fennec index is added in the New Bnd Workspace wizard via '+' using the raw
  `index.bnd` URL (or by submitting the fragment to the `bndtools/workspace-templates` master
  index). The earlier OSGi-index/`cnf/release` approach and its dedicated bundle module were
  dropped in favour of fragments.
* A separate **project setup** for cloning + importing the Fennec git repositories is
  planned as a follow-up (`Fennec.setup`).
