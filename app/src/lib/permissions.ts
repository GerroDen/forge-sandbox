import { ProjectPermissionResponse } from "@forge/auth/out/jira";
import { authorize } from "@forge/api";

const administerPermission = "ADMINISTER";

export function isGlobalAdminPermission(
  permission: ProjectPermissionResponse
): boolean {
  return permission.permission === administerPermission;
}

export async function isJiraGlobalAdmin(): Promise<boolean> {
  const permissions = await authorize().onJira([
    { permissions: [administerPermission] },
  ]);
  return permissions.every(isGlobalAdminPermission);
}
