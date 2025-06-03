'use client';
import { Grid, Pagination, Stack } from "@mui/material";
import BasicCard from "../../components/shared/BasicCard";


const Paginations = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <BasicCard title="Paginations">
          <Stack spacing={2}>
            <Pagination count={10} />
            <Pagination count={10} color="primary" />
            <Pagination count={10} color="secondary" />
            <Pagination count={10} disabled />
          </Stack>
        </BasicCard>
      </Grid>
      <Grid item xs={12} lg={12}>
        <BasicCard title="Outlined Paginations">
          <Stack spacing={2}>
            <Pagination count={10} variant="outlined" />
            <Pagination count={10} variant="outlined" color="primary" />
            <Pagination count={10} variant="outlined" color="secondary" />
            <Pagination count={10} variant="outlined" disabled />
          </Stack>
        </BasicCard>
      </Grid>
      <Grid item xs={12} lg={12}>
        <BasicCard title="Squred Paginations">
          <Stack spacing={2}>
            <Pagination count={10} shape="rounded" variant="outlined" />
            <Pagination
              count={10}
              shape="rounded"
              variant="outlined"
              color="primary"
            />
            <Pagination
              count={10}
              shape="rounded"
              variant="outlined"
              color="secondary"
            />
            <Pagination
              count={10}
              shape="rounded"
              variant="outlined"
              disabled
            />
          </Stack>
        </BasicCard>
      </Grid>
    </Grid>
  );
};

export default Paginations;
