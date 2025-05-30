import * as React from "react";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

export default function CardAlert() {
  return (
    <Card>
      <AutoAwesomeRoundedIcon fontSize="small" />
      <Typography gutterBottom sx={{ fontWeight: 600 }}>
        Plan about to expire
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Enjoy 10% off when renewing your plan today.
      </Typography>
      <Button variant="primary" className="w-full text-sm">
        Get the discount
      </Button>
    </Card>
  );
}
