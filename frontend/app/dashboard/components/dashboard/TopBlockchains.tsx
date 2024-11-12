import { Blockchain } from "@/app/lib/definition";
import { Box, Typography, Stack, Avatar, Skeleton } from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";

// Define the props type that will be passed into WalletTable
interface TopBlockchainsProps {
  blockchains: Blockchain[];
}

const TopBlockchains: React.FC<TopBlockchainsProps> = ({ blockchains }) => {
  return blockchains.length > 0 ? (
    <Box px={2} width="60%" height="240px">
      {blockchains.map((blockchain: Blockchain) => (
        <Stack
          key={blockchain.id}
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          mb={2}
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

          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">
              {formatNumber(blockchain.balance, "currency")}
            </Typography>
            <Typography color="textSecondary" fontSize="12px">
              {formatNumber(blockchain.progress_percentage, "percentage")}
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

export default TopBlockchains;
