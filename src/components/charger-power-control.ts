import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";
import "./power-command-control";
import type {
  PowerCommandControlConfig,
  PowerCommandControlState,
} from "./power-command-control";

export type { ChargerControlExecutor } from "../controls/types";

export const CHARGER_POWER_CONTROL_TAG =
  "r4875g1-charger-power-control";

const CHARGER_START_ROLE = "charger.command.start";
const CHARGER_STOP_ROLE = "charger.command.stop";

const CHARGER_POWER_CONFIG: PowerCommandControlConfig = {
  targetLabel: "CHARGER",
  startRole: CHARGER_START_ROLE,
  stopRole: CHARGER_STOP_ROLE,
  startConfirmationText:
    "Start all available and ready rectifier units? Safety checks are applied individually by the Charger Controller before startup.",
  stopConfirmationText: "Stop all rectifier units?",
};

export class ChargerPowerControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
    }
  `;

  private chargerStore: ChargerStore | null = null;
  private chargerState: ChargerState = null;
  private executeControl: ChargerControlExecutor | null = null;
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

  get execute(): ChargerControlExecutor | null {
    return this.executeControl;
  }

  set execute(value: ChargerControlExecutor | null) {
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
    return html`
      <r4875g1-power-command-control
        .config=${CHARGER_POWER_CONFIG}
        .state=${this.powerCommandState()}
        .execute=${this.executeControl}
      ></r4875g1-power-command-control>
    `;
  }

  private powerCommandState(): PowerCommandControlState {
    const available = this.rectifierCount("charger.available_units");
    const running = this.rectifierCount("charger.running_units");

    if (available === null || running === null) {
      return {
        action: null,
        startAvailable: false,
        stopAvailable: false,
        startComplete: false,
        stopComplete: false,
        unavailableLabel: "CHARGER STATE UNAVAILABLE",
      };
    }

    if (available < 1) {
      return {
        action: null,
        startAvailable: false,
        stopAvailable: false,
        startComplete: false,
        stopComplete: running <= 0,
        unavailableLabel: "NO RECTIFIERS",
      };
    }

    return {
      action: running > 0 ? "stop" : "start",
      startAvailable:
        this.chargerState?.roles[CHARGER_START_ROLE]?.control?.available
          === true,
      stopAvailable:
        this.chargerState?.roles[CHARGER_STOP_ROLE]?.control?.available
          === true,
      startComplete: running >= available,
      stopComplete: running <= 0,
      unavailableLabel: "CHARGER STATE UNAVAILABLE",
    };
  }

  private rectifierCount(role: string): number | null {
    const roleSnapshot = this.chargerState?.roles[role];

    if (
      roleSnapshot?.available !== true
      || roleSnapshot.state === null
    ) {
      return null;
    }

    const value = Number(roleSnapshot.state);
    return Number.isFinite(value) ? value : null;
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

if (!customElements.get(CHARGER_POWER_CONTROL_TAG)) {
  customElements.define(
    CHARGER_POWER_CONTROL_TAG,
    ChargerPowerControl,
  );
}
