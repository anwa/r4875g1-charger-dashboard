import { LitElement, css, html } from "lit";

import type { UnsubscribeFunction } from "../api/client";
import type { SemanticRoleSnapshot } from "../api/types";
import {
  formatSemanticRole,
  type SemanticRoleDisplayValue,
} from "../presentation/semantic-role-format";
import type { ChargerState } from "../state/reducer";
import type { ChargerStore } from "../state/store";
import "./collapsible-section";
import "./semantic-metric-grid";
import type { SemanticMetricDefinition } from "./semantic-metric-grid";

export const CONTROLLER_DIAGNOSTICS_TAG =
  "r4875g1-controller-diagnostics";

const CONTROLLER_BATTERY_METRICS: ReadonlyArray<SemanticMetricDefinition> = [
  {
    label: "Controller battery voltage",
    role: "system.controller_battery.voltage",
  },
  {
    label: "Controller battery state of charge",
    role: "system.controller_battery.soc",
  },
];

const CONTROLLER_RUNTIME_METRICS: ReadonlyArray<SemanticMetricDefinition> = [
  {
    label: "CPU temperature",
    role: "system.cpu.temperature",
  },
  {
    label: "CPU frequency",
    role: "system.cpu.frequency",
    formatter: formatCpuFrequency,
  },
  {
    label: "Loop time",
    role: "system.loop_time",
  },
  {
    label: "Heap free",
    role: "system.heap.free",
    formatter: formatMemoryKilobytes,
  },
  {
    label: "Heap max block",
    role: "system.heap.max_block",
    formatter: formatMemoryKilobytes,
  },
  {
    label: "PSRAM free",
    role: "system.psram.free",
    formatter: formatMemoryKilobytes,
  },
  {
    label: "Uptime",
    role: "system.uptime",
    formatter: formatUptime,
  },
  {
    label: "WiFi RSSI",
    role: "system.wifi.rssi",
  },
];

const CONTROLLER_SYSTEM_METRICS: ReadonlyArray<SemanticMetricDefinition> = [
  {
    label: "ESPHome version",
    role: "system.esphome_version",
  },
  {
    label: "Device info",
    role: "system.device_info",
    formatter: formatPipeDelimitedText,
  },
  {
    label: "Reset reason",
    role: "system.reset_reason",
  },
];

const CONTROLLER_DIAGNOSTIC_METRIC_GROUPS = [
  CONTROLLER_BATTERY_METRICS,
  CONTROLLER_RUNTIME_METRICS,
  CONTROLLER_SYSTEM_METRICS,
] as const;

function formatCpuFrequency(
  snapshot: SemanticRoleSnapshot | undefined,
): SemanticRoleDisplayValue {
  return formatScaledMetric(snapshot, 1_000_000, "MHz", 0);
}

function formatMemoryKilobytes(
  snapshot: SemanticRoleSnapshot | undefined,
): SemanticRoleDisplayValue {
  return formatScaledMetric(snapshot, 1024, "kB", 3);
}

function formatUptime(
  snapshot: SemanticRoleSnapshot | undefined,
): SemanticRoleDisplayValue {
  const fallback = formatSemanticRole(snapshot);
  const state = snapshot?.state;

  if (
    !fallback.available
    || state === null
    || state === undefined
    || state.trim() === ""
  ) {
    return fallback;
  }

  const numericValue = Number(state);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  const totalSeconds = Math.max(0, Math.floor(numericValue));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    available: true,
    value: [
      String(days).padStart(2, "0"),
      [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":"),
    ].join(" "),
    unit: null,
  };
}

function formatPipeDelimitedText(
  snapshot: SemanticRoleSnapshot | undefined,
): SemanticRoleDisplayValue {
  const fallback = formatSemanticRole(snapshot);

  if (!fallback.available) {
    return fallback;
  }

  return {
    ...fallback,
    value: fallback.value
      .split("|")
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .join("\n"),
  };
}

function formatScaledMetric(
  snapshot: SemanticRoleSnapshot | undefined,
  divisor: number,
  unit: string,
  fractionDigits: number,
): SemanticRoleDisplayValue {
  const fallback = formatSemanticRole(snapshot);
  const state = snapshot?.state;

  if (
    !fallback.available
    || state === null
    || state === undefined
    || state.trim() === ""
  ) {
    return fallback;
  }

  const numericValue = Number(state);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return {
    available: true,
    value: new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      useGrouping: false,
    }).format(numericValue / divisor),
    unit,
  };
}

export class ControllerDiagnostics extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .content {
      display: grid;
      gap: 1rem;
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
      <r4875g1-collapsible-section
        .sectionTitle=${"Controller diagnostics"}
        .statusText=${capability.status}
      >
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
            true,
          )}
        </div>
      </r4875g1-collapsible-section>
    `;
  }

  private renderGroup(
    title: string,
    metrics: ReadonlyArray<SemanticMetricDefinition>,
    stacked = false,
  ) {
    return html`
      <section class="group">
        <div class="group-heading">${title}</div>
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${metrics}
          .stacked=${stacked}
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
