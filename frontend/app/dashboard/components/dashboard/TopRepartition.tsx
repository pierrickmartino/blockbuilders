import React, { Fragment } from "react";

import {
  Card,
  Box,
  Stack,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { Blockchain, Position } from "@/app/lib/definition";
import TopPositions from "./TopPositions";
import TopPositionsGraph from "./TopPositionsGraph";
import TopBlockchainsGraph from "./TopBlockchainsGraph";
import TopBlockchains from "./TopBlockchains";

// Define the props type that will be passed into WalletTable
interface TopRepartitionProps {
  blockchains: Blockchain[];
  positions: Position[];
}

const TopRepartition: React.FC<TopRepartitionProps> = ({
  blockchains,
  positions,
}) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // select
  // const [number, setNumber] = React.useState("");

  // const handleChange3 = (event: any) => {
  //   setNumber(event.target.value);
  // };

  return (
    <Fragment>
      <Card variant="outlined" sx={{ p: 0 }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="fullWidth"
              >
                <Tab label="Positions" value="1" />
                <Tab label="Blockchain" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Stack
                direction="row"
                alignItems="center"
                spacing={0}
                justifyContent="space-between"
              >
                <TopPositionsGraph positions={positions}></TopPositionsGraph>
                <TopPositions positions={positions}></TopPositions>
              </Stack>
            </TabPanel>
            <TabPanel value="2">
              <Stack
                direction="row"
                alignItems="center"
                spacing={0}
                justifyContent="space-between"
              >
                <TopBlockchainsGraph
                  blockchains={blockchains}
                ></TopBlockchainsGraph>
                <TopBlockchains blockchains={blockchains}></TopBlockchains>
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </Fragment>
  );
};

export default TopRepartition;
