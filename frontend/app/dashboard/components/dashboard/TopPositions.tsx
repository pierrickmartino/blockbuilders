import { Position } from "@/app/lib/definition";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";

// Define the props type that will be passed into WalletTable
interface TopPositionsProps {
  positions: Position[];
}

const TopPositions: React.FC<TopPositionsProps> = ({ positions }) => {
  return positions.length > 0 ? (
    <Box px={2} width="50%" height="240px">
      {positions.map((position: Position) => (
        <Stack
          key={position.id}
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          mb={2}
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
              <Typography color="textSecondary" fontSize="12px">
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
            <Typography color="textSecondary" fontSize="12px">
              {formatNumber(position.progress_percentage, "percentage")}
            </Typography>
          </Stack>


        </Stack>
      ))}
    </Box>
  ) : (
    <Box px={2} width="50%">
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={24} height={24} />
          <Stack direction="column" alignItems="flex-start" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              <Skeleton width={200} />
            </Typography>
            <Typography color="subtitle1" fontSize="12px">
              <Skeleton width={200} />
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="flex-end" spacing={0}>
          <Typography variant="h6" fontSize="14px">
            <Skeleton width={50} />
          </Typography>
          <Typography variant="subtitle1" fontSize="12px">
            <Skeleton width={50} />
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={24} height={24} />
          <Stack direction="column" alignItems="flex-start" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              <Skeleton width={200} />
            </Typography>
            <Typography color="subtitle1" fontSize="12px">
              <Skeleton width={200} />
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="flex-end" spacing={0}>
          <Typography variant="h6" fontSize="14px">
            <Skeleton width={50} />
          </Typography>
          <Typography variant="subtitle1" fontSize="12px">
            <Skeleton width={50} />
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={24} height={24} />
          <Stack direction="column" alignItems="flex-start" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              <Skeleton width={200} />
            </Typography>
            <Typography color="subtitle1" fontSize="12px">
              <Skeleton width={200} />
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="flex-end" spacing={0}>
          <Typography variant="h6" fontSize="14px">
            <Skeleton width={50} />
          </Typography>
          <Typography variant="subtitle1" fontSize="12px">
            <Skeleton width={50} />
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={24} height={24} />
          <Stack direction="column" alignItems="flex-start" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              <Skeleton width={200} />
            </Typography>
            <Typography color="subtitle1" fontSize="12px">
              <Skeleton width={200} />
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="flex-end" spacing={0}>
          <Typography variant="h6" fontSize="14px">
            <Skeleton width={50} />
          </Typography>
          <Typography variant="subtitle1" fontSize="12px">
            <Skeleton width={50} />
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TopPositions;
