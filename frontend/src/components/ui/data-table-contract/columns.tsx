import { Badge1 } from "@/components/BadgeCustom";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
// import { Wallet } from "@/data/wallet/schema"
import { Contract } from "@/lib/definition";
import { formatNumber } from "@/lib/format";
import { Ellipsis } from "lucide-react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";

const isZero = (n: number | null | undefined) => Number(n) === 0;
const truncate = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

function renderChipAmount(amount: number, type: "currency" | "quantity_precise" | "quantity" | "percentage") {
  return (
    <>
      {isZero(amount) ? (
        <Heading variant="body2">—{/* em-dash improves readability */}</Heading>
      ) : (
        <Badge1 label={formatNumber(amount, type)} color={amount < 0 ? "error" : amount > 0 ? "success" : "neutral"} />
      )}
    </>
  );
}

const columnHelper = createColumnHelper<Contract>();

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Contract>) => void }) =>
  [
    columnHelper.accessor("blockchain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Blockchain" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Blockchain",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span>{getValue().name}</span>;
      },
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Name",
      },
      filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("symbol", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Symbol" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Symbol",
      },
      filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("address", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Address",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span>{truncate(getValue())}</span>;
      },
    }),
    columnHelper.accessor("category", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Category",
      },
      filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Price",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span>{formatNumber(getValue(), "currency")}</span>;
      },
    }),
  ] as ColumnDef<Contract>[];
