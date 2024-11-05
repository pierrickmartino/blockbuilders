import { Metadata } from "next";
import CreateWalletForm from "../../../ui/wallets/CreateWalletForm";
import { Box, Typography } from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Create Wallet",
};

// Define the props for WalletWizard, including the onWalletCreated function
interface WalletWizardProps {
  onWalletCreated: () => void;
}

const WalletWizard: React.FC<WalletWizardProps> = ({ onWalletCreated }) => {
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onWalletCreated();
  };

  return (
    <DashboardCard isNarrow={true}>
      <Fragment>
        <Box px={3} py={2} mb="-15px">
          <Typography variant="h5">Form</Typography>
        </Box>
        <Box px={3} py={2} mt={1}>
          <CreateWalletForm onWalletCreated={handleSubmit} />
        </Box>
      </Fragment>
    </DashboardCard>
  );
};

export default WalletWizard;
