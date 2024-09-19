import { Metadata } from 'next';
// import Breadcrumbs from '../../../ui/wallets/breadcrumbs';
import Form from '../../../ui/wallets/create-form';
import {
  Box,
  Card,
  Typography,
} from "@mui/material";

export const metadata: Metadata = {
  title: 'Create Wallet',
};


const WalletWizard = () => {
  return (
  <Card variant="outlined" sx={{ p: 0 }}>
        
    <Box
      px={3}
      py={2}
      mb="-15px"
    >
      <Typography variant="h5">Form</Typography>
    </Box>
    <Box px={3} py={2} mt={1}>
      
    <Form />
      
    </Box>
  </Card>
);
};

export default WalletWizard;

