import React from "react";
import { Typography, Stack, Box } from "@mui/material";
import { Card } from "@/components/shared/Card";

type Props = {
  title?: string;
  subtitle?: string;
  action?: JSX.Element | any;
  children?: JSX.Element;
};

const BasicCard = ({ title, subtitle, children, action }: Props) => {
  return (
    <Card>
      <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack direction="column" sx={{ justifyContent: "space-between" }}>
            {title ? (
              <Typography variant="subtitle2" gutterBottom>
                {title}
              </Typography>
            ) : (
              ""
            )}
            {subtitle ? (
              <Typography variant="caption" sx={{ color: "text.secondary" }} mb={2} gutterBottom>
                {subtitle}
              </Typography>
            ) : (
              ""
            )}
          </Stack>
          {action}
        </Stack>

        <Box>{children}</Box>
      </Stack>
    </Card>
  );
};

export default BasicCard;
