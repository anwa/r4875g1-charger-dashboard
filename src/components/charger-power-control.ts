import { LitElement, css, html } from "lit";

import type {
  UnsubscribeFunction,
} from "../api/client";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export type { ChargerControlExecutor } from "../controls/types";

export const CHARGER_POWER_CONTROL_TAG =
  "r4875g1-charger-power-control";

const CHARGER_START_ROLE = "charger.command.start";
const CHARGER_STOP_ROLE = "charger.command.stop";
const COMMAND_TIMEOUT_MS = 10_000;

type ChargerPowerAction = "start" | "stop";

export class ChargerPowerControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .power-button,
    .dialog-button {
      min-height: 2.75rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .power-button {
      width: 100%;
    }

    .power-button[data-action="start"] {
      border-color: var(--success-color, #43a047);
    }

    .power-button[data-action="stop"] {
      border-color: var(--error-color, #db4437);
    }

    .power-button:disabled,
    .dialog-button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .message {
      margin-top: 0.75rem;
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
    }

    .dialog-backdrop {
      display: grid;
      place-items: center;
      margin-top: 0.75rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: color-mix(
        in srgb,
        var(--card-background-color, #ffffff) 55%,
        #000000 45%
      );
    }

    .dialog {
      display: grid;
      gap: 1rem;
      width: min(100%, 28rem);
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .dialog-title {
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
    }

    .dialog-text {
      margin: 0;
      color: var(--secondary-text-color, #727272);
      line-height: 1.4;
      text-align: center;
    }

    .dialog-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .dialog-button.confirm[data-action="start"] {
      border-color: var(--success-color, #43a047);
    }

    .dialog-button.confirm[data-action="stop"] {
      border-color: var(--error-color, #db4437);
    }
  `;

  private chargerStore: ChargerStore | null = null;
  private chargerState: ChargerState = null;
  private executeControl: ChargerControlExecutor | null = null;
  private unsubscribe: UnsubscribeFunction | null = null;
  private confirmationAction: ChargerPowerAction | null = null;
  private pendingAction: ChargerPowerAction | null = null;
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null;
  private commandError: string | null = null;

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
    this.clearPendingTimeout();
    super.disconnectedCallback();
  }

  protected render() {
    const presentation = this.powerPresentation();

    return html`
      <button
        class="power-button"
        data-action=${presentation.action ?? ""}
        ?disabled=${!presentation.enabled}
        @click=${() => this.openConfirmation(presentation.action)}
      >
        ${presentation.label}
      </button>

      ${this.commandError !== null
        ? html`<div class="message">${this.commandError}</div>`
        : ""}

      ${this.confirmationAction !== null
        ? this.renderConfirmation(this.confirmationAction)
        : ""}
    `;
  }

  private powerPresentation(): {
    action: ChargerPowerAction | null;
    enabled: boolean;
    label: string;
  } {
    if (this.pendingAction !== null) {
      return {
        action: this.pendingAction,
        enabled: false,
        label: this.pendingAction === "start"
          ? "STARTING..."
          : "STOPPING...",
      };
    }

    const available = this.rectifierCount("charger.available_units");
    const running = this.rectifierCount("charger.running_units");

    if (available === null || running === null) {
      return {
        action: null,
        enabled: false,
        label: "CHARGER STATE UNAVAILABLE",
      };
    }

    if (available < 1) {
      return {
        action: null,
        enabled: false,
        label: "NO RECTIFIERS",
      };
    }

    const action: ChargerPowerAction =
      running > 0 ? "stop" : "start";
    const role = action === "start"
      ? CHARGER_START_ROLE
      : CHARGER_STOP_ROLE;
    const controlAvailable =
      this.chargerState?.roles[role]?.control?.available === true;

    return {
      action,
      enabled: controlAvailable && this.executeControl !== null,
      label: action === "start"
        ? "START CHARGER"
        : "STOP CHARGER",
    };
  }

  private renderConfirmation(action: ChargerPowerAction) {
    const isStart = action === "start";

    return html`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-power-dialog-title"
        >
          <div
            id="charger-power-dialog-title"
            class="dialog-title"
          >
            ${isStart ? "START CHARGER" : "STOP CHARGER"}
          </div>

          <p class="dialog-text">
            ${isStart
              ? "Start all available and ready rectifier units? Safety checks are applied individually by the Charger Controller before startup."
              : "Stop all rectifier units?"}
          </p>

          <div class="dialog-actions">
            <button
              class="dialog-button"
              @click=${this.cancelConfirmation}
            >
              CANCEL
            </button>
            <button
              class="dialog-button confirm"
              data-action=${action}
              @click=${this.confirmPowerCommand}
            >
              ${isStart ? "START" : "STOP"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private openConfirmation(action: ChargerPowerAction | null): void {
    if (action === null || this.pendingAction !== null) {
      return;
    }

    this.confirmationAction = action;
    this.commandError = null;
    this.requestUpdate();
  }

  private readonly cancelConfirmation = (): void => {
    this.confirmationAction = null;
    this.requestUpdate();
  };

  private readonly confirmPowerCommand = async (): Promise<void> => {
    const action = this.confirmationAction;
    const execute = this.executeControl;

    if (
      action === null
      || execute === null
      || this.pendingAction !== null
    ) {
      return;
    }

    const role = action === "start"
      ? CHARGER_START_ROLE
      : CHARGER_STOP_ROLE;

    this.confirmationAction = null;
    this.pendingAction = action;
    this.commandError = null;
    this.startPendingTimeout(action);
    this.requestUpdate();

    try {
      await execute(role);
    } catch (error) {
      if (this.pendingAction !== action) {
        return;
      }

      this.clearPendingAction();
      this.commandError = error instanceof Error
        ? error.message
        : String(error);
      this.requestUpdate();
      return;
    }

    this.checkPendingCompletion();
    this.requestUpdate();
  };

  private checkPendingCompletion(): void {
    if (this.pendingAction === null) {
      return;
    }

    const available = this.rectifierCount("charger.available_units");
    const running = this.rectifierCount("charger.running_units");

    if (available === null || running === null) {
      return;
    }

    const completed = this.pendingAction === "start"
      ? available > 0 && running >= available
      : running <= 0;

    if (completed) {
      this.clearPendingAction();
    }
  }

  private startPendingTimeout(action: ChargerPowerAction): void {
    this.clearPendingTimeout();

    this.pendingTimeout = setTimeout(() => {
      if (this.pendingAction !== action) {
        return;
      }

      this.clearPendingAction();
      this.commandError =
        "Controller state did not confirm the command within 10 seconds.";
      this.requestUpdate();
    }, COMMAND_TIMEOUT_MS);
  }

  private clearPendingAction(): void {
    this.pendingAction = null;
    this.clearPendingTimeout();
  }

  private clearPendingTimeout(): void {
    if (this.pendingTimeout !== null) {
      clearTimeout(this.pendingTimeout);
      this.pendingTimeout = null;
    }
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
      this.checkPendingCompletion();
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
