export interface HomeAssistantCustomCardRegistration {
  type: string;
  name: string;
  description?: string;
  preview?: boolean;
}

declare global {
  interface Window {
    customCards?: HomeAssistantCustomCardRegistration[];
  }
}

export function registerCustomCard(
  registration: HomeAssistantCustomCardRegistration,
): void {
  const registrations = window.customCards ??= [];

  if (registrations.some(({ type }) => type === registration.type)) {
    return;
  }

  registrations.push(registration);
}
