import React from "react";

import { Box, Card, CardContent, Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { Blockchain, Position } from "@/lib/definition";
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
    <Card variant="outlined" sx={{ px: 0, py: 1, height: "100%", flexGrow: 1 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%", typography: "body1", padding: "-24px" }}>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
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
      </CardContent>
    </Card>
  );
};

export default TopRepartition;
