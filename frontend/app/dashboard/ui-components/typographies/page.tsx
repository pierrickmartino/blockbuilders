"use client";
import { Stack, Alert, AlertTitle, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BasicCard from "../../components/shared/BasicCard";

const Typographies = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <BasicCard title="Typographies">
            <Stack spacing={2}>
              <Typography variant="h1">Typography : Variant h1</Typography>
              <Typography variant="h2">Typography : Variant h2</Typography>
              <Typography variant="h3">Typography : Variant h3</Typography>
              <Typography variant="h4">Typography : Variant h4</Typography>
              <Typography variant="h5">Typography : Variant h5</Typography>
              <Typography variant="h6">Typography : Variant h6</Typography>
              <Typography variant="subtitle1">
                Typography : Variant subtitle1
              </Typography>
              <Typography variant="subtitle2">
                Typography : Variant subtitle2
              </Typography>
              <Typography variant="subtitle2" component="h2">
                Typography : Variant subtitle2
              </Typography>
              <Typography variant="body1">
                Typography : Variant body1
              </Typography>
              <Typography variant="body2">
                Typography : Variant body2
              </Typography>
              <Typography variant="caption">
                Typography : Variant caption
              </Typography>
            </Stack>
          </BasicCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Typographies;
