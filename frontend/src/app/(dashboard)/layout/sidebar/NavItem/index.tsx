import React from "react";
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";

type NavGroup = {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  external?: boolean;
  disabled?: boolean;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: () => void;
  level?: number;
  pathDirect: string;
}

const NavItem = ({ item, level = 0, pathDirect, onClick }: ItemType) => {
  const Icon = item.icon;
  const theme = useTheme();

  const itemIcon = Icon ? <Icon stroke={1.5} fontSize="small" /> : null;

  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      // marginBottom: "8px",
      // padding: "6px 6px",
      paddingTop: "0.25rem",
      paddingBottom: "0.25rem",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      borderRadius: "0.375rem",
      // fontSize: "0.8125rem",
      lineHeigt: "1.25rem",
      // fontWeight: 500,
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.secondary.contrastText,
      // paddingLeft: "10px",
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.primary.contrastText,
      },
      "&.Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.dark,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        },
      },
    },
  }));

  return (
    <List component="div" disablePadding key={item.id}>
      <ListItemStyled>
        <ListItemButton
          component={Link}
          href={item.href || "#"}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          target={item.external ? "_blank" : ""}
          onClick={onClick}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: "36px",
                p: "3px 0",
                color: "inherit",
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          <ListItemText>
            <>{item.title}</>
          </ListItemText>
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
