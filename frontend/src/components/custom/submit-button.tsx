"use client";

import { Button, CircularProgress } from "@mui/material";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      startIcon={
        status.pending || loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : null
      }
    >
      {status.pending || loading ? loadingText : text}
    </Button>
  );
}
