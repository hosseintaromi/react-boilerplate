import { Card, CardContent, CardProps, Stack, Typography } from '@mui/material';

interface WidgetSummaryProps extends CardProps {
  title?: string;
  total?: string | number;
  icon?: JSX.Element;
}

export const WidgetCard = (props: WidgetSummaryProps) => {
  const {title, total, icon, ...other} = props;

  return (
      <Card {...other}>
        <CardContent component={Stack}
                     spacing={3}
                     direction="row"
                     alignItems="center">
          {icon}
          <Stack>
            <Typography variant="h4">{total}</Typography>
            <Typography variant="subtitle2" sx={{color: 'text.disabled'}}>
              {title}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
  );
}
