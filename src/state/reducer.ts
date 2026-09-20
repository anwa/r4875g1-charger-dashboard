import type {
  ChargerInstanceSnapshot,
  ChargerSubscriptionEvent,
} from "../api/types";

export type ChargerState = ChargerInstanceSnapshot | null;

export function reduceChargerSubscriptionEvent(
  current: ChargerState,
  event: ChargerSubscriptionEvent,
): ChargerState {
  switch (event.event) {
    case "snapshot":
    case "mapping_changed":
      return event.data;

    case "role_state": {
      if (current === null) {
        return current;
      }

      const previousRole = current.roles[event.role];

      return {
        ...(event.instance ?? current),
        roles: {
          ...current.roles,
          [event.role]: {
            ...previousRole,
            ...event.data,
          },
        },
      };
    }

    case "mapping_error":
      return current;
  }
}
