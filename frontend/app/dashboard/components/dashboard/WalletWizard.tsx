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
    <Fragment>
      <Box px={3} py={2} bgcolor="primary.main" color="white">
        <Typography variant="h5">Add wallet</Typography>
        <Typography variant="subtitle1">Get started by filling in the information below to create your new wallet.</Typography>
      </Box>

      <CreateWalletForm />
    </Fragment>
  );
};

export default WalletWizard;
