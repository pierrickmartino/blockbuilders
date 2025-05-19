import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { SparkLineChart, areaElementClasses } from "@mui/x-charts";

type Props = {
  data: number[]; // closes reversed: oldest → latest
  days: string[]; // labels for the last 30 days
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0" stopColor={color} stopOpacity={0.3} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function PriceSparkline({ data, days }: Props) {
  const theme = useTheme();
  const gradientId = React.useId();

  /* derive numbers only once */
  const first = Number(data[0]);
  const last = Number(data[data.length - 1]);
  // const minY = Math.min(...data) * 0.95;
  // const maxY = Math.max(...data) * 1.05;
 
  const color = first < last ? theme.palette.success.main : first > last ? theme.palette.error.main : theme.palette.grey[400];
  // console.log("first: " + first);
  // console.log("last: " + last);
  // console.log("color: " + color);
  return (
    <SparkLineChart
      data={data}
      colors={[color]}
      height={100}
      area
      showHighlight
      showTooltip
      // yAxis={{ min: minY, max: maxY }}
      xAxis={{ scaleType: "band", data: days }}
      sx={{
        [`& .${areaElementClasses.root}`]: {
          fill: `url(#${gradientId})`,
        },
      }}
    >
      <AreaGradient color={color} id={gradientId} />
    </SparkLineChart>
  );
}
