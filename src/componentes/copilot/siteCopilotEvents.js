export const SITE_COPILOT_OPEN_EVENT = "freshsense:open-site-copilot";

export function openSiteCopilot() {
  window.dispatchEvent(new CustomEvent(SITE_COPILOT_OPEN_EVENT));
}
