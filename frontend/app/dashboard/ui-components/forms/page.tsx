"use client";
import {
  // Paper,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Fragment } from "react";
import BasicCard from "../../components/shared/BasicCard";
import { Height } from "@mui/icons-material";
import { Button } from "@/components/shared/Button";

const Forms = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 12 }}>
        <BasicCard title="Form Layout">
          <Box
            component="form"
            // onSubmit={handleSubmit(onSubmit)}
            // noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                // error={errors.email ? true : false}
                // helperText={errors.email?.message}
                id="name"
                type="text"
                // name="email"
                placeholder="Nirav Joshi"
                autoFocus
                required
                fullWidth
                variant="outlined"
                // {...register("email", { required: "Email is required" })}
                // color={errors.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                // error={errors.email ? true : false}
                // helperText={errors.email?.message}
                id="email"
                type="email"
                // name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                // {...register("email", { required: "Email is required" })}
                // color={errors.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                // error={passwordError}
                // helperText={passwordErrorMessage}
                // name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                // {...register("password", { required: "Password is required" })}
                // color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="error">Error</FormLabel>
              <TextField
                error
                helperText="Error message"
                id="error"
                type="text"
                // name="email"
                fullWidth
                variant="outlined"
                // {...register("email", { required: "Email is required" })}
                // color={errors.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="multiline">Multiline</FormLabel>
              <TextField
                multiline
                id="multiline"
                rows={4}
                // name="email"
                defaultValue="Default Value"
                fullWidth
                variant="outlined"
                // {...register("email", { required: "Email is required" })}
                // color={errors.email ? "error" : "primary"}
              />
            </FormControl>

            <Fragment>
              <Stack spacing={3}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Terms & Condition"
                  />
                  <FormControlLabel
                    disabled
                    control={<Checkbox />}
                    label="Disabled"
                  />
                </FormGroup>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
              <br />
              <Button>Submit</Button>
            </Fragment>
          </Box>
        </BasicCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 12 }}>
        <BasicCard title="Form Design Type">
          <Stack spacing={3} direction="row">
            <TextField
              id="outlined-basic"
              placeholder="Outlined"
              variant="outlined"
            />
            <TextField
              id="filled-basic"
              placeholder="Filled"
              variant="filled"
            />
            <TextField
              id="standard-basic"
              placeholder="Standard"
              variant="standard"
            />
          </Stack>
        </BasicCard>
      </Grid>
    </Grid>
  );
};

export default Forms;
