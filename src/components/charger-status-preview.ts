import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import { formatSemanticRole } from "../presentation/semantic-role-format";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const CHARGER_STATUS_TAG = "r4875g1-charger-status";

// Home Assistant Contract 1 defines exactly three rectifier units.
const CHARGER_RECTIFIER_COUNT = 3;

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
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .unit-status-row {
      display: grid;
      grid-template-columns: minmax(8rem, auto) 1fr;
      gap: 1rem;
      align-items: baseline;
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

    return html`
      <div class="unit-status">
        <div class="unit-status-row">
          <span class="label">Available rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(availableUnits?.state)}
            / ${CHARGER_RECTIFIER_COUNT}
          </span>
        </div>
        <div class="unit-status-row">
          <span class="label">Running rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(runningUnits?.state)}
            / ${CHARGER_RECTIFIER_COUNT}
          </span>
        </div>
      </div>
    `;
  }

  private formatRectifierCount(state: string | null | undefined): string {
    if (state === null || state === undefined) {
      return "-";
    }

    const numericValue = Number(state);

    if (!Number.isFinite(numericValue)) {
      return "-";
    }

    return Math.trunc(numericValue).toString();
  }

  private renderMetric(label: string, role: string) {
    const display = formatSemanticRole(this.chargerState?.roles[role]);

    return html`
      <div class="metric">
        <span class="metric-label">${label}</span>
        <span class="metric-value">
          ${display.value}${display.unit !== null
            ? html`<span class="metric-unit">${display.unit}</span>`
            : ""}
        </span>
      </div>
    `;
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
