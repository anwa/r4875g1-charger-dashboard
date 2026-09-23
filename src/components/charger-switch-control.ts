import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { SwitchControlMetadata } from "../api/types";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const CHARGER_SWITCH_CONTROL_TAG =
  "r4875g1-charger-switch-control";

const COMMAND_TIMEOUT_MS = 10_000;

export class ChargerSwitchControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .control {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--primary-text-color, #212121);
    }

    .control-info {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    .label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
    }

    .value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    button {
      min-height: 2.75rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .switch-button {
      min-width: 6.5rem;
      padding: 0 1rem;
    }

    .switch-button[data-target="true"],
    .confirm[data-target="true"] {
      border-color: var(--success-color, #43a047);
    }

    .switch-button[data-target="false"],
    .confirm[data-target="false"] {
      border-color: var(--error-color, #db4437);
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
  `;

  private chargerStore: ChargerStore | null = null;
  private chargerState: ChargerState = null;
  private executeControl: ChargerControlExecutor | null = null;
  private unsubscribe: UnsubscribeFunction | null = null;
  private controlRole = "";
  private controlLabel = "";
  private confirmationTarget: boolean | null = null;
  private pendingTarget: boolean | null = null;
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
    if (value === this.executeControl) {
      return;
    }

    this.executeControl = value;
    this.requestUpdate();
  }

  get role(): string {
    return this.controlRole;
  }

  set role(value: string) {
    if (value === this.controlRole) {
      return;
    }

    this.controlRole = value;
    this.resetInteraction();
    this.requestUpdate();
  }

  get label(): string {
    return this.controlLabel;
  }

  set label(value: string) {
    if (value === this.controlLabel) {
      return;
    }

    this.controlLabel = value;
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.attachStore();
  }

  disconnectedCallback(): void {
    this.detachStore();
    this.confirmationTarget = null;
    this.clearPendingTarget();
    super.disconnectedCallback();
  }

  protected render() {
    const roleSnapshot = this.chargerState?.roles[this.controlRole];
    const metadata = this.switchMetadata();
    const observedState = this.observedState();
    const target = observedState === null ? null : !observedState;
    const enabled =
      roleSnapshot?.available === true
      && metadata?.available === true
      && target !== null
      && this.executeControl !== null
      && this.pendingTarget === null;

    return html`
      <div class="control">
        <div class="control-info">
          <span class="label">${this.controlLabel}</span>
          <span class="value">
            ${observedState === null
              ? "unavailable"
              : observedState ? "ON" : "OFF"}
          </span>
        </div>
        <button
          class="switch-button"
          data-target=${target === null ? "" : String(target)}
          ?disabled=${!enabled}
          @click=${() => this.openConfirmation(target)}
        >
          ${this.pendingTarget !== null
            ? `SETTING ${this.pendingTarget ? "ON" : "OFF"}...`
            : target === null
              ? "UNAVAILABLE"
              : `SET ${target ? "ON" : "OFF"}`}
        </button>
      </div>

      ${this.commandError !== null
        ? html`<div class="message">${this.commandError}</div>`
        : ""}

      ${this.confirmationTarget !== null
        ? this.renderConfirmation(this.confirmationTarget)
        : ""}
    `;
  }

  private renderConfirmation(target: boolean) {
    return html`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-switch-dialog-title"
        >
          <div
            id="charger-switch-dialog-title"
            class="dialog-title"
          >
            ${this.controlLabel}: ${target ? "ON" : "OFF"}
          </div>

          <p class="dialog-text">
            Set ${this.controlLabel} to ${target ? "ON" : "OFF"}?
          </p>

          <div class="dialog-actions">
            <button @click=${this.cancelConfirmation}>CANCEL</button>
            <button
              class="confirm"
              data-target=${String(target)}
              @click=${this.confirmSwitchChange}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private switchMetadata(): SwitchControlMetadata | null {
    const control =
      this.chargerState?.roles[this.controlRole]?.control;

    return control?.action === "set_switch" ? control : null;
  }

  private observedState(): boolean | null {
    const roleSnapshot = this.chargerState?.roles[this.controlRole];

    if (roleSnapshot?.available !== true) {
      return null;
    }

    if (roleSnapshot.state === "on") {
      return true;
    }

    if (roleSnapshot.state === "off") {
      return false;
    }

    return null;
  }

  private openConfirmation(target: boolean | null): void {
    const metadata = this.switchMetadata();

    if (
      target === null
      || metadata?.available !== true
      || this.executeControl === null
      || this.pendingTarget !== null
    ) {
      return;
    }

    this.confirmationTarget = target;
    this.commandError = null;
    this.requestUpdate();
  }

  private readonly cancelConfirmation = (): void => {
    this.confirmationTarget = null;
    this.requestUpdate();
  };

  private readonly confirmSwitchChange = async (): Promise<void> => {
    const target = this.confirmationTarget;
    const metadata = this.switchMetadata();
    const execute = this.executeControl;

    if (
      target === null
      || metadata?.available !== true
      || execute === null
      || this.pendingTarget !== null
    ) {
      return;
    }

    this.confirmationTarget = null;
    this.pendingTarget = target;
    this.commandError = null;
    this.startPendingTimeout(target);
    this.requestUpdate();

    try {
      await execute(this.controlRole, target);
    } catch (error) {
      if (this.pendingTarget !== target) {
        return;
      }

      this.clearPendingTarget();
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
    const target = this.pendingTarget;

    if (target === null) {
      return;
    }

    if (this.observedState() === target) {
      this.clearPendingTarget();
    }
  }

  private startPendingTimeout(target: boolean): void {
    this.clearPendingTimeout();

    this.pendingTimeout = setTimeout(() => {
      if (this.pendingTarget !== target) {
        return;
      }

      this.clearPendingTarget();
      this.commandError =
        `Controller state did not confirm ${target ? "ON" : "OFF"} within 10 seconds.`;
      this.requestUpdate();
    }, COMMAND_TIMEOUT_MS);
  }

  private clearPendingTarget(): void {
    this.pendingTarget = null;
    this.clearPendingTimeout();
  }

  private clearPendingTimeout(): void {
    if (this.pendingTimeout !== null) {
      clearTimeout(this.pendingTimeout);
      this.pendingTimeout = null;
    }
  }

  private resetInteraction(): void {
    this.confirmationTarget = null;
    this.commandError = null;
    this.clearPendingTarget();
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

if (!customElements.get(CHARGER_SWITCH_CONTROL_TAG)) {
  customElements.define(
    CHARGER_SWITCH_CONTROL_TAG,
    ChargerSwitchControl,
  );
}
