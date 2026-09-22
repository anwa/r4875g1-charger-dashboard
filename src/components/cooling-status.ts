import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import { formatSemanticRole } from "../presentation/semantic-role-format";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const COOLING_STATUS_TAG = "r4875g1-cooling-status";

const COOLING_ENVIRONMENT_METRICS = [
  {
    label: "Compartment temperature",
    role: "cooling.compartment.temperature",
  },
  {
    label: "Compartment humidity",
    role: "cooling.compartment.humidity",
  },
  {
    label: "Sea-level pressure",
    role: "cooling.compartment.sea_level_pressure",
  },
] as const;

const EXTERNAL_COOLING_METRICS = [
  { label: "Automatic mode", role: "cooling.external.automatic" },
  { label: "Fan power", role: "cooling.external.power" },
  { label: "Manual PWM", role: "cooling.external.manual_pwm" },
  { label: "Actual PWM", role: "cooling.external.actual_pwm" },
  {
    label: "Controller temperature",
    role: "cooling.external.controller_temperature",
  },
  { label: "Fan 1 speed", role: "cooling.external.fan.1.rpm" },
  { label: "Fan 2 speed", role: "cooling.external.fan.2.rpm" },
  { label: "Fan 3 speed", role: "cooling.external.fan.3.rpm" },
] as const;

export class CoolingStatus extends LitElement {
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

    .panel {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    .panel-heading {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: baseline;
      justify-content: space-between;
    }

    .panel-title {
      font-weight: 600;
    }

    .capability-status {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
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
          <h2 class="section-heading">Cooling</h2>
          <div class="message">Waiting for cooling data…</div>
        </section>
      `;
    }

    const environmentCapability =
      this.chargerState.capabilities.cooling_environment;
    const externalCapability =
      this.chargerState.capabilities.external_cooling;

    return html`
      <section class="section">
        <h2 class="section-heading">Cooling</h2>

        ${environmentCapability?.available === true
          ? this.renderPanel(
              "Compartment environment",
              COOLING_ENVIRONMENT_METRICS,
            )
          : html`
              <div class="message">
                Cooling environment capability is unavailable.
              </div>
            `}

        ${externalCapability !== undefined
          && externalCapability.status !== "unavailable"
          ? this.renderPanel(
              "External cooling",
              EXTERNAL_COOLING_METRICS,
              externalCapability.status,
            )
          : ""}
      </section>
    `;
  }

  private renderPanel(
    title: string,
    metrics: ReadonlyArray<{ label: string; role: string }>,
    capabilityStatus?: string,
  ) {
    return html`
      <section class="panel">
        <div class="panel-heading">
          <span class="panel-title">${title}</span>
          ${capabilityStatus !== undefined
            ? html`
                <span class="capability-status">${capabilityStatus}</span>
              `
            : ""}
        </div>
        <div class="metrics">
          ${metrics.map(({ label, role }) => this.renderMetric(label, role))}
        </div>
      </section>
    `;
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

if (!customElements.get(COOLING_STATUS_TAG)) {
  customElements.define(COOLING_STATUS_TAG, CoolingStatus);
}
