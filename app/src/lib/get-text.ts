import { GetTextPayload } from "bridge/get-text";

type GetTextParams = GetTextPayload & {
  accountId: string;
};

export function getText({ text }: GetTextParams): string {
  return "Hello, world!\n" + text;
}
