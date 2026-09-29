# Changelog

## 1.0.4

Grafana Rectifier history and sample-and-hold plotting.

- add Rectifier DC Power comparison for Units 1-3
- add Rectifier DC Current comparison for Units 1-3
- add Rectifier Output Temperature comparison for Units 1-3
- refresh the Grafana dashboard automatically every 10 seconds
- use InfluxQL `fill(previous)` for numeric history queries
- keep Grafana-side null spanning disabled to avoid artificial long ramps
- use a consistent light area fill across history panels
- keep all Rectifier queries portable through the shared data-source and Charger-instance variables
- update the Grafana dashboard documentation
- bump the dashboard development version to 1.0.4

## 1.0.3

Grafana DC current-limit analysis.

- add a combined DC Current Limits history panel
- compare requested, effective, thermal and applied current limits
- use one shared Ampere scale and explicit series aliases
- keep all current-limit queries portable through the shared data-source and Charger-instance variables
- update the Grafana dashboard documentation for the production overview and limits view
- bump the dashboard development version to 1.0.3

## 1.0.2

First production Grafana Charger overview.

- replace the initial validation panel with the first production history overview
- add combined AC and DC power history
- add Charger conversion-efficiency history
- add aggregate DC voltage and current history
- use explicit Grafana units and Controller measurement precision
- keep all overview queries portable through the shared data-source and Charger-instance variables
- bump the dashboard development version to 1.0.2

## 1.0.1

Grafana history-dashboard foundation.

- add a version-controlled Grafana V2 dashboard resource
- add portable InfluxDB data-source and Charger-instance variables
- keep historical telemetry on the existing Home Assistant/InfluxDB path
- add the first portable AC Voltage Unit 1 validation panel
- document normal Grafana import and Git Sync usage
- document Grafana portability and read-only architecture rules
- keep Grafana outside the Charger control path
- bump the dashboard development version to 1.0.1

## 1.0.0

Stable live-HMI baseline.

- define the Home Assistant dashboard as the stable live monitoring and control surface
- keep Charger lifecycle, safety and actual state transitions authoritative in the Charger Controller
- keep all frontend state and controls behind Backend API semantic roles
- preserve observed-state confirmation for Charger, Rectifier, Switch and Number controls
- keep historical telemetry and trend analysis outside the live dashboard frontend
- use Home Assistant time-series storage and Grafana for historical analysis instead of duplicating history transport through Backend API v1
- establish the existing card configuration and Backend API v1 integration as the 1.x compatibility baseline
- keep the R4875G1 Charger backend 1.3.0 compatibility baseline

## 0.12.1

Dashboard architecture cleanup.

- reuse the shared collapsible-section component for Controller diagnostics
- remove duplicate Controller diagnostics details, arrow and header styling
- preserve Controller diagnostics capability-status presentation
- remove duplicate Rectifier capability entries from the README
- rebuild the dashboard bundle
- bump the dashboard version to 0.12.1

## 0.12.0

Dashboard usability and documentation milestone.

This is the next HACS-facing release after 0.11.0 and consolidates the
0.11.1-0.11.3 development refinements listed below.

- keep the Charger-wide START/STOP control directly below the status summary
- use one reusable collapsible-section architecture across the larger dashboard areas
- keep Operational setpoints, Fallback settings, Advanced Charger, Rectifiers, Enclosure cooling and Controller diagnostics compact when not needed
- preserve independent expansion for each Rectifier Unit and the nested enclosure Fan control
- distinguish internal Rectifier thermal/fan telemetry from enclosure cooling and fan control
- improve Controller diagnostics formatting and readability
- add a comprehensive visual dashboard guide with screenshots
- preserve Backend API semantic roles, observed-state confirmation and Charger Controller authority
- keep the R4875G1 Charger backend 1.3.0 compatibility baseline

## 0.11.3

Dashboard structure and enclosure-cooling terminology refinement.

- move the Charger-wide START/STOP control ahead of Operational setpoints
- make Operational setpoints collapsible
- reuse the shared collapsible-section component for Fallback settings
- render Controller Device Info `|` separators as line breaks
- rename Cooling to Enclosure cooling to distinguish it from Rectifier cooling
- rename External cooling to Fan control
- align enclosure cooling terminology throughout the dashboard
- rebuild the dashboard bundle
- bump the dashboard development version to 0.11.3

## 0.11.2

Collapsible dashboard-section refinement.

- add a reusable collapsible-section component
- make Advanced Charger collapsible
- make the complete Rectifiers section collapsible while preserving per-unit expansion
- make Cooling collapsible
- make External cooling independently collapsible
- initially move Operational setpoints ahead of Advanced Charger
- place the Charger power control directly below Operational setpoints
- rebuild the dashboard bundle
- bump the dashboard development version to 0.11.2

## 0.11.1

Controller diagnostics presentation refinement.

- align the Controller diagnostics title beside the expand arrow
- display CPU frequency in MHz
- display heap and PSRAM values in kB with three decimal places
- format uptime as `dd hh:mm:ss`
- stack the System diagnostic fields vertically to reduce text wrapping
- make metric formatting and stacked layout reusable
- rebuild the dashboard bundle
- bump the dashboard development version to 0.11.1

## 0.11.0

Controller diagnostics milestone.

- add a collapsible optional Controller diagnostics section
- show Controller battery voltage and state of charge
- show CPU temperature/frequency, loop time, heap, PSRAM, uptime and WiFi RSSI
- show ESPHome version, device information and reset reason
- group diagnostics into Controller battery, runtime and system sections
- reuse the shared semantic metric-grid presentation
- preserve partial optional-capability visibility and report missing roles as unavailable
- keep diagnostics read-only and based only on Backend API semantic roles
- keep the R4875G1 Charger backend 1.3.0 compatibility baseline

## 0.10.0

Advanced Charger control milestone.

- add writable DC current-setpoint control
- add writable internal rectifier-fan minimum-duty control
- reuse the existing semantic Number-control architecture and Backend API metadata
- wait for observed semantic Number state before completing Advanced Charger writes
- preserve capability-aware Advanced Charger telemetry and partial-capability visibility
- keep unobservable Advanced Charger button commands outside the dashboard control surface
- keep Home Assistant entity IDs, domains and services behind Backend API v1
- require R4875G1 Charger backend 1.3.0 or newer

## 0.9.0

Advanced Charger monitoring milestone.

- add capability-aware Advanced Charger monitoring when the optional capability is present
- show DC current setpoint plus effective, thermal and applied DC current limits
- show AC and DC energy for the current day
- show rectifier capability mismatch state
- preserve partial optional-capability visibility and report missing roles as unavailable
- reuse shared semantic metric presentation across optional capability views
- keep this milestone read-only and based only on Backend API semantic roles
- keep the R4875G1 Charger backend 1.2.0 compatibility baseline

## 0.8.0

Cooling control milestone.

- add observed-state controls for external cooling automatic mode and fan power
- add confirmation dialogs for semantic Switch controls
- add manual external cooling PWM control using Backend API Number metadata
- wait for observed semantic Switch and PWM state before completing writes
- extend frontend Backend API typing with the additive `set_switch` action
- keep partial external-cooling capabilities visible and disable only unavailable controls
- keep Home Assistant Switch services and entity IDs behind Backend API v1
- keep cooling behavior and safety authoritative in the Charger Controller
- require R4875G1 Charger backend 1.2.0 or newer

## 0.7.0

Cooling monitoring milestone.

- add compartment temperature, humidity and sea-level pressure monitoring
- add optional external cooling status and telemetry when the capability is present
- show automatic mode, fan power, manual/actual PWM and cooling-controller temperature
- show external Cooling Fan 1-3 RPM telemetry
- preserve partial optional-capability visibility instead of hiding missing roles
- keep this cooling milestone read-only and based only on Backend API semantic roles

## 0.6.0

Per-rectifier operational control milestone.

- add START and STOP controls for each Rectifier Unit
- require explicit per-unit OFF or ON state before offering the matching command
- keep START eligibility and safety enforcement authoritative in the Charger Controller
- wait for observed per-unit power state before completing commands
- reuse one shared power-command component for Charger-wide and per-unit controls
- preserve confirmation dialogs and the 10-second command-pending timeout
- keep Backend API semantic roles as the only frontend control boundary

## 0.5.0

First per-rectifier detail milestone.

- add expandable live detail views for Rectifier Units 1-3
- show semantic connection, lifecycle, power and thermal states per unit
- show AC input and DC output telemetry per unit
- show reported DC current setpoint and maximum current capability
- show input/output temperatures and fan telemetry per unit
- show rectifier operating hours
- reuse one shared semantic role formatter for overview and rectifier values
- keep rectifier detail presentation independent from installation-specific entity IDs
- keep per-rectifier controls out of this first read-only detail step

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
