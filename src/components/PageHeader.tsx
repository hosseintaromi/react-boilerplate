import { Stack, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

interface PageHeaderProps {
  title: string | ReactNode;
}

export const PageHeader = (props: PropsWithChildren<PageHeaderProps>) => {
  const {title, children} = props;
  return (
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        {typeof title === 'string' ? <Typography variant="h4">{title}</Typography> : title}
        {children}
      </Stack>
  )
}
