import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";

import {
  AdjustRounded,
  AppsRounded,
  ArrowRightRounded,
  ReceiptLongRounded,
  TimelineRounded,
} from "@mui/icons-material";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, href: "/dashboard" },
  {
    text: "Positions",
    icon: <AnalyticsRoundedIcon />,
    href: "/dashboard/positions",
  },
  {
    text: "Transactions",
    icon: <ReceiptLongRounded />,
    href: "/dashboard/transactions",
  },
  {
    text: "Contracts",
    icon: <TimelineRounded />,
    href: "/dashboard/contracts",
  },
  {
    text: "Buttons",
    icon: <AppsRounded />,
    href: "/dashboard/ui-components/buttons",
  },
  {
    text: "Forms",
    icon: <AdjustRounded />,
    href: "/dashboard/ui-components/forms",
  },
  {
    text: "Alerts",
    icon: <ArrowRightRounded />,
    href: "/dashboard/ui-components/alerts",
  },
];
export default mainListItems;
