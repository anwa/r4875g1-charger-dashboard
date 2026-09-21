import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const CHARGER_STATUS_TAG = "r4875g1-charger-status";

const CHARGER_OVERVIEW_METRICS = [
  { label: "AC power", role: "charger.ac.power" },
  { label: "AC voltage", role: "charger.ac.voltage" },
  { label: "AC current", role: "charger.ac.current" },
  { label: "DC power", role: "charger.dc.power" },
  { label: "DC voltage", role: "charger.dc.voltage" },
  { label: "DC current", role: "charger.dc.current" },
  {
    label: "Highest output temperature",
    role: "charger.highest_output_temperature",
  },
  {
    label: "Conversion efficiency",
    role: "charger.conversion_efficiency",
  },
] as const;

export class ChargerStatusPreview extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .status {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .row {
      display: grid;
      grid-template-columns: minmax(8rem, auto) 1fr;
      gap: 1rem;
      align-items: baseline;
    }

    .label,
    .metric-label {
      color: var(--secondary-text-color, #727272);
    }

    .value {
      font-weight: 600;
    }

    .unit-status {
      display: grid;
      grid-template-columns: minmax(8rem, auto) 1fr;
      gap: 1rem;
      align-items: baseline;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .metric {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      font-size: 0.85rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 400;
    }
  `;

  private chargerStore: ChargerStore | null = null;
  private chargerState: ChargerState = null;
  private unsubscribe: UnsubscribeFunction | null = null;

  get store(): ChargerStore | null {
    return this.chargerStore;
  }

  set store(value: ChargerStore | null) {
    if (value === this.chargerStore) {
      return;
    }

    this.detachStore();
    this.chargerStore = value;
    this.chargerState = value?.state ?? null;

    if (this.isConnected) {
      this.attachStore();
    }

    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.attachStore();
  }

  disconnectedCallback(): void {
    this.detachStore();
    super.disconnectedCallback();
  }

  protected render() {
    if (this.chargerState === null) {
      return html`
        <div class="status">
          <div class="value">Waiting for Charger Instance data…</div>
        </div>
      `;
    }

    return html`
      <div class="status">
        <div class="row">
          <span class="label">Name</span>
          <span class="value">${this.chargerState.name}</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="value">${this.chargerState.status}</span>
        </div>
        <div class="row">
          <span class="label">Contract</span>
          <span class="value">
            ${this.chargerState.contract_version ?? "unavailable"}
          </span>
        </div>

        ${this.renderRectifierStatus()}

        <div class="metrics">
          ${CHARGER_OVERVIEW_METRICS.map(({ label, role }) =>
            this.renderMetric(label, role),
          )}
        </div>
      </div>
    `;
  }

  private renderRectifierStatus() {
    const availableUnits = this.chargerState?.roles["charger.available_units"];
    const runningUnits = this.chargerState?.roles["charger.running_units"];

    if (
      availableUnits?.available !== true
      || runningUnits?.available !== true
      || availableUnits.state === null
      || runningUnits.state === null
    ) {
      return html`
        <div class="unit-status">
          <span class="label">Rectifiers</span>
          <span class="value">unavailable</span>
        </div>
      `;
    }

    return html`
      <div class="unit-status">
        <span class="label">Rectifiers</span>
        <span class="value">
          ${this.formatMetricValue(runningUnits.state)}
          /
          ${this.formatMetricValue(availableUnits.state)}
          running
        </span>
      </div>
    `;
  }

  private renderMetric(label: string, role: string) {
    const roleSnapshot = this.chargerState?.roles[role];
    const available = roleSnapshot?.available === true;
    const value = available
      ? this.formatMetricValue(roleSnapshot.state)
      : "unavailable";
    const unit = available
      ? roleSnapshot?.unit ?? null
      : null;

    return html`
      <div class="metric">
        <span class="metric-label">${label}</span>
        <span class="metric-value">
          ${value}${unit !== null
            ? html`<span class="metric-unit">${unit}</span>`
            : ""}
        </span>
      </div>
    `;
  }

  private formatMetricValue(state: string | null): string {
    if (state === null) {
      return "unavailable";
    }

    const numericValue = Number(state);

    if (!Number.isFinite(numericValue)) {
      return state;
    }

    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(numericValue);
  }

  private attachStore(): void {
    if (this.chargerStore === null || this.unsubscribe !== null) {
      return;
    }

    this.chargerState = this.chargerStore.state;
    this.unsubscribe = this.chargerStore.subscribe((state) => {
      this.chargerState = state;
      this.requestUpdate();
    });
  }

  private detachStore(): void {
    if (this.unsubscribe !== null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

if (!customElements.get(CHARGER_STATUS_TAG)) {
  customElements.define(CHARGER_STATUS_TAG, ChargerStatusPreview);
}
