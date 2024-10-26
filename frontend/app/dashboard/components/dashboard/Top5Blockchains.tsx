import { Blockchain } from "@/app/lib/definition";
import { Box, Card, Typography, Stack, Avatar } from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";

// Define the props type that will be passed into WalletTable
interface Top5BlockchainsProps {
  blockchains: Blockchain[];
}

const Top5Blockchains: React.FC<Top5BlockchainsProps> = ({ blockchains }) => {
  return (
    <Box px={2} width="60%">
      {blockchains.map((blockchain: Blockchain) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" spacing={2}>
            <Avatar
              alt={blockchain.name}
              sx={{ width: 24, height: 24 }}
              src={"/images/logos/" + blockchain.icon}
            />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">
                {blockchain.name}
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                      5 minutes ago
                    </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              {formatNumber(blockchain.balance, "currency")}
            </Typography>
            <Typography variant="subtitle1" fontSize="12px">
              {formatNumber(blockchain.progress_percentage, "percentage")}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
};

export default Top5Blockchains;
