import { Blockchain } from "@/lib/definition";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import { formatNumber } from "@/lib/format";

// Define the props type that will be passed into WalletTable
interface TopBlockchainsProps {
  blockchains: Blockchain[];
}

const TopBlockchains: React.FC<TopBlockchainsProps> = ({ blockchains }) => {
  return blockchains.length > 0 ? (
    <Box>
      {blockchains.map((blockchain: Blockchain) => (
        <Stack
          key={blockchain.id}
          direction="column"
          justifyContent="space-between"
          spacing={0}
          mb={2}
        >
          <LinearProgress
            color="secondary"
            variant="determinate"
            value={blockchain.progress_percentage}
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="space-between"
            mt={1}
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
                <Typography color="textSecondary" fontSize="12px">
                {"-"}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="column" alignItems="flex-end" spacing={0}>
              <Typography variant="h6" fontSize="14px">
                {formatNumber(blockchain.balance, "currency")}
              </Typography>
              <Typography color="textSecondary" fontSize="12px">
                {formatNumber(blockchain.progress_percentage, "percentage")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Box>
  ) : (
    <Box>
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

export default TopBlockchains;
