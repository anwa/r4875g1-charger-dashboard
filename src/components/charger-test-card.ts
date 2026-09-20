import { LitElement, css, html } from "lit";

import type {
  HomeAssistantConnection,
  HomeAssistantWebSocket,
} from "../api/client";
import { ChargerStore } from "../state/store";
import "./charger-status-preview";

export const CHARGER_TEST_CARD_TAG = "r4875g1-charger-test-card";

export interface ChargerTestCardConfig {
  type?: string;
  config_entry_id: string;
}

export class ChargerTestCard extends LitElement {
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
  private config: ChargerTestCardConfig | null = null;
  private connectedConnection: HomeAssistantConnection | null = null;
  private connectedConfigEntryId: string | null = null;
  private connectionGeneration = 0;
  private connectionError: string | null = null;

  get hass(): HomeAssistantWebSocket | null {
    return this.homeAssistant;
  }

  set hass(value: HomeAssistantWebSocket | null) {
    this.homeAssistant = value;
    void this.connectIfReady();
  }

  setConfig(config: ChargerTestCardConfig): void {
    if (
      typeof config?.config_entry_id !== "string"
      || config.config_entry_id.trim() === ""
    ) {
      throw new Error("config_entry_id is required");
    }

    this.config = {
      ...config,
      config_entry_id: config.config_entry_id.trim(),
    };

    void this.connectIfReady();
    this.requestUpdate();
  }

  getCardSize(): number {
    return 3;
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
    super.disconnectedCallback();
  }

  protected render() {
    if (this.connectionError !== null) {
      return html`
        <ha-card>
          <div class="heading">R4875G1 Charger live test</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="heading">R4875G1 Charger live test</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
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

    const connection = this.homeAssistant.connection;
    const configEntryId = this.config.config_entry_id;

    if (
      this.connectedConnection === connection
      && this.connectedConfigEntryId === configEntryId
    ) {
      return;
    }

    const generation = ++this.connectionGeneration;
    this.connectedConnection = connection;
    this.connectedConfigEntryId = configEntryId;
    this.connectionError = null;
    this.requestUpdate();

    try {
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
}

if (!customElements.get(CHARGER_TEST_CARD_TAG)) {
  customElements.define(CHARGER_TEST_CARD_TAG, ChargerTestCard);
}
