"use client";

import { createWallet, State } from "../../lib/actions";
import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Add, Save } from "@mui/icons-material";

// Define the props for WalletWizard, including the onWalletCreated function
interface WalletWizardProps {
  onWalletCreated: (e: React.FormEvent) => Promise<void>;
}

const Form: React.FC<WalletWizardProps> = ({ onWalletCreated }) => {
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

    console.log("Form Data:", formData);

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
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          id="address"
          label="Address"
          variant="outlined"
          value={formData.address}
          onChange={handleInputChange}
          error={!!state.errors?.address}
          helperText={state.errors?.address?.[0]}
        />
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
          error={!!state.errors?.name}
          helperText={state.errors?.name?.[0]}
        />
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          value={formData.description}
          onChange={handleInputChange}
          error={!!state.errors?.description}
          helperText={state.errors?.description?.[0]}
        />
      </Stack>

      <Box mt={4} mb={1}>
        <Stack direction="row" spacing={2}>
          {/* <ButtonGroup variant="contained" aria-label="contained button group"> */}
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleSubmit}
          >
            Add
          </Button>
          <Button variant="contained" color="primary" startIcon={<Save />}>
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
export default Form;
