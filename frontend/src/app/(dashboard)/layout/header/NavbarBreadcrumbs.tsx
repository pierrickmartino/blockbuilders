import * as React from "react";
import Link from "@mui/material/Link";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRounded from "@mui/icons-material/NavigateNextRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import { styled } from "@mui/material/styles";

/* ─────────── Router hook (Next-13 App Router) ─────────── */
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Heading } from "@/components/Heading";
const usePath = () => usePathname();
const LinkComponent = NextLink;
/* -------------------------------------------------------- */

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
  /** Optional friendly names for IDs in the URL */
  walletName?: string;
  positionName?: string;
};

export default function NavbarBreadcrumbs({ walletName, positionName }: Props) {
  /* 1. Current path split into segments */
  const fullPath = usePath(); // e.g. "/dashboard/wallets/abc/positions/xyz/transactions"
  const parts = fullPath.split("/").filter(Boolean); // -> ["dashboard","wallets",...]

  /* 2. Build custom breadcrumb list */
  interface Crumb {
    label: string;
    href: string;
  }
  const crumbs: Crumb[] = [];

  /* Always start with Dashboard */
  let href = "/overview";
  crumbs.push({ label: "Dashboard", href });

  /* Pattern-specific parsing */
  if (parts[1] === "wallets" && parts[2]) {
    const id = parts[2];
    href += `/wallets/${id}/positions`;

    const label = walletName ?? `Wallet ${id.slice(0, 4)}…${id.slice(-2)}`; // fallback if no name
    crumbs.push({ label, href });

    /* /positions or /positions/:id */
    if (parts[3] === "positions") {
      if (parts[4]) {
        const posId = parts[4];
        href += `/${posId}/transactions`;
        const posLabel = positionName ?? `Position ${posId.slice(0, 4)}…${posId.slice(-2)}`;
        crumbs.push({ label: posLabel, href });

        /* /transactions */
        if (parts[5] === "transactions") {
          crumbs.push({ label: "Transactions", href });
        }
      } else {
        crumbs.push({ label: "Position", href }); // list page
      }
    }
  }

  /* 3. Render */
  const lastIndex = crumbs.length - 1;

  return (
    <Crumbs aria-label="breadcrumb" separator={<NavigateNextRounded fontSize="small" />}>
      {/* Home icon + Dashboard link */}
      <Link
        component={LinkComponent}
        href="/overview"
        underline="none"
        sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}
      >
        <HomeRounded fontSize="small" sx={{ mr: 0.5 }} />
        Dashboard
      </Link>

      {crumbs.slice(1).map((c, idx) =>
        idx === lastIndex ? (
          <Heading key={c.href} variant="body">
            {c.label}
          </Heading>
        ) : (
          <Link key={c.href} component={LinkComponent} href={c.href} underline="hover" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {c.label}
          </Link>
        )
      )}
    </Crumbs>
  );
}
