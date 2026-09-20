import {
  subscribeChargerInstance,
  type HomeAssistantWebSocket,
  type UnsubscribeFunction,
} from "../api/client";
import type { ChargerSubscriptionEvent } from "../api/types";
import {
  reduceChargerSubscriptionEvent,
  type ChargerState,
} from "./reducer";

export type ChargerStoreListener = (state: ChargerState) => void;

export class ChargerStore {
  private currentState: ChargerState = null;
  private backendUnsubscribe: UnsubscribeFunction | null = null;
  private generation = 0;
  private readonly listeners = new Set<ChargerStoreListener>();

  get state(): ChargerState {
    return this.currentState;
  }

  subscribe(listener: ChargerStoreListener): UnsubscribeFunction {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async connect(
    hass: HomeAssistantWebSocket,
    configEntryId: string,
  ): Promise<void> {
    this.disconnect();

    const generation = this.generation;

    const unsubscribe = await subscribeChargerInstance(
      hass,
      configEntryId,
      (event) => {
        if (generation !== this.generation) {
          return;
        }

        this.applyEvent(event);
      },
    );

    if (generation !== this.generation) {
      unsubscribe();
      return;
    }

    this.backendUnsubscribe = unsubscribe;
  }

  disconnect(): void {
    this.generation += 1;

    if (this.backendUnsubscribe !== null) {
      this.backendUnsubscribe();
      this.backendUnsubscribe = null;
    }

    if (this.currentState !== null) {
      this.currentState = null;
      this.notify();
    }
  }

  private applyEvent(event: ChargerSubscriptionEvent): void {
    const nextState = reduceChargerSubscriptionEvent(
      this.currentState,
      event,
    );

    if (nextState === this.currentState) {
      return;
    }

    this.currentState = nextState;
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentState);
    }
  }
}
