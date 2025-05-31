import * as React from "react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { Heading } from "@/components/shared/Heading";

export default function CardAlert() {
  return (
    <Card>
      <AutoAwesomeRoundedIcon fontSize="small" />
      <Heading variant="body" className="mb-1 font-medium">
        Plan about to expire
      </Heading>
      <Heading variant="subtitle" className="mb-3">
        Enjoy 10% off when renewing your plan today.
      </Heading>
      <Button variant="primary" className="w-full text-sm">
        Get the discount
      </Button>
    </Card>
  );
}
