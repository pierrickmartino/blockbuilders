import { Position } from "@/app/lib/definition";
import { Box, Card, Typography, Stack, Avatar } from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";

// Define the props type that will be passed into WalletTable
interface Top5PositionsProps {
  positions: Position[];
}

const Top5Positions: React.FC<Top5PositionsProps> = ({ positions }) => {
  return (
    <Box px={2} width="60%">
      {positions.map((position: Position) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" spacing={2}>
            <Avatar
              alt={position.contract.blockchain.name}
              sx={{ width: 24, height: 24 }}
              src={"/images/logos/" + position.contract.blockchain.icon}
            />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">
                {position.contract.name}
              </Typography>
              <Typography color="subtitle1" fontSize="12px">
                {formatNumber(position.quantity, "quantity_precise")}{" "}
                {position.contract.symbol}
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                      5 minutes ago
                    </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              {formatNumber(position.amount, "currency")}
            </Typography>
            <Typography variant="subtitle1" fontSize="12px">
              {formatNumber(position.progress_percentage, "percentage")}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
};

export default Top5Positions;
