import { Box } from "@mui/material";

export function ZodErrors({ error }: { error: string[] }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <Box
      key={index}
      sx={{
        color: "rgba(185, 28, 28, 1)",
        fontSize: "0.75rem",
        fontStyle: "italic",
      }}
    >
      {err}
    </Box>
  ));
}
