import type { SemanticRoleSnapshot } from "../api/types";

export interface SemanticRoleDisplayValue {
  available: boolean;
  value: string;
  unit: string | null;
}

export function formatSemanticRole(
  snapshot: SemanticRoleSnapshot | undefined,
): SemanticRoleDisplayValue {
  if (snapshot?.available !== true) {
    return {
      available: false,
      value: "unavailable",
      unit: null,
    };
  }

  return {
    available: true,
    value: formatSemanticState(snapshot.state),
    unit: snapshot.unit ?? null,
  };
}

export function formatSemanticState(state: string | null): string {
  if (state === null) {
    return "unavailable";
  }

  const numericValue = Number(state);

  if (!Number.isFinite(numericValue)) {
    return state;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(numericValue);
}
