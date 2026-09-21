# Changelog

## 0.2.0

First functional Home Assistant dashboard milestone.

- add typed Backend API v1 models and WebSocket client access
- add semantic subscription state reduction and `ChargerStore`
- add automatic single-instance Charger discovery
- add the first production `r4875g1-charger-overview-card`
- add aggregate AC and DC charger telemetry
- add role-level Home Assistant unit rendering
- add locale-aware numeric telemetry formatting
- keep frontend state independent from installation-specific entity IDs
- preserve Charger Controller authority and backend semantic boundaries

The dashboard remains under active development. Controls, rectifier detail views, cooling views and trends are not part of this release.

## 0.1.0

Initial project bootstrap.

- add TypeScript and Vite project structure
- add HACS dashboard package metadata
- add the initial distributable JavaScript bundle
- add initial project documentation
