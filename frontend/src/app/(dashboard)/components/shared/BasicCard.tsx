import React from "react";
import { Stack, Box } from "@mui/material";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";

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
              <Heading variant="subtitle2" className="mb-2">
                {title}
              </Heading>
            ) : (
              ""
            )}
            {subtitle ? (
              <Heading variant="caption2" className="mb-2">
                {subtitle}
              </Heading>
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
