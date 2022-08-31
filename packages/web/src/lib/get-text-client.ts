import { Functions, GetTextPayload } from "bridge/get-text";
import { invoke } from "@forge/bridge";

export function getText(payload: GetTextPayload): Promise<string> {
  return invoke<string>(Functions.getText, payload);
}
