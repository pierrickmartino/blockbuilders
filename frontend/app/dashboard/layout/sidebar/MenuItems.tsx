import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    // icon: IconHome,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Positions",
    // icon: IconTable,
    href: "/dashboard/positions",
  },
  {
    id: uniqueId(),
    title: "Transactions",
    // icon: IconTimeline,
    href: "/dashboard/transactions",
  },
  {
    id: uniqueId(),
    title: "Contracts",
    // icon: IconFile,
    href: "/dashboard/contracts",
  },

  {
    id: uniqueId(),
    title: "Buttons",
    // icon: IconCircleDot,
    href: "/dashboard/ui-components/buttons",
  },
  {
    id: uniqueId(),
    title: "Forms",
    // icon: IconTable,
    href: "/dashboard/ui-components/forms",
  },
  {
    id: uniqueId(),
    title: "Alerts",
    // icon: IconInfoCircle,
    href: "/dashboard/ui-components/alerts",
  },
];

export default Menuitems;
