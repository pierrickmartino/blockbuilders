"use client";

import React, { Fragment, useState } from "react";
// import { useTheme } from "@mui/material/styles";
import {
  Box,
  Menu,
  Avatar,
  Divider,
  IconButton,
  ListItemButton,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
// import useSWR from "swr";
// import { fetcher } from "@/app/lib/fetcher";
import { AuthActions } from "@/app/(auth)/utils";
import { Button } from "@/components/shared/Button";

// import { Stack } from "@mui/system";
// import {
//   IconChevronDown,
//   IconCreditCard,
//   IconCurrencyDollar,
//   IconMail,
//   IconShield,
// } from "@tabler/icons-react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const router = useRouter();
  // const { data: user } = useSWR("/api/auth/users/me", fetcher);

  const { logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();
        router.push("/signin");
      })
      .catch(() => {
        removeTokens();
        router.push("/signin");
      });
  };

  // const theme = useTheme();
  // const primary = theme.palette.primary.main;
  // const primarylight = theme.palette.primary.light;
  // const error = theme.palette.error.main;
  // const errorlight = theme.palette.error.light;
  // const success = theme.palette.success.main;
  // const successlight = theme.palette.success.light;
  return (
    <Box>
      <IconButton
        size="small"
        aria-label="menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            borderRadius: "9px",
          }),
          padding: "0px",
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/users/user2.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 2,
            pb: 2,
            pt:0
          },
        }}
      >
        
        {/* <Fragment>
          <Box mb={2}>
            <Typography>{user?.email}</Typography>
          </Box>
          <Divider />
        </Fragment> */}
        
        <Box pt={0}>

          <List>
            <ListItemButton component="a" href="#">
              <ListItemText primary="My Profile" />
            </ListItemButton>
            {/* <ListItemButton component="a" href="#">
              <ListItemText primary="My Account" />
            </ListItemButton> */}
            <ListItemButton component="a" href="#">
              <ListItemText primary="Change Password" />
            </ListItemButton>
            {/* <ListItemButton component="a" href="#">
              <ListItemText primary="My Task" />
            </ListItemButton> */}
          </List>

        </Box>
        <Divider />
        <Box mt={2}>
          <Button variant="primary" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

      </Menu>
    </Box>
  );
};

export default Profile;
