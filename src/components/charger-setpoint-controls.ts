import { LitElement, css, html } from "lit";

import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerStore } from "../state/store";
import "./charger-number-control";

export const CHARGER_SETPOINT_CONTROLS_TAG =
  "r4875g1-charger-setpoint-controls";

const OPERATIONAL_SETPOINTS = [
  {
    role: "charger.ac.current_limit",
    label: "AC current limit",
  },
  {
    role: "charger.dc.voltage_setpoint",
    label: "DC voltage limit",
  },
  {
    role: "charger.dc.sum_power_setpoint",
    label: "DC sum power",
  },
] as const;

const FALLBACK_SETPOINTS = [
  {
    role: "charger.fallback.voltage_setpoint",
    label: "Fallback DC voltage",
  },
  {
    role: "charger.fallback.current_setpoint",
    label: "Fallback DC current",
  },
] as const;

export class ChargerSetpointControls extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--primary-text-color, #212121);
    }

    .section + .section {
      margin-top: 1rem;
    }

    .section-title {
      margin-bottom: 0.25rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .section-description {
      margin-bottom: 0.75rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      line-height: 1.4;
    }

    details.section {
      padding: 0;
    }

    summary {
      min-height: 2.75rem;
      padding: 0.75rem 1rem;
      box-sizing: border-box;
      cursor: pointer;
      font-weight: 600;
    }

    .fallback-content {
      padding: 0 1rem 1rem;
    }
  `;

  private chargerStore: ChargerStore | null = null;
  private executeControl: ChargerControlExecutor | null = null;

  get store(): ChargerStore | null {
    return this.chargerStore;
  }

  set store(value: ChargerStore | null) {
    if (value === this.chargerStore) {
      return;
    }

    this.chargerStore = value;
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

  protected render() {
    return html`
      <section class="section">
        <div class="section-title">Operational setpoints</div>
        <div class="section-description">
          Normal Charger operating limits and targets.
        </div>
        ${OPERATIONAL_SETPOINTS.map(({ role, label }) =>
          this.renderNumberControl(role, label),
        )}
      </section>

      <details class="section">
        <summary>Fallback settings</summary>
        <div class="fallback-content">
          <div class="section-description">
            Rectifier fallback voltage and current settings.
          </div>
          ${FALLBACK_SETPOINTS.map(({ role, label }) =>
            this.renderNumberControl(role, label),
          )}
        </div>
      </details>
    `;
  }

  private renderNumberControl(role: string, label: string) {
    return html`
      <r4875g1-charger-number-control
        .store=${this.chargerStore}
        .execute=${this.executeControl}
        .role=${role}
        .label=${label}
      ></r4875g1-charger-number-control>
    `;
  }
}

if (!customElements.get(CHARGER_SETPOINT_CONTROLS_TAG)) {
  customElements.define(
    CHARGER_SETPOINT_CONTROLS_TAG,
    ChargerSetpointControls,
  );
}
