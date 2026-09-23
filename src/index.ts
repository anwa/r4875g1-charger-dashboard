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
  SemanticControlValue,
  SemanticRoleSnapshot,
  SnapshotSubscriptionEvent,
  SwitchControlMetadata,
} from "./api/types";

export { reduceChargerSubscriptionEvent } from "./state/reducer";
export type { ChargerState } from "./state/reducer";

export { ChargerStore } from "./state/store";
export type { ChargerStoreListener } from "./state/store";

export {
  CHARGER_STATUS_TAG,
  ChargerStatusPreview,
} from "./components/charger-status-preview";

export {
  CHARGER_NUMBER_CONTROL_TAG,
  ChargerNumberControl,
} from "./components/charger-number-control";

export {
  CHARGER_SWITCH_CONTROL_TAG,
  ChargerSwitchControl,
} from "./components/charger-switch-control";

export {
  COOLING_STATUS_TAG,
  CoolingStatus,
} from "./components/cooling-status";

export {
  RECTIFIER_DETAILS_TAG,
  RectifierDetails,
} from "./components/rectifier-details";

export {
  CHARGER_SETPOINT_CONTROLS_TAG,
  ChargerSetpointControls,
} from "./components/charger-setpoint-controls";

export {
  CHARGER_POWER_CONTROL_TAG,
  ChargerPowerControl,
} from "./components/charger-power-control";
export type {
  ChargerControlExecutor,
} from "./components/charger-power-control";

export {
  CHARGER_OVERVIEW_CARD_TAG,
  ChargerOverviewCard,
} from "./components/charger-overview-card";
export type {
  ChargerOverviewCardConfig,
} from "./components/charger-overview-card";

console.info(`[${DASHBOARD_NAME}] frontend bootstrap loaded`);
