# Grafana history dashboard

This directory contains the version-controlled historical telemetry dashboard for the R4875G1 Charger project.

The Home Assistant dashboard remains the live HMI for state, diagnostics and control. Grafana is read-only and is intentionally outside the Charger control path.

## Architecture

Historical data follows the existing installation path:

```text
ESPHome Charger Controller
        |
        v
Home Assistant entities
        |
        v
Home Assistant InfluxDB integration
        |
        v
InfluxDB
        |
        v
Grafana
```

The Grafana dashboard does not query Backend API v1 and does not duplicate historical data through the R4875G1 Charger Home Assistant integration.

## Dashboard file

The importable dashboard resource is:

```text
grafana/dashboards/r4875g1-charger-history.json
```

It uses the Grafana V2 dashboard resource model and is intended to work with both normal dashboard import and Grafana Git Sync.

The initial foundation was exported from Grafana 13.2.2 and validated against an InfluxDB 1.8 / InfluxQL Home Assistant history source.

## Variables

The dashboard uses two portability variables.

### `datasource`

`datasource` is a Grafana data-source variable restricted to the InfluxDB plugin. Panels and dependent variables use `${datasource}` instead of a Grafana installation-specific data-source UID.

### `instance`

`instance` represents the Home Assistant entity-ID prefix of one R4875G1 Charger Controller.

It is discovered from the required Unit 1 AC-voltage entity:

```sql
SHOW TAG VALUES FROM "V"
WITH KEY = "entity_id"
WHERE "entity_id" =~ /_ac_voltage_unit_1$/
```

The variable regex removes the stable entity suffix:

```text
/^(.*)_ac_voltage_unit_1$/
```

For example:

```text
hg_dg_technik_charger_ac_voltage_unit_1
```

becomes:

```text
hg_dg_technik_charger
```

Panel queries then compose stable Contract entity suffixes with `${instance}`.

## InfluxDB assumptions

The current dashboard foundation expects the Home Assistant InfluxDB layout used by the project installation:

- InfluxQL query language
- numeric value stored in the `value` field
- Home Assistant entity ID stored in the `entity_id` tag
- measurements grouped by unit, for example `V` for voltage
- unitless sensors and binary sensors stored in the `state` measurement
- Home Assistant domain stored in the `domain` tag

The unitless and binary status queries therefore use `FROM "state"` and filter by both `domain` and the portable `${instance}` entity-ID prefix.

These assumptions must be kept explicit when additional panels are added.

## Import

For a normal Grafana import:

1. Open **Dashboards**.
2. Select **New -> Import**.
3. Upload `r4875g1-charger-history.json`.
4. Open the imported dashboard.
5. Select the desired InfluxDB source in **Data source**.
6. Select the desired Charger instance in **Charger**.

The dashboard must not contain a hard-coded Grafana data-source UID or an installation-specific Charger entity prefix.

## Git Sync

Grafana Git Sync can use the JSON file in `grafana/dashboards/` as a provisioned dashboard resource.

Changes made through Grafana must be reviewed before they are committed back to the repository. Exported or Git-Sync-generated dashboard JSON must continue to satisfy the portability rules below.

## Portability rules

- keep Grafana read-only; do not add Charger controls
- use `${datasource}` for InfluxDB data-source references
- use `${instance}` for the installation-specific Charger entity prefix
- do not commit Grafana installation-specific data-source UIDs
- do not commit installation-specific current variable selections
- do not commit volatile server metadata such as resource versions, timestamps or user identifiers
- keep the dashboard in the Grafana V2 resource model
- validate JSON syntax before committing
- test a normal Grafana import after structural dashboard changes
- keep Git Sync compatibility when changing the resource structure

## Current dashboard

The portable query chain has been validated through a normal Grafana import:

```text
${datasource}
    +
${instance}
    +
stable entity suffix
    ->
InfluxDB history
```

The current dashboard contains the first production history views.

### Dashboard sections

The dashboard uses Grafana Rows to organize historical telemetry by functional area. Rows keep related data together and provide a stable structure for future telemetry additions.

The current sections are:

- Overview
- AC Input
- Setpoints & Limits
- DC Output
- Rectifier Thermal
- Enclosure / Compartment
- Connectivity

Overview remain expanded by default. All other sections are collapsed by default so the dashboard stays compact while still allowing deeper analysis when needed.

### Overview

The Overview section keeps the current Charger status and the primary efficiency history visible without opening a detailed row.

It contains:

- Available Units
- Running Units
- Efficiency
- CAN Communication

Available Units, Running Units and CAN Communication show the last known state independently of the selected dashboard time range. Efficiency follows the selected history range.

### AC Input

The AC Input section prioritizes power and keeps voltage, current and frequency as supporting diagnostic values.

Aggregate Charger telemetry:

- AC Power
- AC Voltage
- AC Current

Per-Rectifier comparison telemetry:

- Rectifier AC Power
- Rectifier AC Voltage
- Rectifier AC Current
- Rectifier AC Frequency

The per-Rectifier panels compare Units 1-3 using the shared `${datasource}` and `${instance}` variables and retain sample-and-hold behavior with InfluxQL `fill(previous)`.

### Setpoints & Limits

The Setpoints & Limits section separates current setpoint state from historical limit behavior.

Current-value Stat panels show the last known value independently of the selected dashboard time range:

- AC Current Limit
- DC Voltage Setpoint
- DC Sum Power Setpoint
- Fallback DC Voltage
- Fallback DC Current

These panels intentionally use `last(value)` without `$timeFilter` because the setpoints may remain unchanged for days or weeks.

DC Current Limits remains a time-series comparison of:

- Requested
- Effective
- Thermal
- Applied

The limits panel follows the selected dashboard time range and keeps all four Ampere values on one shared scale so requested, capability, thermal and applied limits remain directly comparable.

### DC Output

The DC Output section contains aggregate Charger output telemetry and per-Rectifier comparisons:

- DC Power
- Rectifier DC Power
- DC Voltage
- DC Current
- Rectifier DC Current

The per-Rectifier panels compare Units 1-3 while the aggregate panels show the Charger-wide output behavior over the selected time range.

### Rectifier Thermal

The Rectifier Thermal section contains the output-temperature comparison for Rectifier Units 1-3 over the selected time range.

### Enclosure / Compartment

The enclosure-cooling history adds:

- Enclosure Temperature
- Enclosure Humidity
- Cooling Fan PWM
- Cooling Fan RPM for Fans 1-3
- Cooling Fan Controller Temperature

The environmental temperature and humidity are part of the required cooling-environment capability. The PWM, fan-speed and fan-controller temperature panels use the optional external-cooling telemetry and therefore show no data when that capability is not present.

### Plot behavior

The dashboard refreshes automatically every 10 seconds.

Numeric history queries use InfluxQL `fill(previous)` because the Charger telemetry may remain unchanged without producing a new stored value. Empty time buckets therefore retain the most recent known value instead of Grafana drawing a long linear ramp between two distant samples.

Grafana-side `spanNulls` remains disabled. Time-series panels use a consistent light area fill below their lines.

### Connectivity

Current connectivity information is kept in the Overview:

- Available Units
- Running Units
- CAN Communication for Rectifier Units 1-3

These Stat panels intentionally query the last known state without `$timeFilter`. They therefore continue to show the current known status independently of the selected dashboard history range.

The CAN Communication Stat maps `0` to `Offline` and `1` to `Online`.

`Rectifier CAN Connectivity History` uses the dedicated numeric CAN-connectivity history sensors for Rectifier Units 1-3. Connectivity changes are published immediately by the Charger Controller and stable states are repeated periodically through the Controller telemetry heartbeat.

The State timeline follows the selected dashboard time range. The periodic heartbeat prevents an otherwise stable Online or Offline state from disappearing completely from longer history views.

A communication loss can leave other `fill(previous)` telemetry at its last known value, while the current CAN Communication Stat and the connectivity timeline provide the context needed to interpret that data.

Additional historical sections are added in small reviewed steps while preserving normal-import and Git-Sync compatibility.
