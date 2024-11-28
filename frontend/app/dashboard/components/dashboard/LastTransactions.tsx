import React, { Fragment } from "react";

import {
  Box,
  Avatar,
  Stack,
  Typography,
  Button,
  MenuItem,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useTheme } from '@mui/material/styles';

import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import CustomSelect from "../forms/theme-elements/CustomSelect";
import { Transaction } from "@/app/lib/definition";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

// Define the props type that will be passed into WalletTable
interface LastTransactionsProps {
  transactions: Transaction[];
  count: number;
}

const LastTransaction: React.FC<LastTransactionsProps> = ({
  transactions,
  count,
}) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // select
  const [number, setNumber] = React.useState("");

  const handleChange3 = (event: any) => {
    setNumber(event.target.value);
  };
  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  return (
    <Card variant="outlined" sx={{ px: 0, py: 1, height: "100%", flexGrow: 1 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="fullWidth"
              >
                <Tab label="Activity" value="1" />
                <Tab label="Profile" value="2" />
                <Tab label="Settings" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Timeline
                sx={{
                  mt: -2,
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                {transactions.map((transaction: Transaction, index: number) => (
                  <TimelineItem key={transaction.id}>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          backgroundColor: "transparent",
                          margin: 0,
                          boxShadow: "none",
                          [".MuiTimelineConnector-root"]: {
                          width: "1px !important",
                          backgroundColor: "rgba(244, 249, 248, 0.12) !important"
                        },
                        }}
                      >
                        <Avatar
                          alt={transaction.position.contract.blockchain.name}
                          src={
                            "/images/logos/" +
                            transaction.position.contract.blockchain.icon
                          }
                        />
                      </TimelineDot>
                      {/* Conditionally render the TimelineConnector if this is not the last item */}
                      {index < transactions.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography component="h2" variant="subtitle2">
                            {transaction.position.contract.symbol}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {transaction.against_contract.symbol}
                          </Typography>
                        </Stack>
                        <Chip
                          icon={
                            transaction.type == "IN" ? (
                              <ArrowDropUp sx={{ color: "success.main" }} />
                            ) : transaction.type == "OUT" ? (
                              <ArrowDropDown sx={{ color: "error.main" }} />
                            ) : (
                              <Fragment></Fragment>
                            )
                          }
                          color={transaction.type == "OUT"
                          ? 'error'
                          : transaction.type == "IN"
                          ? 'success'
                          : 'default'}
                          size="small"
                          label={formatNumber(
                            transaction.quantity,
                            "quantity_precise"
                          )}
                        ></Chip>
                      </Stack>
                      <Typography color="textSecondary" fontSize="12px" mb={2}>
                        {formatDate(transaction.date)}
                      </Typography>

                      <Grid container spacing={3} mb={3}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="500"
                            fontSize="13px"
                          >
                            Price
                          </Typography>
                          <Typography color="textSecondary" fontSize="12px">
                            {formatNumber(transaction.price, "currency")}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="500"
                            fontSize="13px"
                          >
                            Cost
                          </Typography>
                          <Typography color="textSecondary" fontSize="12px">
                            {formatNumber(transaction.cost, "currency")}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="500"
                            fontSize="13px"
                          >
                            Avg.Cost
                          </Typography>
                          <Typography color="textSecondary" fontSize="12px">
                            {formatNumber(transaction.average_cost, "currency")}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="500"
                            fontSize="13px"
                          >
                            Cap.Gain
                          </Typography>
                          <Typography color="textSecondary" fontSize="12px">
                            {formatNumber(transaction.capital_gain, "currency")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              <Stack
                sx={{ pl: 2, pr: 2 }}
                direction="row"
                justifyContent="space-between"
              >
                <Button variant="outlined" href="/dashboard/transactions">
                  See more
                </Button>
                <Typography>
                  {count} Transaction(s)
                </Typography>
              </Stack>
            </TabPanel>
            <TabPanel value="2">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Full Name
                  </Typography>
                  <Typography variant="subtitle2" fontSize="12px">
                    Johnathan Deo
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Mobile
                  </Typography>
                  <Typography variant="subtitle2" fontSize="12px">
                    (123) 456 7890
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Email
                  </Typography>
                  <Typography variant="subtitle2" fontSize="12px">
                    johnathan@admin.com
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    Location
                  </Typography>
                  <Typography variant="subtitle2" fontSize="12px">
                    London
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="subtitle2" fontSize="12px" mt={4}>
                Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                justo. Nullam dictum felis eu pede mollis pretium. Integer
                tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean
                vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
                consequat vitae, eleifend ac, enim.
              </Typography>
              <Typography variant="subtitle2" fontSize="12px" mt={2}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book. It
                has survived not only five centuries
              </Typography>
              <Typography variant="subtitle2" fontSize="12px" mt={2}>
                It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </Typography>

              <Typography variant="h6" mt={5} mb={4}>
                Skill set
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography variant="subtitle1" mb={1}>
                      Wordpress
                    </Typography>
                    <Typography variant="subtitle1">80%</Typography>
                  </Stack>
                  <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={80}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography variant="subtitle1" mb={1}>
                      React
                    </Typography>
                    <Typography variant="subtitle1">50%</Typography>
                  </Stack>
                  <LinearProgress
                    color="secondary"
                    variant="determinate"
                    value={50}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography variant="subtitle1" mb={1}>
                      VueJs
                    </Typography>
                    <Typography variant="subtitle1">45%</Typography>
                  </Stack>
                  <LinearProgress
                    color="error"
                    variant="determinate"
                    value={45}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography variant="subtitle1" mb={1}>
                      NextJs
                    </Typography>
                    <Typography variant="subtitle1">15%</Typography>
                  </Stack>
                  <LinearProgress
                    color="info"
                    variant="determinate"
                    value={15}
                  />
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel value="3">
              <form>
                <CustomFormLabel
                  sx={{
                    mt: 0,
                  }}
                  htmlFor="text-name"
                >
                  Name
                </CustomFormLabel>
                <CustomTextField id="text-name" variant="outlined" fullWidth />
                <CustomFormLabel htmlFor="text-email">Email</CustomFormLabel>
                <CustomTextField id="text-email" variant="outlined" fullWidth />
                <CustomFormLabel htmlFor="text-password">
                  Password
                </CustomFormLabel>
                <CustomTextField
                  id="text-password"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
                <CustomFormLabel htmlFor="text-address">
                  Address
                </CustomFormLabel>
                <CustomTextField
                  id="text-address"
                  variant="outlined"
                  fullWidth
                />
                <CustomFormLabel htmlFor="text-address">Select</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  id="standard-select-number"
                  variant="outlined"
                  value={1}
                  onChange={handleChange3}
                  sx={{
                    mb: 2,
                  }}
                >
                  <MenuItem value={1}>Option 1</MenuItem>
                  <MenuItem value={2}>Option 2</MenuItem>
                  <MenuItem value={3}>Option 3</MenuItem>
                </CustomSelect>

                <Button variant="contained" color="primary">
                  Submit
                </Button>
              </form>
            </TabPanel>
          </TabContext>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LastTransaction;
