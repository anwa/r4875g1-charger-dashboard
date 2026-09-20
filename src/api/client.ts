import type {
  ChargerInstanceSnapshot,
  ChargerSubscriptionEvent,
  InstancesResponse,
  SemanticControlResult,
} from "./types";

export type UnsubscribeFunction = () => void;

export interface HomeAssistantConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: Record<string, unknown>,
  ): Promise<UnsubscribeFunction>;
}

export interface HomeAssistantWebSocket {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  connection: HomeAssistantConnection;
}

export function listChargerInstances(
  hass: HomeAssistantWebSocket,
): Promise<InstancesResponse> {
  return hass.callWS<InstancesResponse>({
    type: "r4875g1_charger/instances",
  });
}

export function getChargerInstance(
  hass: HomeAssistantWebSocket,
  configEntryId: string,
): Promise<ChargerInstanceSnapshot> {
  return hass.callWS<ChargerInstanceSnapshot>({
    type: "r4875g1_charger/instance",
    config_entry_id: configEntryId,
  });
}

export function controlChargerRole(
  hass: HomeAssistantWebSocket,
  configEntryId: string,
  role: string,
  value?: number,
): Promise<SemanticControlResult> {
  const message: Record<string, unknown> = {
    type: "r4875g1_charger/control",
    config_entry_id: configEntryId,
    role,
  };

  if (value !== undefined) {
    message.value = value;
  }

  return hass.callWS<SemanticControlResult>(message);
}

export function subscribeChargerInstance(
  hass: HomeAssistantWebSocket,
  configEntryId: string,
  callback: (event: ChargerSubscriptionEvent) => void,
): Promise<UnsubscribeFunction> {
  return hass.connection.subscribeMessage<ChargerSubscriptionEvent>(
    callback,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: configEntryId,
    },
  );
}
