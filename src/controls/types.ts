import type {
  SemanticControlResult,
  SemanticControlValue,
} from "../api/types";

export type ChargerControlExecutor = (
  role: string,
  value?: SemanticControlValue,
) => Promise<SemanticControlResult>;
