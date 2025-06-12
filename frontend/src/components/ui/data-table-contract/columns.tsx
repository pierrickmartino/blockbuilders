import { Button } from "@/components/Button";
// import { Wallet } from "@/data/wallet/schema"
import { Contract } from "@/lib/definition";
import { formatNumber } from "@/lib/format";
import { Ellipsis } from "lucide-react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { Badge } from "@/components/Badge";

const truncate = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

const columnHelper = createColumnHelper<Contract>();

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Contract>) => void }) =>
  [
    columnHelper.accessor("blockchain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Blockchain" />,
      enableSorting: true,
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
      enableSorting: true,
      meta: {
        className: "text-left",
        displayName: "Name",
      },
      filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("symbol", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Symbol" />,
      enableSorting: true,
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
      enableColumnFilter: true,
      meta: {
        className: "text-left",
        displayName: "Category",
      },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="tabular-nums text-gray-900 dark:text-gray-50">
              <Badge
                className="px-1.5 py-0.5"
                variant={
                  row.getValue("category") === "suspicious"
                    ? "error"
                    : row.getValue("category") === "stable"
                    ? "default"
                    : row.getValue("category") === "collateral"
                    ? "warning"
                    : "neutral"
                }
              >
                {row.getValue("category")}
              </Badge>
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
        return <span>{formatNumber(getValue(), "currency")}</span>;
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
  ] as ColumnDef<Contract>[];
