import { Metadata } from "next";
import CreateWalletForm from "../../../ui/wallets/CreateWalletForm";
import { Box, Card, Typography } from "@mui/material";

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
    <Card variant="outlined" sx={{ p: 0 }}>
      <Box px={3} py={2} mb="-15px">
        <Typography variant="h5">Form</Typography>
      </Box>
      <Box px={3} py={2} mt={1}>
        <CreateWalletForm onWalletCreated={handleSubmit} />
      </Box>
    </Card>
  );
};

export default WalletWizard;
