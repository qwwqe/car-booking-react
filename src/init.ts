import { enableMapSet } from "immer";

/**
 * Perform library and environment-related initialization.
 *
 * This should only be called once.
 */
export default function init() {
  // Enable Immer functionality on native Map and Set objects.
  enableMapSet();
}
