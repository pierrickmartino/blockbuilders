import * as React from "react";
import { Badge1 } from "@/components/BadgeCustom";

type Props = {
  data: number[];
};

export default function DeltaChip({ data }: Props) {
  const closes = data; // from oldest to latest
  const firstClose = closes[0];
  const lastClose = closes[closes.length - 1];

  const delta = ((lastClose - firstClose) / Math.abs(firstClose)) * 100;
  const roundedDelta = delta.toFixed(2); // e.g., 24.57

  let chipColor: "success" | "error" | "neutral" = "neutral";
  if (delta > 0) chipColor = "success";
  else if (delta < 0) chipColor = "error";

  // const sign = delta >= 0 ? "+" : "-";

  return <Badge1 color={chipColor} label={`${roundedDelta}%`} />;
}
