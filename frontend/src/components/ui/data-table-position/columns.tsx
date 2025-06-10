import { Button } from "@/components/Button";
// import { Wallet } from "@/data/wallet/schema"
import { Position } from "@/lib/definition";
import { capitalizeFirstLetter, formatNumber } from "@/lib/format";
import { Ellipsis } from "lucide-react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";

const columnHelper = createColumnHelper<Position>();
const isZero = (n: number | null | undefined) => Number(n) === 0;
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Position>) => void }) =>
  [
    columnHelper.accessor("contract.symbol", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Token" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Token",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{truncateText(row.original.contract.symbol, 8)}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">{truncateText(row.original.contract.name, 22)}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor("contract.price", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Price",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{formatNumber(row.original.contract.price, "currency")}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">
              {formatNumber(row.original.daily_price_delta, "percentage")}
            </span>
          </div>
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
      cell: ({ getValue }) => {
        return <span className="tabular-nums">{formatNumber(getValue() as number, "quantity_precise")}</span>;
      },
    }),

    columnHelper.accessor("amount", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Amount",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">{formatNumber(row.original.amount, "currency")}</span>
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">
              {formatNumber(row.original.progress_percentage, "percentage")}
            </span>
          </div>
        );
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
        } else {
          return <span className="tabular-nums">{formatNumber(getValue() as number, "currency")}</span>;
        }
      },
    }),

    columnHelper.accessor("unrealized_gain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Unrealized Gain" />,
      enableSorting: false,
      meta: {
        className: "text-right",
        displayName: "Unrealized Gain",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        if (isZero(getValue() as number)) {
          return <span className="tabular-nums">-</span>;
        } else {
          return <span className="tabular-nums">{formatNumber(getValue() as number, "currency")}</span>;
        }
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
  ] as ColumnDef<Position>[];
