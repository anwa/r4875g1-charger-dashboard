# Changelog

## 0.4.1

HACS distribution and repository presentation update.

- document HACS installation, migration, updating and removal
- document the HACS-managed `/hacsfiles/` resource path
- add project-specific dashboard icon and logo assets
- add the official HACS repository validation workflow for plugin repositories
- document the published-release requirement used by HACS updates
- align repository documentation structure with the backend integration

## 0.4.0

First complete Charger setpoint-control milestone.

- group the normal operating setpoints into one dedicated section
- provide AC current limit, DC voltage limit and DC sum-power controls
- add a separate fallback-settings section
- provide fallback DC voltage and fallback DC current controls
- reuse the semantic Number-control architecture for all setpoints
- use Backend API Number metadata for range, step and unit
- wait for observed semantic state after setpoint writes
- keep fallback settings visually and architecturally separate from normal operating setpoints

## 0.3.0

First operational control milestone.

- add separate available and running rectifier status against the three Contract-1 units
- align rectifier status presentation with the Controller and HMI semantics
- add semantic Charger-wide START/STOP control through Backend API v1
- add START and STOP confirmation dialogs
- wait for observed Controller state before considering a command complete
- use the same 10-second command-pending timeout as the local HMI
- keep Home Assistant transport out of the presentation component
- preserve Charger Controller authority for lifecycle and safety decisions

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
