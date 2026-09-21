import type { SemanticControlResult } from "../api/types";

export type ChargerControlExecutor = (
  role: string,
  value?: number,
) => Promise<SemanticControlResult>;
