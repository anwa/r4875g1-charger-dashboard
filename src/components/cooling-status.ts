import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";
import "./charger-number-control";
import "./charger-switch-control";
import "./semantic-metric-grid";

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

const EXTERNAL_COOLING_SWITCH_CONTROLS = [
  { label: "Automatic mode", role: "cooling.external.automatic" },
  { label: "Fan power", role: "cooling.external.power" },
] as const;

const EXTERNAL_COOLING_METRICS = [
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

    .subheading {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .controls {
      display: grid;
      gap: 0.5rem;
    }

    .controls > r4875g1-charger-number-control,
    .controls > r4875g1-charger-switch-control {
      margin-top: 0;
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
  private executeControl: ChargerControlExecutor | null = null;

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

  get execute(): ChargerControlExecutor | null {
    return this.executeControl;
  }

  set execute(value: ChargerControlExecutor | null) {
    if (value === this.executeControl) {
      return;
    }

    this.executeControl = value;
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
          ? this.renderExternalCoolingPanel(externalCapability.status)
          : ""}
      </section>
    `;
  }

  private renderExternalCoolingPanel(capabilityStatus: string) {
    return html`
      <section class="panel">
        <div class="panel-heading">
          <span class="panel-title">External cooling</span>
          <span class="capability-status">${capabilityStatus}</span>
        </div>

        <div class="subheading">Controls</div>
        <div class="controls">
          ${EXTERNAL_COOLING_SWITCH_CONTROLS.map(({ label, role }) => html`
            <r4875g1-charger-switch-control
              .store=${this.chargerStore}
              .execute=${this.executeControl}
              .role=${role}
              .label=${label}
            ></r4875g1-charger-switch-control>
          `)}
          <r4875g1-charger-number-control
            .store=${this.chargerStore}
            .execute=${this.executeControl}
            .role=${"cooling.external.manual_pwm"}
            .label=${"Manual PWM"}
          ></r4875g1-charger-number-control>
        </div>

        <div class="subheading">Telemetry</div>
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${EXTERNAL_COOLING_METRICS}
        ></r4875g1-semantic-metric-grid>
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
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${metrics}
        ></r4875g1-semantic-metric-grid>
      </section>
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
