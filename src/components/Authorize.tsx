import { PropsWithChildren } from "react";
// import { PermissionName } from "@models/business";
// import { useUser } from "@hooks/useUser";

interface AuthorizeProps {
  include?: PermissionName[];
}

export const Authorize = (props: PropsWithChildren<AuthorizeProps>) => {
  const { children, include = [] } = props;
  const user = useUser();
  // FIXME: use zustand and just check token
  const permissions = user.permission.map(p => p.name);
  const hasAuthorize = include.includes("*") || permissions.findIndex(p => include.includes(p)) !== -1;
  return hasAuthorize ? children : <></>;
}
