import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";
import "./charger-number-control";
import "./semantic-metric-grid";

export const ADVANCED_CHARGER_STATUS_TAG =
  "r4875g1-advanced-charger-status";

const ADVANCED_CHARGER_NUMBER_CONTROLS = [
  {
    label: "DC current setpoint",
    role: "charger.dc.current_setpoint",
  },
  {
    label: "Internal fan minimum duty",
    role: "charger.internal_fan.minimum_duty_setpoint",
  },
] as const;

const ADVANCED_CHARGER_METRICS = [
  {
    label: "Effective DC current limit",
    role: "charger.dc.current_limit_effective",
  },
  {
    label: "Thermal DC current limit",
    role: "charger.dc.current_limit_thermal",
  },
  {
    label: "Applied DC current limit",
    role: "charger.dc.current_limit_applied",
  },
  {
    label: "AC energy today",
    role: "charger.energy.ac_today",
  },
  {
    label: "DC energy today",
    role: "charger.energy.dc_today",
  },
  {
    label: "Rectifier capability mismatch",
    role: "charger.capability_mismatch",
  },
] as const;

export class AdvancedChargerStatus extends LitElement {
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

    .controls > r4875g1-charger-number-control {
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
          <h2 class="section-heading">Advanced Charger</h2>
          <div class="message">
            Waiting for advanced Charger data…
          </div>
        </section>
      `;
    }

    const capability =
      this.chargerState.capabilities.advanced_charger;

    if (
      capability === undefined
      || capability.status === "unavailable"
      || !this.hasRelevantRole()
    ) {
      return "";
    }

    return html`
      <section class="section">
        <h2 class="section-heading">Advanced Charger</h2>
        <section class="panel">
          <div class="panel-heading">
            <span class="panel-title">Advanced Charger</span>
            <span class="capability-status">${capability.status}</span>
          </div>

          <div class="subheading">Controls</div>
          <div class="controls">
            ${ADVANCED_CHARGER_NUMBER_CONTROLS.map(({ label, role }) => html`
              <r4875g1-charger-number-control
                .store=${this.chargerStore}
                .execute=${this.executeControl}
                .role=${role}
                .label=${label}
              ></r4875g1-charger-number-control>
            `)}
          </div>

          <div class="subheading">Telemetry</div>
          <r4875g1-semantic-metric-grid
            .roles=${this.chargerState.roles}
            .metrics=${ADVANCED_CHARGER_METRICS}
          ></r4875g1-semantic-metric-grid>
        </section>
      </section>
    `;
  }

  private hasRelevantRole(): boolean {
    return (
      ADVANCED_CHARGER_NUMBER_CONTROLS.some(
        ({ role }) => this.chargerState?.roles[role] !== undefined,
      )
      || ADVANCED_CHARGER_METRICS.some(
        ({ role }) => this.chargerState?.roles[role] !== undefined,
      )
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

if (!customElements.get(ADVANCED_CHARGER_STATUS_TAG)) {
  customElements.define(
    ADVANCED_CHARGER_STATUS_TAG,
    AdvancedChargerStatus,
  );
}
