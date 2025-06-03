// AddressCell.tsx
import React from "react";
import { Tooltip, Box } from "@mui/material";
import { Heading } from "@/components/Heading";

type Props = { address: string };

const truncate = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

const AddressCell: React.FC<Props> = ({ address }) => {
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // don’t trigger row click
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      /* optional: enqueueSnackbar("Copy failed", { variant: "error" }) */
    }
  };

  return (
    <Tooltip title={address} arrow>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Heading variant="body2">{truncate(address)}</Heading>
      </Box>
    </Tooltip>
  );
};

export default AddressCell;
