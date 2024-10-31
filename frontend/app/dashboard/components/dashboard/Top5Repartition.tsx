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
import Top5Positions from "./Top5Positions";
import Top5PositionsGraph from "./Top5PositionsGraph";
import Top5BlockchainsGraph from "./Top5BlockchainsGraph";
import Top5Blockchains from "./Top5Blockchains";

// Define the props type that will be passed into WalletTable
interface Top5RepartitionProps {
  blockchains: Blockchain[];
  positions: Position[];
}

const Top5Repartition: React.FC<Top5RepartitionProps> = ({
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
                <Top5PositionsGraph positions={positions}></Top5PositionsGraph>
                <Top5Positions positions={positions}></Top5Positions>
              </Stack>
            </TabPanel>
            <TabPanel value="2">
              <Stack
                direction="row"
                alignItems="center"
                spacing={0}
                justifyContent="space-between"
              >
                <Top5BlockchainsGraph
                  blockchains={blockchains}
                ></Top5BlockchainsGraph>
                <Top5Blockchains blockchains={blockchains}></Top5Blockchains>
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </Fragment>
  );
};

export default Top5Repartition;
