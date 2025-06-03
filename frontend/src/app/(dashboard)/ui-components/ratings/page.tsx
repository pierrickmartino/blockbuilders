"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { Grid } from "@mui/material";
import BasicCard from "../../components/shared/BasicCard";
import { Heading } from "@/components/Heading";

export default function BasicRating() {
  const [value, setValue] = React.useState<number | null>(2);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <BasicCard title="Basic rating">
          <Box
            sx={{
              "& > legend": { mt: 2 },
            }}
          >
            <Heading variant="body2">Controlled</Heading>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
            <Heading variant="body2">Read only</Heading>
            <Rating name="read-only" value={value} readOnly />
            <Heading variant="body2">Disabled</Heading>
            <Rating name="disabled" value={value} disabled />
            <Heading variant="body2">No rating given</Heading>
            <Rating name="no-value" value={null} />
          </Box>
        </BasicCard>
      </Grid>
    </Grid>
  );
}
