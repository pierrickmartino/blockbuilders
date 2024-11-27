import { Box } from "@mui/material";

export function ZodErrors({ error }: { error: string[] }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <Box
      key={index}
      sx={{
        color: "error.main",
        fontSize: "0.75rem",
        fontStyle: "italic",
      }}
    >
      {err}
    </Box>
  ));
}
