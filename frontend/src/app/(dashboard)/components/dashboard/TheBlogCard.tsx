import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Box, CardMedia, Stack, Avatar, IconButton } from "@mui/material";
import { IconClock, IconMessageCircle2 } from "@tabler/icons-react";
import { Fragment } from "react";

const BlogCard = () => {
  return (
    <Card>
      <CardMedia sx={{ height: 220 }} image="/images/backgrounds/u5.jpg" title="green iguana" />
      <Fragment>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <IconClock width={20} />
          <Heading variant="h6">22 March, 2023</Heading>
        </Stack>
        <Heading variant="h5">Super awesome, Vue 3 is there, Lets do this!</Heading>
        <Stack direction="row" spacing={1} mt={2}>
          <Box bgcolor="primary.light" color="primary.main" fontSize="12px" px={1} py="3px">
            Medium
          </Box>
          <Box bgcolor="error.light" color="error.main" fontSize="12px" px={1} py="3px">
            Low
          </Box>
        </Stack>
        <Stack direction="row" mt={4} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Avatar alt="Remy Sharp" src="/images/users/1.jpg" />
            <Avatar alt="Travis Howard" src="/images/users/2.jpg" />
            <Avatar alt="Cindy Baker" src="/images/users/3.jpg" />
          </Stack>
          <IconButton>
            <IconMessageCircle2 width={20} />
          </IconButton>
        </Stack>
      </Fragment>
    </Card>
  );
};

export default BlogCard;
