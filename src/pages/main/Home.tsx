/* eslint-disable */
import { WidgetCard } from "@components/WidgetCard";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { BarChart, DefaultizedPieValueType, pieArcLabelClasses, PieChart } from "@mui/x-charts";

export const Home = () => {
  const data = [
    {label: 'Group A', value: 400, color: '#0088FE'},
    {label: 'Group B', value: 300, color: '#00C49F'},
    {label: 'Group C', value: 300, color: '#FFBB28'},
    {label: 'Group D', value: 200, color: '#FF8042'},
  ];

  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType): any => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <WidgetCard
                title="Weekly Sales"
                total={714}
                icon={<img src="/images/icons/user-tick.png"/>}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WidgetCard
                title="New Users"
                total={135}
                icon={<img src="/images/icons/dollar.png"/>}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WidgetCard
                title="Item Orders"
                total={17}
                icon={<img src="/images/icons/chart.png"/>}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WidgetCard
                title="Bug Reports"
                total={23}
                icon={<img src="/images/icons/box.png"/>}/>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography>نمودار فروش</Typography>
                <BarChart
                    height={200}
                    xAxis={[{scaleType: 'band', data: ['group A', 'group B', 'group C']}]}
                    series={[{data: [4, 3, 5]}, {data: [1, 6, 3]}, {data: [2, 5, 6]}]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography>نمودار فروش دسته بندی ها</Typography>
                <PieChart
                    series={[
                      {
                        outerRadius: 80,
                        data,
                        arcLabel: getArcLabel as any,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontSize: 14,
                      },
                    }}
                    height={200}
                    margin={{right: 5}}
                    legend={{hidden: true}}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
  )
}
