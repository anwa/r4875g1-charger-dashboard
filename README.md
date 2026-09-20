# R4875G1 Charger Dashboard

Frontend dashboard project for the R4875G1 three-phase charger.

## Development status

This repository is in early development. The current milestone provides only the TypeScript/Vite project bootstrap and the initial HACS-compatible dashboard package.

No functional charger dashboard is available yet.

## Requirements

- Home Assistant 2026.8 or newer
- the `R4875G1 Charger` Home Assistant integration
- Node.js and npm for local development

## Architecture

The dashboard will consume Backend API v1 from the `R4875G1 Charger` Home Assistant integration.

It will not depend on installation-specific ESPHome entity IDs and will not implement charger safety or control authority. The Charger Controller remains authoritative.

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
