import * as React from "react";
import Typography from "@mui/material/Typography";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

export default function HighlightedCard() {
  return (
    <Card>
      <InsightsRoundedIcon />
      <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: "600" }}>
        Explore your data
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: "8px" }}>Uncover performance and visitor insights with our data wizardry.</Typography>
      <Button variant="primary" className="w-full md:w-auto text-sm">
        Get insights
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5 ms-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </Button>
    </Card>
  );
}
