import { App } from "obsidian";

/**
 * Temporary implementation to avoid CM6 dependency conflicts
 * This returns an empty array until we can properly resolve the CM6 integration
 */
function buttonPlugin(_app: App): any[] {
  // Return empty array to avoid CM6 multiple instance error
  // TODO: Implement proper CM6 extension once dependency conflicts are resolved
  return [];
}

export default buttonPlugin; 