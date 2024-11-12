"use client";

import { createWallet, State } from "../../lib/actions";
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Save } from "@mui/icons-material";

// Define the props for WalletWizard, including the onWalletCreated function
interface WalletWizardProps {
  onWalletCreated: (e: React.FormEvent) => Promise<void>;
}

const CreateWalletForm: React.FC<WalletWizardProps> = ({ onWalletCreated }) => {
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    description: "",
  });
  const [state, setState] = useState<State>({ message: null, errors: {} });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log("Form Data:", formData);

    // Directly pass formData as JSON instead of FormData
    const result = await createWallet(state, formData);
    // Reset form after POST
    setFormData({ address: "", name: "", description: "" });

    // Handle the response
    if (result.errors) {
      setState((prev) => ({ ...prev, errors: result.errors }));
    } else {
      onWalletCreated(e); // Trigger the wallet refresh in the parent component
      setState((prev) => ({ ...prev, message: result.message }));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ height: "auto" }}
    >
      <Stack direction="column" justifyContent={"space-between"}>
        <Box px={3} py={3}>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h6">Wallet address</Typography>
              <TextField
                id="address"
                // label="Address"
                variant="outlined"
                value={formData.address}
                onChange={handleInputChange}
                error={!!state.errors?.address}
                helperText={state.errors?.address?.[0]}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="h6">Wallet name</Typography>
              <TextField
                id="name"
                // label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                error={!!state.errors?.name}
                helperText={state.errors?.name?.[0]}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="h6">Wallet description</Typography>
              <TextField
                id="description"
                // label="Description"
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                error={!!state.errors?.description}
                helperText={state.errors?.description?.[0]}
              />
            </Stack>
          </Stack>
        </Box>
        <Stack>
          <Divider />
          <Box px={3} py={2}>
            <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
              <Button size="small" variant="outlined" color="primary">
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
export default CreateWalletForm;
