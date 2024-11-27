import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Stack } from "@mui/material";
import NavItem from "./NavItem";

interface SidebarItemsProps {
  toggleMobileSidebar: () => void; // Define type as a function that returns void
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Stack spacing={1} direction="row">
      {Menuitems.map((item) => {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
          );
        })}
    </Stack>
  );
};
export default SidebarItems;
