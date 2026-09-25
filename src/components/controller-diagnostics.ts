import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";
import "./semantic-metric-grid";

export const CONTROLLER_DIAGNOSTICS_TAG =
  "r4875g1-controller-diagnostics";

const CONTROLLER_BATTERY_METRICS = [
  {
    label: "Controller battery voltage",
    role: "system.controller_battery.voltage",
  },
  {
    label: "Controller battery state of charge",
    role: "system.controller_battery.soc",
  },
] as const;

const CONTROLLER_RUNTIME_METRICS = [
  {
    label: "CPU temperature",
    role: "system.cpu.temperature",
  },
  {
    label: "CPU frequency",
    role: "system.cpu.frequency",
  },
  {
    label: "Loop time",
    role: "system.loop_time",
  },
  {
    label: "Heap free",
    role: "system.heap.free",
  },
  {
    label: "Heap max block",
    role: "system.heap.max_block",
  },
  {
    label: "PSRAM free",
    role: "system.psram.free",
  },
  {
    label: "Uptime",
    role: "system.uptime",
  },
  {
    label: "WiFi RSSI",
    role: "system.wifi.rssi",
  },
] as const;

const CONTROLLER_SYSTEM_METRICS = [
  {
    label: "ESPHome version",
    role: "system.esphome_version",
  },
  {
    label: "Device info",
    role: "system.device_info",
  },
  {
    label: "Reset reason",
    role: "system.reset_reason",
  },
] as const;

const CONTROLLER_DIAGNOSTIC_METRIC_GROUPS = [
  CONTROLLER_BATTERY_METRICS,
  CONTROLLER_RUNTIME_METRICS,
  CONTROLLER_SYSTEM_METRICS,
] as const;

export class ControllerDiagnostics extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .diagnostics {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    summary {
      padding: 1rem;
      cursor: pointer;
      user-select: none;
    }

    .summary-content {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: baseline;
      justify-content: space-between;
      width: calc(100% - 1.25rem);
      margin-left: 0.25rem;
    }

    .summary-title {
      font-weight: 600;
    }

    .capability-status {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .content {
      display: grid;
      gap: 1rem;
      padding: 0 1rem 1rem;
    }

    .group {
      display: grid;
      gap: 0.5rem;
    }

    .group-heading {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
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
        <div class="message">
          Waiting for Controller diagnostics…
        </div>
      `;
    }

    const capability =
      this.chargerState.capabilities.controller_diagnostics;

    if (
      capability === undefined
      || capability.status === "unavailable"
      || !this.hasRelevantRole()
    ) {
      return "";
    }

    return html`
      <details class="diagnostics">
        <summary>
          <span class="summary-content">
            <span class="summary-title">Controller diagnostics</span>
            <span class="capability-status">${capability.status}</span>
          </span>
        </summary>

        <div class="content">
          ${this.renderGroup(
            "Controller battery",
            CONTROLLER_BATTERY_METRICS,
          )}
          ${this.renderGroup(
            "Runtime",
            CONTROLLER_RUNTIME_METRICS,
          )}
          ${this.renderGroup(
            "System",
            CONTROLLER_SYSTEM_METRICS,
          )}
        </div>
      </details>
    `;
  }

  private renderGroup(
    title: string,
    metrics: ReadonlyArray<{ label: string; role: string }>,
  ) {
    return html`
      <section class="group">
        <div class="group-heading">${title}</div>
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${metrics}
        ></r4875g1-semantic-metric-grid>
      </section>
    `;
  }

  private hasRelevantRole(): boolean {
    return CONTROLLER_DIAGNOSTIC_METRIC_GROUPS.some((metrics) =>
      metrics.some(
        ({ role }) => this.chargerState?.roles[role] !== undefined,
      ),
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

if (!customElements.get(CONTROLLER_DIAGNOSTICS_TAG)) {
  customElements.define(
    CONTROLLER_DIAGNOSTICS_TAG,
    ControllerDiagnostics,
  );
}
