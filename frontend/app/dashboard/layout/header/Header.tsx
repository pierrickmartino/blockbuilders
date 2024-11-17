import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton,
  // , Badge, Button, 
  FormControlLabel, FormGroup, Switch, 
  Button} from '@mui/material';
import PropTypes from 'prop-types';
import Logo from "../shared/logo/Logo";
// components
import Profile from './Profile';
import Search from './Search';
import { IconMenu2 } from '@tabler/icons-react';
import SidebarItems from '../sidebar/SidebarItems';
// import Switch, { SwitchProps } from '@mui/material/Switch';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
  mode: "light" | "dark";
  onThemeChange: () => void;
}

const Header = ({ toggleMobileSidebar, mode, onThemeChange }: ItemType) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    // boxShadow:
    //   "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;",
    background: theme.palette.primary.main,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    height: '50px',
    [theme.breakpoints.up('lg')]: {
      minHeight: '50px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    height: '50px',
  }));

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#aab4be',
          // ...theme.applyStyles('dark', {
          //   backgroundColor: '#8796A5',
          // }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      // ...theme.applyStyles('dark', {
      //   backgroundColor: '#003892',
      // }),
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
      // ...theme.applyStyles('dark', {
      //   backgroundColor: '#8796A5',
      // }),
    },
  }));

  const handleToggleSidebar = () => {
    // logic to toggle the sidebar
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>

        {/* ------------------------------------------- */}
        {/* Logo */}
        {/* ------------------------------------------- */}
        {/* <Box sx={{
            width: '256px',
          }}>
          <Logo />
        </Box> */}

        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            color:'#fff',
            display: {
              lg: "flex",
              xs: "flex",
            },
          }}
        >
          {/* <IconMenu2 width="22" height="22" /> */}
        </IconButton>
        <Box><SidebarItems toggleMobileSidebar={handleToggleSidebar} /></Box>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
        <Search />
          <FormGroup>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  checked={mode === "dark"}
                  onChange={onThemeChange} />}
              label=""
            />
          </FormGroup>
          <Button href="/signin" variant="outlined" sx={{marginBottom:'5px', color:"#ffffff" }} size='small'>
                Sign In
              </Button>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
