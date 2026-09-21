# R4875G1 Charger Dashboard

Frontend dashboard project for the R4875G1 three-phase charger.

## Development status

Version 0.2.0 provides the first functional Home Assistant overview card.

The current milestone includes:

- Backend API v1 WebSocket access
- automatic discovery of a single Charger Instance
- semantic live subscriptions through `ChargerStore`
- rename-safe semantic state updates
- an initial `custom:r4875g1-charger-overview-card`
- aggregate AC and DC charger telemetry
- Home Assistant unit metadata from backend 1.1.0
- locale-aware numeric display formatting

The dashboard is still under active development. Controls, rectifier detail views, cooling views and trend/history presentation are later milestones.

## Requirements

- Home Assistant 2026.8 or newer
- `R4875G1 Charger` Home Assistant integration 1.1.0 or newer for telemetry units
- a Charger Controller exposing Home Assistant Contract 1
- Node.js and npm for local development

The dashboard remains compatible with older Backend API v1 releases, but telemetry units are only available when the backend exposes role-level `unit` metadata.

## Usage

After the dashboard bundle has been installed as a Home Assistant JavaScript module resource, add the overview card with:

```yaml
type: custom:r4875g1-charger-overview-card
```

When exactly one Charger Instance is available, it is selected automatically.

For installations with multiple Charger Instances, configure the desired backend config entry explicitly:

```yaml
type: custom:r4875g1-charger-overview-card
config_entry_id: YOUR_CONFIG_ENTRY_ID
```

## Architecture

The dashboard consumes Backend API v1 from the `R4875G1 Charger` Home Assistant integration.

It does not depend on installation-specific ESPHome entity IDs. Semantic role resolution, live subscriptions and controls remain behind the backend API.

The dashboard does not implement charger safety or control authority. The Charger Controller remains authoritative.

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

The distributable HACS bundle is generated as:

```text
dist/r4875g1-charger-dashboard.js
```

## HACS package

HACS metadata is defined in `hacs.json`. The generated JavaScript bundle under `dist/` is the only build artifact tracked in Git.
