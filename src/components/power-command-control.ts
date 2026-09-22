import { LitElement, css, html } from "lit";

import type { ChargerControlExecutor } from "../controls/types";

export const POWER_COMMAND_CONTROL_TAG =
  "r4875g1-power-command-control";

const COMMAND_TIMEOUT_MS = 10_000;

export type PowerCommandAction = "start" | "stop";

export interface PowerCommandControlConfig {
  targetLabel: string;
  startRole: string;
  stopRole: string;
  startConfirmationText: string;
  stopConfirmationText: string;
}

export interface PowerCommandControlState {
  action: PowerCommandAction | null;
  startAvailable: boolean;
  stopAvailable: boolean;
  startComplete: boolean;
  stopComplete: boolean;
  unavailableLabel: string;
}

export class PowerCommandControl extends LitElement {
  static styles = css`
    :host {
      display: block;
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

  private controlConfig: PowerCommandControlConfig | null = null;
  private controlState: PowerCommandControlState | null = null;
  private executeControl: ChargerControlExecutor | null = null;
  private confirmationAction: PowerCommandAction | null = null;
  private pendingAction: PowerCommandAction | null = null;
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null;
  private commandError: string | null = null;

  get config(): PowerCommandControlConfig | null {
    return this.controlConfig;
  }

  set config(value: PowerCommandControlConfig | null) {
    if (value === this.controlConfig) {
      return;
    }

    this.controlConfig = value;
    this.requestUpdate();
  }

  get state(): PowerCommandControlState | null {
    return this.controlState;
  }

  set state(value: PowerCommandControlState | null) {
    this.controlState = value;
    this.checkPendingCompletion();
    this.requestUpdate();
  }

  get execute(): ChargerControlExecutor | null {
    return this.executeControl;
  }

  set execute(value: ChargerControlExecutor | null) {
    this.executeControl = value;
    this.requestUpdate();
  }

  disconnectedCallback(): void {
    this.confirmationAction = null;
    this.clearPendingAction();
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
    action: PowerCommandAction | null;
    enabled: boolean;
    label: string;
  } {
    const config = this.controlConfig;
    const state = this.controlState;

    if (this.pendingAction !== null) {
      return {
        action: this.pendingAction,
        enabled: false,
        label: this.pendingAction === "start"
          ? "STARTING..."
          : "STOPPING...",
      };
    }

    if (config === null || state === null || state.action === null) {
      return {
        action: null,
        enabled: false,
        label: state?.unavailableLabel ?? "CONTROL UNAVAILABLE",
      };
    }

    const available = state.action === "start"
      ? state.startAvailable
      : state.stopAvailable;

    return {
      action: state.action,
      enabled: available && this.executeControl !== null,
      label: `${state.action === "start" ? "START" : "STOP"} ${config.targetLabel}`,
    };
  }

  private renderConfirmation(action: PowerCommandAction) {
    const config = this.controlConfig;

    if (config === null) {
      return "";
    }

    const isStart = action === "start";

    return html`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="power-command-dialog-title"
        >
          <div
            id="power-command-dialog-title"
            class="dialog-title"
          >
            ${isStart ? "START" : "STOP"} ${config.targetLabel}
          </div>

          <p class="dialog-text">
            ${isStart
              ? config.startConfirmationText
              : config.stopConfirmationText}
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

  private openConfirmation(action: PowerCommandAction | null): void {
    const state = this.controlState;

    if (
      action === null
      || state === null
      || this.pendingAction !== null
    ) {
      return;
    }

    const available = action === "start"
      ? state.startAvailable
      : state.stopAvailable;

    if (!available || this.executeControl === null) {
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
    const config = this.controlConfig;
    const execute = this.executeControl;

    if (
      action === null
      || config === null
      || execute === null
      || this.pendingAction !== null
    ) {
      return;
    }

    const role = action === "start"
      ? config.startRole
      : config.stopRole;

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
    const action = this.pendingAction;
    const state = this.controlState;

    if (action === null || state === null) {
      return;
    }

    const completed = action === "start"
      ? state.startComplete
      : state.stopComplete;

    if (completed) {
      this.clearPendingAction();
    }
  }

  private startPendingTimeout(action: PowerCommandAction): void {
    this.clearPendingTimeout();

    this.pendingTimeout = setTimeout(() => {
      if (this.pendingAction !== action) {
        return;
      }

      this.clearPendingAction();
      this.commandError =
        `Controller state did not confirm the ${action.toUpperCase()} command within 10 seconds.`;
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
}

if (!customElements.get(POWER_COMMAND_CONTROL_TAG)) {
  customElements.define(
    POWER_COMMAND_CONTROL_TAG,
    PowerCommandControl,
  );
}
