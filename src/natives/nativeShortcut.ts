import { showToast } from "../comps/utils/toast";
import { toggleClickCursorThrough } from "./nativeWindow";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getTaurPlatformInfo } from "./native";

const TOGGLE_CLICK_SHORTCUT = "Ctrl+Shift+J (Mac: also Cmd+Shift+J)";
const registrations = new Map<string, Promise<void>>();

async function setupShortcuts(): Promise<void> {
  // Keep the global shortcut registered while the window is unfocused.
  const shortcuts = ["Control+Shift+J"];
  if (await getTaurPlatformInfo() === "macos") {
    shortcuts.push("Command+Shift+J");
  }
  for (const shortcut of shortcuts) {
    let registration = registrations.get(shortcut);
    registration ??= register(shortcut, async (event) => {
      if (event.state !== "Pressed") return;
      try {
        await toggleClickCursorThrough();
      } catch (error) {
        console.error("Failed to toggle click-through", error);
        showToast("Could not change click-through. Please try again.");
      }
    }).catch((error) => {
      registrations.delete(shortcut);
      throw error;
    });
    registrations.set(shortcut, registration);
    await registration;
  }
}

export {
    TOGGLE_CLICK_SHORTCUT,
    setupShortcuts
}
