export type ChargerInstanceStatus =
  | "ok"
  | "degraded"
  | "offline"
  | "incompatible";

export type CapabilityStatus =
  | "available"
  | "partial"
  | "unavailable";

export type ControlAction = "press" | "set_value" | "set_switch";

export type SemanticControlValue = number | boolean;

export interface CapabilitySummary {
  required: boolean;
  status: CapabilityStatus;
  available: boolean;
}

export interface ChargerInstanceSummary {
  config_entry_id: string;
  name: string;
  status: ChargerInstanceStatus;
  online: boolean;
  compatible: boolean;
  contract_version: string | null;
  firmware_version: string | null;
  capabilities: Record<string, CapabilitySummary>;
}

export interface NumberControlMetadata {
  action: "set_value";
  available: boolean;
  min: number | null;
  max: number | null;
  step: number | null;
  unit: string | null;
}

export interface PressControlMetadata {
  action: "press";
  available: boolean;
}

export interface SwitchControlMetadata {
  action: "set_switch";
  available: boolean;
}

export type RoleControlMetadata =
  | NumberControlMetadata
  | PressControlMetadata
  | SwitchControlMetadata;

export interface SemanticRoleSnapshot {
  available: boolean;
  state: string | null;
  unit?: string | null;
  entity_id?: string;
  domain?: string;
  control?: RoleControlMetadata;
}

export interface ChargerInstanceSnapshot extends ChargerInstanceSummary {
  roles: Record<string, SemanticRoleSnapshot>;
}

export interface InstancesResponse {
  instances: ChargerInstanceSummary[];
}

export interface SemanticControlResult {
  role: string;
  entity_id: string;
  action: ControlAction;
  service_call_completed: true;
}

export interface SnapshotSubscriptionEvent {
  event: "snapshot";
  data: ChargerInstanceSnapshot;
}

export interface RoleStateSubscriptionEvent {
  event: "role_state";
  role: string;
  data: SemanticRoleSnapshot;
  instance?: ChargerInstanceSummary;
}

export interface MappingChangedSubscriptionEvent {
  event: "mapping_changed";
  data: ChargerInstanceSnapshot;
}

export interface MappingErrorSubscriptionEvent {
  event: "mapping_error";
  error: string;
}

export type ChargerSubscriptionEvent =
  | SnapshotSubscriptionEvent
  | RoleStateSubscriptionEvent
  | MappingChangedSubscriptionEvent
  | MappingErrorSubscriptionEvent;
