import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import { formatSemanticRole } from "../presentation/semantic-role-format";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const RECTIFIER_DETAILS_TAG = "r4875g1-rectifier-details";

const RECTIFIER_UNITS = [1, 2, 3] as const;

const RECTIFIER_DETAIL_GROUPS = [
  {
    title: "Status",
    metrics: [
      { label: "CAN communication", suffix: "connected" },
      { label: "Lifecycle", suffix: "lifecycle" },
      { label: "Power state", suffix: "power_state" },
      { label: "Thermal state", suffix: "thermal_state" },
    ],
  },
  {
    title: "AC input",
    metrics: [
      { label: "Voltage", suffix: "ac.voltage" },
      { label: "Current", suffix: "ac.current" },
      { label: "Power", suffix: "ac.power" },
      { label: "Frequency", suffix: "ac.frequency" },
    ],
  },
  {
    title: "DC output",
    metrics: [
      { label: "Voltage", suffix: "dc.voltage" },
      { label: "Current", suffix: "dc.current" },
      { label: "Power", suffix: "dc.power" },
      {
        label: "Reported current setpoint",
        suffix: "dc.current_setpoint_reported",
      },
      { label: "Maximum capability", suffix: "max_current_capability" },
    ],
  },
  {
    title: "Thermal and fan",
    metrics: [
      { label: "Input temperature", suffix: "temperature.input" },
      { label: "Output temperature", suffix: "temperature.output" },
      { label: "Fan speed", suffix: "fan.rpm" },
      { label: "Minimum fan duty", suffix: "fan.minimum_duty" },
      { label: "Target fan duty", suffix: "fan.target_duty" },
    ],
  },
  {
    title: "Lifetime",
    metrics: [
      { label: "Operating hours", suffix: "operating_hours" },
    ],
  },
] as const;

export class RectifierDetails extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      display: grid;
      gap: 0.75rem;
    }

    .section-heading {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .units {
      display: grid;
      gap: 0.75rem;
    }

    details {
      overflow: hidden;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    summary {
      display: grid;
      grid-template-columns: minmax(5rem, auto) 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 0.85rem 1rem;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::after {
      content: "›";
      grid-column: 3;
      color: var(--secondary-text-color, #727272);
      font-size: 1.3rem;
      line-height: 1;
      transform: rotate(90deg);
      transition: transform 120ms ease;
    }

    details[open] summary::after {
      transform: rotate(-90deg);
    }

    .unit-name {
      font-weight: 600;
    }

    .summary-values {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      min-width: 0;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
    }

    .summary-value {
      white-space: nowrap;
    }

    .groups {
      display: grid;
      gap: 1rem;
      padding: 0 1rem 1rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .group {
      display: grid;
      gap: 0.5rem;
      padding-top: 1rem;
    }

    .group-title {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      gap: 0.5rem;
    }

    .metric {
      display: grid;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.65rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 400;
    }

    .message {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--secondary-text-color, #727272);
    }

    @media (max-width: 600px) {
      summary {
        grid-template-columns: 1fr auto;
      }

      summary::after {
        grid-column: 2;
        grid-row: 1;
      }

      .summary-values {
        grid-column: 1 / -1;
      }
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
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">Waiting for rectifier data…</div>
        </section>
      `;
    }

    const capability = this.chargerState.capabilities.rectifier_detail;

    if (capability?.available !== true) {
      return html`
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">
            Rectifier detail capability is unavailable.
          </div>
        </section>
      `;
    }

    return html`
      <section class="section">
        <h2 class="section-heading">Rectifiers</h2>
        <div class="units">
          ${RECTIFIER_UNITS.map((unit) => this.renderUnit(unit))}
        </div>
      </section>
    `;
  }

  private renderUnit(unit: number) {
    return html`
      <details>
        <summary>
          <span class="unit-name">Unit ${unit}</span>
          <span class="summary-values">
            ${this.renderSummaryValue(unit, "connected", "CAN")}
            ${this.renderSummaryValue(unit, "power_state", "Power")}
            ${this.renderSummaryValue(unit, "dc.power", "DC")}
            ${this.renderSummaryValue(unit, "temperature.output", "Output")}
          </span>
        </summary>
        <div class="groups">
          ${RECTIFIER_DETAIL_GROUPS.map(({ title, metrics }) => html`
            <section class="group">
              <div class="group-title">${title}</div>
              <div class="metrics">
                ${metrics.map(({ label, suffix }) =>
                  this.renderMetric(unit, label, suffix),
                )}
              </div>
            </section>
          `)}
        </div>
      </details>
    `;
  }

  private renderSummaryValue(
    unit: number,
    suffix: string,
    label: string,
  ) {
    const display = this.getDisplayValue(unit, suffix);

    return html`
      <span class="summary-value">
        ${label}: ${display.value}${display.unit !== null
          ? html` ${display.unit}`
          : ""}
      </span>
    `;
  }

  private renderMetric(unit: number, label: string, suffix: string) {
    const display = this.getDisplayValue(unit, suffix);

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

  private getDisplayValue(unit: number, suffix: string) {
    return formatSemanticRole(
      this.chargerState?.roles[`rectifier.${unit}.${suffix}`],
    );
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

if (!customElements.get(RECTIFIER_DETAILS_TAG)) {
  customElements.define(RECTIFIER_DETAILS_TAG, RectifierDetails);
}
