import { Box } from "@mui/material";

interface AuthErrorsProps {
  message: string | null;
  name: string;
  status: string | null;
}

export function AuthErrors({ error }: { readonly error: AuthErrorsProps }) {
  if (!error?.message) return null;
  return (
    <Box
      sx={{
        color: "error.main",
        fontSize: "0.75rem",
        fontStyle: "italic",
      }}
    >
      {error.message}
    </Box>
  );
}
