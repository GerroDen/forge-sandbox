import Resolver from "@forge/resolver";
import { getText } from "@/lib/get-text";
import { isJiraGlobalAdmin } from "@/lib/permissions";
import { z } from "zod";
import { getTextSchema } from "@/lib/get-text-schema";
import { GetTextPayload } from "bridge/get-text";

const resolver = new Resolver();

resolver.define("getText", async (req) => {
  console.log("called getText()");
  await requireAccess({ req });
  const accountId = requireAccountId(req);
  const payload: GetTextPayload = getTextSchema.parse(req.payload);
  console.log("accessed getText()");
  return getText({ ...payload, accountId });
});

interface RequireAccessParams {
  req: { context: Record<string, unknown> };
}

async function requireAccess({ req }: RequireAccessParams) {
  const isAdmin = await isJiraGlobalAdmin();
  if (!isAdmin) {
    throw new Error("not permitted");
  }
}

function requireAccountId(req: { context: Record<string, unknown> }): string {
  return z.string().parse(req.context.accountId);
}

export const handler = resolver.getDefinitions();
