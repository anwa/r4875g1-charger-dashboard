# Grafana history dashboard

This directory contains the version-controlled historical telemetry dashboard
for the R4875G1 Charger project.

The Home Assistant dashboard remains the live HMI for state, diagnostics and
control. Grafana is read-only and is intentionally outside the Charger control
path.

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

The Grafana dashboard does not query Backend API v1 and does not duplicate
historical data through the R4875G1 Charger Home Assistant integration.

## Dashboard file

The importable dashboard resource is:

```text
grafana/dashboards/r4875g1-charger-history.json
```

It uses the Grafana V2 dashboard resource model and is intended to work with
both normal dashboard import and Grafana Git Sync.

The initial foundation was exported from Grafana 13.2.2 and validated against
an InfluxDB 1.8 / InfluxQL Home Assistant history source.

## Variables

The dashboard uses two portability variables.

### `datasource`

`datasource` is a Grafana data-source variable restricted to the InfluxDB
plugin. Panels and dependent variables use `${datasource}` instead of a
Grafana installation-specific data-source UID.

### `instance`

`instance` represents the Home Assistant entity-ID prefix of one R4875G1
Charger Controller.

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

The current dashboard foundation expects the Home Assistant InfluxDB layout
used by the project installation:

- InfluxQL query language
- numeric value stored in the `value` field
- Home Assistant entity ID stored in the `entity_id` tag
- measurements grouped by unit, for example `V` for voltage

These assumptions must be kept explicit when additional panels are added.

## Import

For a normal Grafana import:

1. Open **Dashboards**.
2. Select **New -> Import**.
3. Upload `r4875g1-charger-history.json`.
4. Open the imported dashboard.
5. Select the desired InfluxDB source in **Data source**.
6. Select the desired Charger instance in **Charger**.

The dashboard must not contain a hard-coded Grafana data-source UID or an
installation-specific Charger entity prefix.

## Git Sync

Grafana Git Sync can use the JSON file in `grafana/dashboards/` as a
provisioned dashboard resource.

Changes made through Grafana must be reviewed before they are committed back
to the repository. Exported or Git-Sync-generated dashboard JSON must continue
to satisfy the portability rules below.

## Portability rules

- keep Grafana read-only; do not add Charger controls
- use `${datasource}` for InfluxDB data-source references
- use `${instance}` for the installation-specific Charger entity prefix
- do not commit Grafana installation-specific data-source UIDs
- do not commit installation-specific current variable selections
- do not commit volatile server metadata such as resource versions,
  timestamps or user identifiers
- keep the dashboard in the Grafana V2 resource model
- validate JSON syntax before committing
- test a normal Grafana import after structural dashboard changes
- keep Git Sync compatibility when changing the resource structure

## Current foundation

The first version intentionally contains only one validation panel:

```text
AC Voltage Unit 1
```

This panel proves the complete portable query chain:

```text
${datasource}
    +
${instance}
    +
stable entity suffix
    ->
InfluxDB history
```

Additional historical panels are added in small reviewed steps after this
foundation has been successfully re-imported.
