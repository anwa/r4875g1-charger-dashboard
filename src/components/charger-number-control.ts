import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { NumberControlMetadata } from "../api/types";
import type { ChargerControlExecutor } from "../controls/types";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";

export const CHARGER_NUMBER_CONTROL_TAG =
  "r4875g1-charger-number-control";

const COMMAND_TIMEOUT_MS = 10_000;

export class ChargerNumberControl extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
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

    .unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 400;
    }

    button,
    input {
      min-height: 2.75rem;
      font: inherit;
    }

    button {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled,
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .edit-button {
      min-width: 5rem;
      padding: 0 1rem;
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

    .editor {
      display: grid;
      grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
      gap: 0.5rem;
      align-items: center;
    }

    .editor input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
      font-size: 1rem;
      text-align: center;
    }

    .range {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      text-align: center;
    }

    .dialog-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .save {
      border-color: var(--success-color, #43a047);
    }
  `;

  private chargerStore: ChargerStore | null = null;
  private chargerState: ChargerState = null;
  private executeControl: ChargerControlExecutor | null = null;
  private unsubscribe: UnsubscribeFunction | null = null;
  private controlRole = "";
  private controlLabel = "";
  private dialogOpen = false;
  private editValue: number | null = null;
  private pendingTarget: number | null = null;
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
    this.clearPendingTimeout();
    super.disconnectedCallback();
  }

  protected render() {
    const roleSnapshot = this.chargerState?.roles[this.controlRole];
    const metadata = this.numberMetadata();
    const currentValue = roleSnapshot?.available === true
      ? this.formatDisplayValue(roleSnapshot.state)
      : "unavailable";
    const unit = metadata?.unit ?? roleSnapshot?.unit ?? null;
    const enabled =
      roleSnapshot?.available === true
      && metadata?.available === true
      && this.executeControl !== null
      && this.pendingTarget === null;

    return html`
      <div class="control">
        <div class="control-info">
          <span class="label">${this.controlLabel}</span>
          <span class="value">
            ${currentValue}${unit !== null
              ? html`<span class="unit">${unit}</span>`
              : ""}
          </span>
        </div>
        <button
          class="edit-button"
          ?disabled=${!enabled}
          @click=${this.openDialog}
        >
          ${this.pendingTarget !== null ? "SAVING..." : "EDIT"}
        </button>
      </div>

      ${this.commandError !== null
        ? html`<div class="message">${this.commandError}</div>`
        : ""}

      ${this.dialogOpen && metadata !== null
        ? this.renderDialog(metadata)
        : ""}
    `;
  }

  private renderDialog(metadata: NumberControlMetadata) {
    const validationError = this.validationError(metadata);

    return html`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-number-dialog-title"
        >
          <div
            id="charger-number-dialog-title"
            class="dialog-title"
          >
            ${this.controlLabel}
          </div>

          <div class="editor">
            <button
              aria-label="Decrease"
              @click=${() => this.adjustValue(-1, metadata)}
            >
              −
            </button>
            <input
              type="number"
              .value=${this.inputValue()}
              min=${metadata.min ?? ""}
              max=${metadata.max ?? ""}
              step=${metadata.step ?? "any"}
              @input=${this.handleInput}
            />
            <button
              aria-label="Increase"
              @click=${() => this.adjustValue(1, metadata)}
            >
              +
            </button>
          </div>

          <div class="range">
            ${this.rangeText(metadata)}
          </div>

          ${validationError !== null
            ? html`<div class="message">${validationError}</div>`
            : ""}

          <div class="dialog-actions">
            <button @click=${this.cancelDialog}>CANCEL</button>
            <button
              class="save"
              ?disabled=${validationError !== null}
              @click=${this.saveValue}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private numberMetadata(): NumberControlMetadata | null {
    const control =
      this.chargerState?.roles[this.controlRole]?.control;

    return control?.action === "set_value" ? control : null;
  }

  private readonly openDialog = (): void => {
    const roleSnapshot = this.chargerState?.roles[this.controlRole];
    const metadata = this.numberMetadata();

    if (
      roleSnapshot?.available !== true
      || metadata?.available !== true
      || roleSnapshot.state === null
      || this.pendingTarget !== null
    ) {
      return;
    }

    const currentValue = Number(roleSnapshot.state);

    if (!Number.isFinite(currentValue)) {
      return;
    }

    this.editValue = currentValue;
    this.dialogOpen = true;
    this.commandError = null;
    this.requestUpdate();
  };

  private readonly cancelDialog = (): void => {
    this.dialogOpen = false;
    this.editValue = null;
    this.requestUpdate();
  };

  private readonly handleInput = (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    const rawValue = input.value.trim();

    this.editValue = rawValue === ""
      ? null
      : Number(rawValue);
    this.requestUpdate();
  };

  private adjustValue(
    direction: -1 | 1,
    metadata: NumberControlMetadata,
  ): void {
    if (this.editValue === null) {
      return;
    }

    const step =
      typeof metadata.step === "number" && metadata.step > 0
        ? metadata.step
        : 1;
    const base =
      typeof metadata.min === "number" ? metadata.min : 0;
    let nextValue = this.editValue + direction * step;

    if (typeof metadata.min === "number") {
      nextValue = Math.max(metadata.min, nextValue);
    }

    if (typeof metadata.max === "number") {
      nextValue = Math.min(metadata.max, nextValue);
    }

    const steps = Math.round((nextValue - base) / step);
    const precision = this.stepPrecision(step);

    this.editValue = Number(
      (base + steps * step).toFixed(precision),
    );
    this.requestUpdate();
  }

  private validationError(
    metadata: NumberControlMetadata,
  ): string | null {
    const value = this.editValue;

    if (value === null || !Number.isFinite(value)) {
      return "Enter a valid numeric value.";
    }

    if (
      typeof metadata.min === "number"
      && value < metadata.min
    ) {
      return `Minimum value is ${metadata.min}.`;
    }

    if (
      typeof metadata.max === "number"
      && value > metadata.max
    ) {
      return `Maximum value is ${metadata.max}.`;
    }

    return null;
  }

  private readonly saveValue = async (): Promise<void> => {
    const execute = this.executeControl;
    const metadata = this.numberMetadata();
    const target = this.editValue;

    if (
      execute === null
      || metadata === null
      || metadata.available !== true
      || target === null
      || this.validationError(metadata) !== null
      || this.pendingTarget !== null
    ) {
      return;
    }

    this.dialogOpen = false;
    this.editValue = null;
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

    const roleSnapshot = this.chargerState?.roles[this.controlRole];

    if (
      roleSnapshot?.available !== true
      || roleSnapshot.state === null
    ) {
      return;
    }

    const observed = Number(roleSnapshot.state);

    if (!Number.isFinite(observed)) {
      return;
    }

    const step = this.numberMetadata()?.step;
    const tolerance =
      typeof step === "number" && step > 0
        ? Math.max(step / 1000, 1e-6)
        : 1e-6;

    if (Math.abs(observed - target) <= tolerance) {
      this.clearPendingTarget();
    }
  }

  private startPendingTimeout(target: number): void {
    this.clearPendingTimeout();

    this.pendingTimeout = setTimeout(() => {
      if (this.pendingTarget !== target) {
        return;
      }

      this.clearPendingTarget();
      this.commandError =
        "Controller state did not confirm the value within 10 seconds.";
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
    this.dialogOpen = false;
    this.editValue = null;
    this.commandError = null;
    this.clearPendingTarget();
  }

  private inputValue(): string {
    return this.editValue === null ? "" : String(this.editValue);
  }

  private rangeText(metadata: NumberControlMetadata): string {
    const parts: string[] = [];

    if (typeof metadata.min === "number") {
      parts.push(`min ${metadata.min}`);
    }

    if (typeof metadata.max === "number") {
      parts.push(`max ${metadata.max}`);
    }

    if (typeof metadata.step === "number") {
      parts.push(`step ${metadata.step}`);
    }

    if (metadata.unit !== null) {
      parts.push(metadata.unit);
    }

    return parts.join(" · ");
  }

  private formatDisplayValue(state: string | null): string {
    if (state === null) {
      return "unavailable";
    }

    const value = Number(state);

    if (!Number.isFinite(value)) {
      return state;
    }

    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(value);
  }

  private stepPrecision(step: number): number {
    const text = step.toString();
    const exponentIndex = text.toLowerCase().indexOf("e-");

    if (exponentIndex >= 0) {
      return Math.min(
        Number(text.slice(exponentIndex + 2)) || 0,
        6,
      );
    }

    const decimalIndex = text.indexOf(".");
    return decimalIndex < 0
      ? 0
      : Math.min(text.length - decimalIndex - 1, 6);
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

if (!customElements.get(CHARGER_NUMBER_CONTROL_TAG)) {
  customElements.define(
    CHARGER_NUMBER_CONTROL_TAG,
    ChargerNumberControl,
  );
}
