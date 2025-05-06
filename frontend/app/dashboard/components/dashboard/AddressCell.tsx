// AddressCell.tsx
import React from "react";
import { Tooltip, IconButton, Typography, Box } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: "inherit", fontFamily: "monospace" }}
        >
          {truncate(address)}
        </Typography>

        {/* <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="Copy address"
        >
          <ContentCopyIcon fontSize="inherit" />
        </IconButton> */}
      </Box>
    </Tooltip>
  );
};

export default AddressCell;
