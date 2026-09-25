import { LitElement, css, html } from "lit";

import {
  controlChargerRole,
  listChargerInstances,
  type HomeAssistantConnection,
  type HomeAssistantWebSocket,
} from "../api/client";
import type { ChargerControlExecutor } from "../controls/types";
import { registerCustomCard } from "../home-assistant/custom-card-registry";
import { ChargerStore } from "../state/store";
import "./advanced-charger-status";
import "./charger-setpoint-controls";
import "./charger-power-control";
import "./charger-status-preview";
import "./cooling-status";
import "./controller-diagnostics";
import "./rectifier-details";

export const CHARGER_OVERVIEW_CARD_TAG = "r4875g1-charger-overview-card";

export interface ChargerOverviewCardConfig {
  type?: string;
  config_entry_id?: string;
}

export class ChargerOverviewCard extends LitElement {
  static getStubConfig(): ChargerOverviewCardConfig {
    return {};
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      padding: 1rem;
    }

    .heading {
      margin: 0 0 1rem;
      color: var(--primary-text-color, #212121);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .error {
      padding: 1rem;
      border-radius: 0.75rem;
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #ffffff);
    }
  `;

  private readonly chargerStore = new ChargerStore();
  private homeAssistant: HomeAssistantWebSocket | null = null;
  private config: ChargerOverviewCardConfig | null = null;
  private connectedConnection: HomeAssistantConnection | null = null;
  private connectedConfigEntryId: string | null = null;
  private discoveredConnection: HomeAssistantConnection | null = null;
  private discoveredConfigEntryId: string | null = null;
  private connectionGeneration = 0;
  private connectionError: string | null = null;

  get hass(): HomeAssistantWebSocket | null {
    return this.homeAssistant;
  }

  set hass(value: HomeAssistantWebSocket | null) {
    this.homeAssistant = value;
    void this.connectIfReady();
    this.requestUpdate();
  }

  setConfig(config: ChargerOverviewCardConfig): void {
    if (
      config.config_entry_id !== undefined
      && (
        typeof config.config_entry_id !== "string"
        || config.config_entry_id.trim() === ""
      )
    ) {
      throw new Error("config_entry_id must be a non-empty string");
    }

    this.config = {
      ...config,
      config_entry_id: config.config_entry_id?.trim(),
    };

    this.discoveredConnection = null;
    this.discoveredConfigEntryId = null;
    void this.connectIfReady();
    this.requestUpdate();
  }

  getCardSize(): number {
    return 16;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.connectIfReady();
  }

  disconnectedCallback(): void {
    this.connectionGeneration += 1;
    this.chargerStore.disconnect();
    this.connectedConnection = null;
    this.connectedConfigEntryId = null;
    this.discoveredConnection = null;
    this.discoveredConfigEntryId = null;
    super.disconnectedCallback();
  }

  protected render() {
    if (this.connectionError !== null) {
      return html`
        <ha-card>
          <div class="heading">R4875G1 Charger</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="heading">R4875G1 Charger</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
        <r4875g1-advanced-charger-status
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-advanced-charger-status>
        <r4875g1-rectifier-details
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-rectifier-details>
        <r4875g1-cooling-status
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-cooling-status>
        <r4875g1-charger-setpoint-controls
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-charger-setpoint-controls>
        <r4875g1-charger-power-control
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-charger-power-control>
        <r4875g1-controller-diagnostics
          .store=${this.chargerStore}
        ></r4875g1-controller-diagnostics>
      </ha-card>
    `;
  }

  private async connectIfReady(): Promise<void> {
    if (
      !this.isConnected
      || this.homeAssistant === null
      || this.config === null
    ) {
      return;
    }

    const generation = ++this.connectionGeneration;
    const connection = this.homeAssistant.connection;

    try {
      const configEntryId = await this.resolveConfigEntryId(
        this.homeAssistant,
      );

      if (generation !== this.connectionGeneration) {
        return;
      }

      if (
        this.connectedConnection === connection
        && this.connectedConfigEntryId === configEntryId
      ) {
        return;
      }

      this.connectedConnection = connection;
      this.connectedConfigEntryId = configEntryId;
      this.connectionError = null;
      this.requestUpdate();

      await this.chargerStore.connect(
        this.homeAssistant,
        configEntryId,
      );
    } catch (error) {
      if (generation !== this.connectionGeneration) {
        return;
      }

      this.chargerStore.disconnect();
      this.connectedConnection = null;
      this.connectedConfigEntryId = null;
      this.connectionError = error instanceof Error
        ? error.message
        : String(error);
      this.requestUpdate();
      return;
    }

    if (generation !== this.connectionGeneration) {
      return;
    }

    this.requestUpdate();
  }

  private readonly executeControl: ChargerControlExecutor = (
    role,
    value,
  ) => {
    if (
      this.homeAssistant === null
      || this.connectedConfigEntryId === null
    ) {
      return Promise.reject(
        new Error("Charger Instance is not connected"),
      );
    }

    return controlChargerRole(
      this.homeAssistant,
      this.connectedConfigEntryId,
      role,
      value,
    );
  };

  private async resolveConfigEntryId(
    hass: HomeAssistantWebSocket,
  ): Promise<string> {
    const configuredId = this.config?.config_entry_id;

    if (configuredId !== undefined) {
      return configuredId;
    }

    if (
      this.discoveredConnection === hass.connection
      && this.discoveredConfigEntryId !== null
    ) {
      return this.discoveredConfigEntryId;
    }

    const response = await listChargerInstances(hass);

    if (response.instances.length === 0) {
      throw new Error("No R4875G1 Charger Instance is available");
    }

    if (response.instances.length > 1) {
      throw new Error(
        "Multiple R4875G1 Charger Instances found; configure config_entry_id",
      );
    }

    const configEntryId = response.instances[0].config_entry_id;
    this.discoveredConnection = hass.connection;
    this.discoveredConfigEntryId = configEntryId;

    return configEntryId;
  }
}

if (!customElements.get(CHARGER_OVERVIEW_CARD_TAG)) {
  customElements.define(CHARGER_OVERVIEW_CARD_TAG, ChargerOverviewCard);
}

registerCustomCard({
  type: CHARGER_OVERVIEW_CARD_TAG,
  name: "R4875G1 Charger",
  description: "Control and monitor an R4875G1 Charger",
  preview: true,
});
