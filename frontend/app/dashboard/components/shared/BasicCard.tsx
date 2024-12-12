import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
  action?: JSX.Element | any;
  children?: JSX.Element;
};

const BasicCard = ({ title, subtitle, children, action }: Props) => {
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}
        >
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
                <Typography variant="caption" sx={{ color: "text.secondary" }} gutterBottom>
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
      </CardContent>
    </Card>
  );
};

export default BasicCard;
