import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { AdjustRounded, AppsRounded, ArrowRightRounded, ReceiptLongRounded, TimelineRounded } from '@mui/icons-material';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, href: "/dashboard" },
  { text: 'Positions', icon: <AnalyticsRoundedIcon />, href: "/dashboard/positions" },
  { text: 'Transactions', icon: <ReceiptLongRounded />, href: "/dashboard/transactions" },
  { text: 'Contracts', icon: <TimelineRounded />, href: "/dashboard/contracts" },
  { text: 'Buttons', icon: <AppsRounded />, href: "/dashboard/ui-components/buttons" },
  { text: 'Forms', icon: <AdjustRounded />, href: "/dashboard/ui-components/forms"  },
  { text: 'Alerts', icon: <ArrowRightRounded />, href: "/dashboard/ui-components/alerts" },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0} href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}