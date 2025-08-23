# GitHub Actions CI/CD

This directory contains the CI/CD configuration for Eclipse Fennec Bndtools Libraries.

## Workflows

### `build.yml` - CI Build
- **Triggers**: All branches except `main` and `snapshot`, plus all pull requests
- **Purpose**: Validation builds for development and feature branches
- **Actions**: `./gradlew build --info`

### `release.yml` - Release Build
- **Triggers**: Pushes to `main` and `snapshot` branches only
- **Purpose**: Automated releases to Maven Central

#### Branch-specific Behavior:
- **`main` branch**: Production release to Central Portal with staging
  - Sets `DO_RELEASE=true`
  - Uses GPG signing
  - Calls `stage.sh` script for staging repository management
- **`snapshot` branch**: Snapshot release to Central snapshots
  - Sets `DO_RELEASE=false`
  - Direct upload to `central.sonatype.com/repository/maven-snapshots/`

## Scripts

### `stage.sh`
Manages Sonatype Central Portal staging repositories for production releases.

**Usage**: `./stage.sh <GROUP_ID>`

**Process**:
1. Searches for existing staging repositories by group ID
2. Finds the first available repository key
3. Initiates manual upload process for the staging repository
4. Sets `REPO_KEY` environment variable for subsequent steps

**Required Environment Variables**:
- `CS_USERNAME` - Central Sonatype username
- `CS_PASSWORD` - Central Sonatype password

**Error Handling**: All failures return `exit 1` to fail the build.

## Required Secrets

The following GitHub secrets must be configured:

- `CENTRAL_SONATYPE_TOKEN_USERNAME` - Central Portal API username
- `CENTRAL_SONATYPE_TOKEN_PASSWORD` - Central Portal API password  
- `GPG_PASSPHRASE` - GPG key passphrase for artifact signing
- `GPG_KEY_ID` - GPG key ID for signing
- `GPG_PRIVATE_KEY` - GPG private key for signing

## Release Process

1. **Development**: Work on feature branches → `build.yml` validates changes
2. **Snapshots**: Merge to `snapshot` branch → automatic snapshot release
3. **Production**: Merge to `main` branch → production release with staging