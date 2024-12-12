"use client";
import { Stack, Alert, AlertTitle, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BasicCard from "../../components/shared/BasicCard";

const Alerts = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <BasicCard title="Alerts">
            <Stack spacing={2}>
              <Alert severity="error" color="error">
                This is an error alert — check it out!
              </Alert>
              <Alert severity="warning" color="warning">
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="info">
                This is an info alert — check it out!
              </Alert>
              <Alert severity="success">
                This is a success alert — check it out!
              </Alert>
            </Stack>
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <BasicCard title="Alerts Outline">
            <Stack spacing={2}>
              <Alert severity="error" variant="outlined">
                This is an error alert — check it out!
              </Alert>
              <Alert severity="warning" variant="outlined">
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="info" variant="outlined">
                This is an info alert — check it out!
              </Alert>
              <Alert severity="success" variant="outlined">
                This is a success alert — check it out!
              </Alert>
            </Stack>
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <BasicCard title="Alert with Desc">
            <Stack spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                This is an error alert — <strong>check it out!</strong>
              </Alert>
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                This is a warning alert — <strong>check it out!</strong>
              </Alert>
              <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                This is an info alert — <strong>check it out!</strong>
              </Alert>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                This is a success alert — <strong>check it out!</strong>
              </Alert>
            </Stack>
          </BasicCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Alerts;
