import { Button } from "@/components/Button";
// import { Wallet } from "@/data/wallet/schema"
import { Transaction } from "@/lib/definition";
import { capitalizeFirstLetter, formatNumber } from "@/lib/format";
import { Ellipsis } from "lucide-react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/Badge";

const columnHelper = createColumnHelper<Transaction>();
const isZero = (n: number | null | undefined) => Number(n) === 0;

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Transaction>) => void }) =>
  [
    columnHelper.accessor("position.contract.symbol", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Position",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{row.original.position.contract.symbol}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">{row.original.against_contract?.symbol}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Name",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        const label =
          row.original.status == "close" || row.original.status == "open"
            ? capitalizeFirstLetter(row.original.status)
            : formatNumber(row.original.status_value, "percentage");
        const sign = row.original.status == "diminution" ? "-" : row.original.status == "increase" ? "+" : "";
        const color =
          row.original.status == "close" || row.original.status == "diminution"
            ? "error"
            : row.original.status == "open" || row.original.status == "increase"
            ? "success"
            : "neutral";

        return (
          <span>
            <Badge variant={color}>{sign + " " + label}</Badge>
          </span>
        );
      },
    }),

    columnHelper.accessor("quantity", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Quantity",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{formatNumber(row.original.quantity, "quantity_precise")}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">
              / {formatNumber(row.original.running_quantity, "quantity_precise")}
            </span>
          </div>
        );
      },
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
        return <span className="tabular-nums">{formatNumber(getValue() as number, "currency")}</span>;
      },
    }),

    columnHelper.accessor("cost", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cost" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Cost",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{formatNumber(row.original.cost, "currency")}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">
              / {formatNumber(row.original.total_cost, "currency")}
            </span>
          </div>
        );
      },
    }),

    columnHelper.accessor("average_cost", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Average Cost" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Average Cost",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span className="tabular-nums">{formatNumber(getValue() as number, "currency")}</span>;
      },
    }),

    columnHelper.accessor("capital_gain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Capital Gain" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Capital Gain",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        if (isZero(getValue() as number)) {
          return <span className="tabular-nums">-</span>;
        }
        else {
          return <span className="tabular-nums">{formatNumber(getValue() as number, "currency")}</span>;
        }
      },
    }),

    columnHelper.accessor("date", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Date",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span className="tabular-nums">{formatDistanceToNow(new Date(getValue()), { addSuffix: true })}</span>;
      },
    }),

    columnHelper.display({
      id: "edit",
      header: "Edit",
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: "text-right",
        displayName: "Edit",
      },
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => onEditClick?.(row)}
            className="group aspect-square p-1.5 hover:border hover:border-gray-300 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
          >
            <Ellipsis
              className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700 group-hover:dark:text-gray-300 group-data-[state=open]:dark:text-gray-300"
              aria-hidden="true"
            />
          </Button>
        );
      },
    }),
  ] as ColumnDef<Transaction>[];
