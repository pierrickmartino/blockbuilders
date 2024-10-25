import {
  IconBoxMultiple, IconCircleDot, IconFile, IconHome, IconInfoCircle, IconLayout, IconLayoutGrid, IconPhoto, IconPoint, IconStar, IconTable, IconTimeline, IconUser
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/dashboard/wallets",
  },
  {
    id: uniqueId(),
    title: "Positions",
    icon: IconTable,
    href: "/dashboard/positions",
  },
  {
    id: uniqueId(),
    title: "Transactions",
    icon: IconTimeline,
    href: "/dashboard/transactions",
  },
  {
    id: uniqueId(),
    title: "Contracts",
    icon: IconFile,
    href: "/dashboard/contracts",
  },

  {
    id: uniqueId(),
    title: "Buttons",
    icon: IconCircleDot,
    href: "/dashboard/ui-components/buttons",
  },
  {
    id: uniqueId(),
    title: "Forms",
    icon: IconTable,
    href: "/dashboard/ui-components/forms",
  },
  {
    id: uniqueId(),
    title: "Alerts",
    icon: IconInfoCircle,
    href: "/dashboard/ui-components/alerts",
  },
  {
    id: uniqueId(),
    title: "Ratings",
    icon: IconStar,
    href: "/dashboard/ui-components/ratings",
  },
  {
    id: uniqueId(),
    title: "Images",
    icon: IconPhoto,
    href: "/dashboard/ui-components/images",
  },
  {
    id: uniqueId(),
    title: "Pagination",
    icon: IconUser,
    href: "/dashboard/ui-components/pagination",
  },
];

export default Menuitems;
