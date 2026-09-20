export const DASHBOARD_NAME = "R4875G1 Charger Dashboard";

export {
  controlChargerRole,
  getChargerInstance,
  listChargerInstances,
  subscribeChargerInstance,
} from "./api/client";

export type {
  HomeAssistantConnection,
  HomeAssistantWebSocket,
  UnsubscribeFunction,
} from "./api/client";

export type {
  CapabilityStatus,
  CapabilitySummary,
  ChargerInstanceSnapshot,
  ChargerInstanceStatus,
  ChargerInstanceSummary,
  ChargerSubscriptionEvent,
  ControlAction,
  InstancesResponse,
  MappingChangedSubscriptionEvent,
  MappingErrorSubscriptionEvent,
  NumberControlMetadata,
  PressControlMetadata,
  RoleControlMetadata,
  RoleStateSubscriptionEvent,
  SemanticControlResult,
  SemanticRoleSnapshot,
  SnapshotSubscriptionEvent,
} from "./api/types";

console.info(`[${DASHBOARD_NAME}] frontend bootstrap loaded`);
