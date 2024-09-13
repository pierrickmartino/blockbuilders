import {
  Box,
  CardContent,
  CardMedia,
  Card,
  Typography,
  Stack,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip,
  Badge,
} from "@mui/material";
import { IconClock, IconMessageCircle2 } from "@tabler/icons-react";

const positions = [
  {
    img: "/images/users/1.jpg",
    title: "Bitcoin",
    subtext: "0.0234 BTC",
    status: "primary.main",
    percentage: "77.65%",
    amount: "$ 3,790.61",
  },
  {
    img: "/images/users/2.jpg",
    title: "Ethereum",
    subtext: "0.536 ETH",
    status: "secondary.main",
    percentage: "45.65%",
    amount: "$ 2,790.61",
  },
  {
    img: "/images/users/3.jpg",
    title: "Injective Protocol",
    subtext: "10.797 INJ",
    status: "error.main",
    percentage: "11.65%",
    amount: "$ 1,790.61",
  },
  {
    img: "/images/users/4.jpg",
    title: "Lido DAO Token",
    subtext: "103.326 LDO",
    status: "warning.main",
    percentage: "5.65%",
    amount: "$ 790.61",
  },
  {
    img: "/images/users/5.jpg",
    title: "USD Coin (PoS)",
    subtext: "3,786.828 USDC.e",
    status: "warning.main",
    percentage: "2.65%",
    amount: "$ 790.61",
  },
];

const Top5Positions = () => {
  return (
    <Card variant="outlined" sx={{ p: 0 }}>
        
      <Box
        px={3}
        py={2}
        mb="-15px"
      >
        <Typography variant="h5">Top 5 positions</Typography>
      </Box>
      <Box px={3} py={2} mt={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" spacing={2}>
            <Avatar src="/images/users/1.jpg" alt="user" />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">USD Coin (PoS)</Typography>
              <Typography color="subtitle1" fontSize="12px">
                3,786.828 USDC.e
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                        5 minutes ago
                      </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">$ 3,790.61</Typography>
            <Typography variant="subtitle1" fontSize="12px">
              77.65%
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
            <Avatar src="/images/users/1.jpg" alt="user" />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">USD Coin (PoS)</Typography>
              <Typography color="subtitle1" fontSize="12px">
                3,786.828 USDC.e
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                        5 minutes ago
                      </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">$ 3,790.61</Typography>
            <Typography variant="subtitle1" fontSize="12px">
              77.65%
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
            <Avatar src="/images/users/1.jpg" alt="user" />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">USD Coin (PoS)</Typography>
              <Typography color="subtitle1" fontSize="12px">
                3,786.828 USDC.e
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                        5 minutes ago
                      </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">$ 3,790.61</Typography>
            <Typography variant="subtitle1" fontSize="12px">
              77.65%
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
            <Avatar src="/images/users/1.jpg" alt="user" />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">USD Coin (PoS)</Typography>
              <Typography color="subtitle1" fontSize="12px">
                3,786.828 USDC.e
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                        5 minutes ago
                      </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">$ 3,790.61</Typography>
            <Typography variant="subtitle1" fontSize="12px">
              77.65%
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
            <Avatar src="/images/users/1.jpg" alt="user" />
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="h6" fontSize="14px">USD Coin (PoS)</Typography>
              <Typography color="subtitle1" fontSize="12px">
                3,786.828 USDC.e
              </Typography>
            </Stack>
          </Stack>

          {/* <Typography variant="subtitle1" fontSize="12px">
                        5 minutes ago
                      </Typography> */}
          <Stack direction="column" alignItems="flex-end" spacing={0}>
            <Typography variant="h6" fontSize="14px">$ 3,790.61</Typography>
            <Typography variant="subtitle1" fontSize="12px">
              77.65%
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default Top5Positions;
