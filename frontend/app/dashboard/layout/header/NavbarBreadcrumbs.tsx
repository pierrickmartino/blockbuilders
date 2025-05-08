import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRounded from "@mui/icons-material/NavigateNextRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import { styled } from "@mui/material/styles";

/* ─────────────────────────────────────────────────────────
   1.  Choose the router hook that matches your stack
   ───────────────────────────────────────────────────────── */
/*  A.  React-Router v6
import { useLocation, Link as RouterLink } from "react-router-dom";
const usePath = () => useLocation().pathname;
const LinkComponent = RouterLink;
*/

/*  B.  Next.js 13 App Router */
import { usePathname } from "next/navigation";
import NextLink from "next/link";
const usePath = () => usePathname();
const LinkComponent = NextLink;
/* ———————————————————————————————————————————————— */

const Crumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 1.5),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.text.disabled,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

type Props = {
  /** When `true`, middle crumbs collapse to “…” if depth > max */
  collapse?: boolean;
  maxItems?: number; // depth before collapsing, default 4
};

export default function NavbarBreadcrumbs({
  collapse = true,
  maxItems = 4,
}: Props) {
  /* 2.  Derive path segments */
  const fullPath = usePath(); // e.g. "/dashboard/wallets/0x123/positions"
  const segments = fullPath
    .split("/")
    .filter(Boolean); // -> ["dashboard","wallets","0x123","positions"]

  /* 3.  Helper to prettify labels */
  const format = (segment: string) => {
    if (segment.match(/^0x[a-fA-F0-9]{4,}$/)) return `${segment.slice(0, 6)}…`; // truncate addresses
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // "total-gain" → "Total Gain"
  };

  /* 4.  Optionally collapse middle crumbs */
  const shouldCollapse = collapse && segments.length > maxItems;
  const displayed = shouldCollapse
    ? [
        segments[0],
        "…", // placeholder
        ...segments.slice(segments.length - (maxItems - 1)),
      ]
    : segments;

  /* 5.  Build cumulative href for each link */
  let hrefBuilder = "";
  const items = displayed.map((seg) => {
    hrefBuilder += `/${seg}`;
    return { label: seg, href: hrefBuilder };
  });

  /* 6.  Render */
  return (
    <Crumbs separator={<NavigateNextRounded fontSize="small" />} aria-label="breadcrumb">
      {/* Home / first crumb */}
      {/* <Link
        component={LinkComponent}
        href="/"
        underline="none"
        sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}
      >
        <HomeRounded fontSize="small" sx={{ mr: 0.5 }} />
        Dashboard
      </Link> */}

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        if (item.label === "…") {
          return (
            <Typography key="ellipsis" color="text.disabled">
              …
            </Typography>
          );
        }
        const content = format(item.label);
        return isLast ? (
          <Typography
            key={item.href}
            color="text.primary"
            fontWeight={600}
            whiteSpace="nowrap"
          >
            {content}
          </Typography>
        ) : (
          <Link
            key={item.href}
            component={LinkComponent}
            href={item.href}
            underline="hover"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap" }}
          >
            {content}
          </Link>
        );
      })}
    </Crumbs>
  );
}