<p align="center">
  <img
    src="https://raw.githubusercontent.com/anwa/r4875g1-charger-dashboard/main/brand/logo.png"
    alt="R4875G1 Charger Dashboard"
    width="620">
</p>

# R4875G1 Charger Dashboard for Home Assistant

Home Assistant dashboard frontend for the R4875G1 three-phase charger project.

It consumes the stable semantic Backend API exposed by the separate `R4875G1 Charger` Home Assistant integration. The dashboard never depends on installation-specific ESPHome entity IDs and does not move charger safety or lifecycle authority away from the Charger Controller.

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=anwa&repository=r4875g1-charger-dashboard&category=plugin">
    <img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open R4875G1 Charger Dashboard in HACS">
  </a>
</p>

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Updating](#updating)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [HACS package](#hacs-package)
- [Branding](#branding)
- [Repository relationship](#repository-relationship)
- [Release status and compatibility](#release-status-and-compatibility)
- [Development](#development)
- [Removal](#removal)

## Requirements

- Home Assistant 2026.8 or newer
- HACS for the recommended installation method
- `R4875G1 Charger` Home Assistant integration 1.2.0 or newer
- a Charger Controller exposing Home Assistant Contract 1
- Backend API v1 available through the configured Charger integration

The backend integration must be installed and configured before this dashboard can connect to a Charger Instance.

## Installation

<details open>
<summary><b>Install with HACS (recommended)</b></summary>

HACS is the recommended installation and update method. Use the button above or add this repository manually as a custom Dashboard repository.

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu in the upper-right corner.
3. Select **Custom repositories**.
4. Enter `https://github.com/anwa/r4875g1-charger-dashboard`.
5. Select **Dashboard** as the repository type.
6. Select **Add**.
7. Open **R4875G1 Charger Dashboard** in HACS.
8. Select **Download** and keep the newest stable release selected unless you intentionally need an older version.
9. Open **Settings -> Dashboards -> Resources** and verify that HACS registered the JavaScript module resource.

The HACS-managed resource should resolve through:

```text
/hacsfiles/r4875g1-charger-dashboard/r4875g1-charger-dashboard.js
```

HACS may append its own `hacstag` query parameter to the resource URL. Keep the HACS-managed resource unchanged.

After the resource is available, add the dashboard card as described under [Configuration](#configuration).

</details>

<details>
<summary><b>Manual installation</b></summary>

Manual installation remains available as a development or fallback path.

1. Download or clone the desired release.
2. Copy `dist/r4875g1-charger-dashboard.js` to `/config/www/r4875g1-charger-dashboard.js`.
3. Open **Settings -> Dashboards -> Resources**.
4. Add `/local/r4875g1-charger-dashboard.js` as a **JavaScript module**.
5. Refresh the browser.
6. Add the card as described under [Configuration](#configuration).

Manual installations are not managed by HACS and therefore do not receive HACS update notifications.

</details>

### Migrating from the previous manual `/local` installation

If the dashboard was previously loaded manually from:

```text
/local/r4875g1-charger-dashboard.js
```

install the repository through HACS first and verify that the HACS resource exists. Then remove the old manual `/local/...` resource so that Home Assistant does not load two copies of the same custom element.

Do not keep both the manual and HACS resource entries active.

## Configuration

Add the overview card with:

```yaml
type: custom:r4875g1-charger-overview-card
```

When exactly one Charger Instance is available, it is selected automatically.

For installations with multiple Charger Instances, configure the desired backend config entry explicitly:

```yaml
type: custom:r4875g1-charger-overview-card
config_entry_id: YOUR_CONFIG_ENTRY_ID
```

### Current overview capabilities

The current frontend provides:

- aggregate AC power, voltage and current
- aggregate DC power, voltage and current
- highest rectifier output temperature
- conversion efficiency
- available and running rectifier counts
- expandable live detail views for Rectifier Units 1-3
- per-rectifier START and STOP with confirmation and observed-state completion
- compartment cooling environment telemetry
- optional external cooling status, PWM and fan telemetry
- external cooling automatic-mode control with confirmation and observed-state completion
- external cooling fan-power control with confirmation and observed-state completion
- external cooling manual-PWM control using Backend API Number metadata
- Charger-wide START and STOP with confirmation
- AC current-limit control
- DC voltage-limit control
- DC sum-power control
- separate fallback DC voltage and current controls
- observed-state confirmation after operational commands and setpoint writes

Trend/history presentation remains a later milestone.

## Updating

HACS tracks the repository after installation and can offer a newer stable GitHub Release when one is published.

To install an update:

1. Open the Home Assistant update notification or **R4875G1 Charger Dashboard** in HACS.
2. Review the release notes.
3. Install the offered update.
4. Reload the affected dashboard or refresh the browser if the frontend was already open.

HACS serves dashboard resources through `/hacsfiles/` with cache-control behavior intended for managed dashboard elements, so version query strings such as the old `/local/...js?v=...` development workflow are not required for the HACS resource.

To request an immediate metadata refresh after a release is published, open the repository in HACS, open its three-dot menu and select **Update information**.

Refreshing repository information does not install a new version by itself.

## Troubleshooting

### The card type is not found after HACS installation

Verify that HACS downloaded the repository and that **Settings -> Dashboards -> Resources** contains the HACS-managed module.

The expected resource path begins with:

```text
/hacsfiles/r4875g1-charger-dashboard/
```

If the resource exists, refresh the browser before adding the card again.

### The old card is still loaded after migrating to HACS

Check **Settings -> Dashboards -> Resources** for a remaining manual `/local/r4875g1-charger-dashboard.js` entry.

Only the HACS-managed `/hacsfiles/...` resource should remain after migration.

### No Charger Instance is available

The separate `R4875G1 Charger` backend integration must already be configured and must have a compatible Charger Controller online.

Verify:

- the ESPHome Charger Controller exists in Home Assistant
- the R4875G1 Charger integration is configured for that Controller
- Home Assistant Contract 1 is available
- the backend integration reports the Charger Instance as usable

### Multiple Charger Instances are found

Automatic selection is intentionally limited to installations with exactly one Charger Instance.

Set the desired backend config entry explicitly:

```yaml
type: custom:r4875g1-charger-overview-card
config_entry_id: YOUR_CONFIG_ENTRY_ID
```

### HACS does not show a newly published release

HACS follows published GitHub Releases for this repository.

Use **three-dot menu -> Update information** on the repository to request a metadata refresh.

If the new version is still unavailable, verify that it was published as a GitHub Release and not only created as a Git tag.

### A control call succeeds but the displayed state does not change

The dashboard intentionally does not treat a successful Home Assistant service call as proof that the Charger Controller changed state.

START, STOP, Switch and Number controls wait for semantic state updates from the backend. If the expected Controller state is not observed within the configured UI timeout, the dashboard reports a timeout instead of presenting an optimistic state.

## Architecture

The dashboard consumes Backend API v1 from the separate `R4875G1 Charger` Home Assistant integration.

The frontend uses semantic roles such as:

```text
charger.ac.power
charger.dc.voltage
charger.command.start
charger.ac.current_limit
charger.fallback.voltage_setpoint
```

It does not use installation-specific ESPHome entity IDs.

The backend resolves semantic roles, enforces Home Assistant permissions and exposes semantic control metadata for writable Number and Switch roles. The frontend renders state and dispatches allow-listed semantic controls through that backend without knowing Home Assistant entity IDs, domains or service names.

The Charger Controller remains authoritative for:

- charger lifecycle
- CAN communication
- thermal protection
- START eligibility
- blackstart behavior
- rectifier safety checks
- actual Controller state transitions

The dashboard is an HMI only.

## HACS package

The HACS Dashboard package is described by `hacs.json`.

The distributable frontend bundle is:

```text
dist/r4875g1-charger-dashboard.js
```

The repository name and JavaScript filename intentionally match:

```text
r4875g1-charger-dashboard
r4875g1-charger-dashboard.js
```

HACS therefore discovers the bundle directly from `dist/`.

When GitHub Releases exist, HACS uses the selected release contents when downloading or upgrading. Stable HACS updates therefore require a published GitHub Release, not only a Git tag.

Repository validation is performed by:

```text
.github/workflows/validate.yml
```

using the official HACS validation action with repository category `plugin`.

## Branding

Repository branding is stored in:

```text
brand/
├── icon.png
├── logo.png
└── README.md
```

`icon.png` is a 256 x 256 square PNG.

`logo.png` is a 768 x 256 landscape PNG. Its shortest side is 256 pixels.

The README uses an absolute raw GitHub URL for `logo.png` so that HACS and other renderers outside the normal GitHub repository context can resolve the image.

These assets identify the dashboard repository. They are separate from the local integration brand assets shipped by the backend integration.

## Repository relationship

Backend Home Assistant integration:

```text
anwa/homeassistant-r4875g1-charger
```

Controller and Remote HMI firmware:

```text
anwa/esphome-r4875g1-3phase-charger
```

The firmware defines the authoritative Home Assistant Contract. The backend resolves that contract into Backend API v1. This repository renders the resulting semantic state and controls.

## Release status and compatibility

Version 0.8.0 adds observed-state external cooling controls for automatic mode, fan power and the manual PWM setpoint.

The dashboard is still pre-1.0 software. Minor versions may add substantial new frontend capabilities, while the backend API and Home Assistant Contract remain independently versioned.

Current baseline:

- Home Assistant 2026.8 or newer
- Backend API v1
- R4875G1 Charger backend 1.2.0 or newer
- Home Assistant Contract 1

A future breaking dashboard configuration change should be documented explicitly in the corresponding release notes.

## Development

Install dependencies:

```text
npm install
```

Run the TypeScript check:

```text
npm run typecheck
```

Build the dashboard bundle:

```text
npm run build
```

The build output is:

```text
dist/r4875g1-charger-dashboard.js
```

Before committing a functional or packaging change, run:

```text
npm run typecheck
npm run build
git diff --check
```

## Removal

To remove the dashboard completely:

1. Remove cards using `custom:r4875g1-charger-overview-card` from Home Assistant dashboards.
2. Remove **R4875G1 Charger Dashboard** from HACS if it was installed through HACS.
3. Verify that the HACS-managed resource was removed from **Settings -> Dashboards -> Resources**.
4. Remove any remaining manual `/local/r4875g1-charger-dashboard.js` resource if an older manual installation existed.

Removing this dashboard does not remove the backend integration, the ESPHome Charger Controller device or the Controller firmware.
