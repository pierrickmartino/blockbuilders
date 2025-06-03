import * as React from "react";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";

export default function HighlightedCard() {
  return (
    <Card>
      <InsightsRoundedIcon />
      <Heading variant="body" className="mb-1 font-medium">
        Explore your data
      </Heading>
      <Heading variant="subtitle" className="mb-3">
        Uncover performance and visitor insights with our data wizardry.
      </Heading>
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
