import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
    
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "rgba(250,250,250,1)",
      }}
    >
      {children}
    </Box>
  );
}
