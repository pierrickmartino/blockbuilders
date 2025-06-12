import { Badge } from "@/components/Badge";
import { Badge1 } from "@/components/BadgeCustom";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
// import { Wallet } from "@/data/wallet/schema"
import { Wallet } from "@/lib/definition";
import { formatNumber } from "@/lib/format";
import { Ellipsis } from "lucide-react";
import { cx } from "@/lib/utils";
import { RiAlarmWarningLine, RiFileCheckLine, RiFileListLine, RiFolderReduceLine } from "@remixicon/react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";

const typeIconMapping: Record<string, React.ElementType> = {
  "fnol-contact": RiFolderReduceLine,
  "policy-contact": RiFileListLine,
  "claims-contact": RiFileCheckLine,
  "emergency-contact": RiAlarmWarningLine,
};

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

const columnHelper = createColumnHelper<Wallet>();

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Wallet>) => void }) =>
  [
    // columnHelper.display({
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomeRowsSelected() ? "indeterminate" : false}
    //       onCheckedChange={() => table.toggleAllPageRowsSelected()}
    //       className="translate-y-0.5"
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onClick={(e) => e.stopPropagation()}
    //       onCheckedChange={() => row.toggleSelected()}
    //       className="translate-y-0.5"
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   meta: {
    //     displayName: "Select",
    //   },
    // }),
    // columnHelper.accessor("transaction_date", {
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Purchased on" />,
    //   cell: ({ getValue }) => {
    //     const date = getValue();
    //     return format(new Date(date), "MMM dd, yyyy 'at' h:mma");
    //   },
    //   enableSorting: true,
    //   enableHiding: false,
    //   meta: {
    //     className: "tabular-nums",
    //     displayName: "Purchased",
    //   },
    // }),
    // columnHelper.accessor("expense_status", {
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    //   enableSorting: true,
    //   meta: {
    //     className: "text-left",
    //     displayName: "Status",
    //   },
    //   cell: ({ row }) => {
    //     const statusValue = row.getValue("expense_status");
    //     const status = expense_statuses.find((item) => item.value === statusValue);
    //     if (!status) {
    //       return statusValue; // Fallback to displaying the raw status
    //     }
    //     return <Badge variant={status.variant as BadgeProps["variant"]}>{status.label}</Badge>;
    //   },
    // }),
    columnHelper.accessor("name", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      enableSorting: true,
      meta: {
        className: "text-left",
        displayName: "Name",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span className="font-medium">{getValue()}</span>;
      },
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      enableSorting: false,
      meta: {
        className: "text-left",
        displayName: "Description",
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
    columnHelper.accessor("balance", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
      enableSorting: true,
      meta: {
        className: "text-right",
        displayName: "Balance",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span className="font-medium">{formatNumber(getValue(), "currency")}</span>;
      },
    }),
    columnHelper.accessor("capital_gain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Capital Gain" />,
      enableSorting: true,
      meta: {
        className: "text-right",
        displayName: "Capital Gain",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span>{formatNumber(getValue(), "currency")}</span>;
      },
    }),
    columnHelper.accessor("unrealized_gain", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Unrealized Gain" />,
      enableSorting: true,
      meta: {
        className: "text-right",
        displayName: "Unrealized Gain",
      },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        return <span>{formatNumber(getValue(), "percentage")}</span>;
      },
    }),
    // columnHelper.accessor("category", {
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    //   enableSorting: false,
    //   meta: {
    //     className: "text-left",
    //     displayName: "Category",
    //   },
    // }),
    // columnHelper.accessor("amount", {
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    //   enableSorting: true,
    //   meta: {
    //     className: "text-right",
    //     displayName: "Amount",
    //   },
    //   cell: ({ getValue }) => {
    //     return <span className="font-medium">{formatters.currency({ number: getValue() })}</span>;
    //   },
    // }),
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
  ] as ColumnDef<Wallet>[];

// export const columns = [
//   {
//     header: "Name",
//     accessorKey: "name",
//     meta: {
//       className: "text-left",
//       cell: "font-medium text-gray-900 dark:text-gray-50",
//     },
//   },
// {
//   header: "Created at",
//   accessorKey: "created",
//   meta: {
//     className: "text-left",
//   },
//   cell: ({ row }) => (
//     <>
//       {new Date(row.original.created).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       })}
//     </>
//   ),
// },
// {
//   header: "Description",
//   accessorKey: "description",
//   meta: {
//     className: "text-left",
//     cell: "font-medium text-gray-900 dark:text-gray-50",
//   },
// },
// {
//   header: "Address",
//   accessorKey: "address",
//   meta: {
//     className: "text-left",
//     cell: "font-medium",
//   },
// },
// {
//   header: "Balance",
//   accessorKey: "balance",
//   meta: {
//     className: "text-right",
//     cell: "font-medium",
//   },
// },
// {
//   header: "Capital Gain",
//   accessorKey: "capital_gain",
//   meta: {
//     className: "text-right",
//     cell: "font-medium",
//   },
// },
// {
//   header: "Unrealized Gain",
//   accessorKey: "unrealized_gain",
//   meta: {
//     className: "text-right",
//     cell: "font-medium",
//   },
// },
// {
//   header: "Contact Type",
//   accessorKey: "type",
//   meta: {
//     className: "text-left",
//   },
//   cell: ({ row }) => {
//     const Icon = typeIconMapping[row.original.type]
//     return (
//       <div className="flex items-center gap-2">
//         {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
//         <span className="capitalize">
//           {row.original.type.replace("-contact", "")}
//         </span>
//       </div>
//     )
//   },
// },
// {
//   header: "Duration",
//   accessorKey: "duration",
//   meta: {
//     className: "text-right",
//   },
//   cell: ({ row }) => {
//     const DurationCell = (props: { minutes: string | null }) => {
//       if (props.minutes === null) return null
//       const mins = parseInt(props.minutes)
//       const hours = Math.floor(mins / 60)
//       const remainingMins = mins % 60

//       return (
//         <span className="ml-auto text-gray-600 dark:text-gray-300">
//           {hours > 0 ? `${hours}h ` : ""}
//           {remainingMins}m
//         </span>
//       )
//     }
//     return (
//       <div className="flex items-center gap-2">
//         <DurationCell minutes={row.original.duration} />
//       </div>
//     )
//   },
// },
// {
//   header: "Assessed Priority",
//   accessorKey: "priority",
//   meta: {
//     className: "text-left",
//   },
//   cell: ({ row }) => (
//     <Badge
//       variant="neutral"
//       className="gap-1.5 font-normal capitalize text-gray-700 dark:text-gray-300"
//     >
//       <span
//         className={cx(
//           "size-2 shrink-0 rounded-sm",
//           "bg-gray-500 dark:bg-gray-500",
//           {
//             "bg-emerald-600 dark:bg-emerald-400":
//               row.original.priority === "low",
//           },
//           {
//             "bg-gray-500 dark:bg-gray-500":
//               row.original.priority === "medium",
//           },
//           {
//             "bg-orange-500 dark:bg-orange-500":
//               row.original.priority === "high",
//           },
//           {
//             "bg-red-500 dark:bg-red-500":
//               row.original.priority === "emergency",
//           },
//         )}
//         aria-hidden="true"
//       />
//       {row.original.priority}
//     </Badge>
//   ),
// },
// ] as ColumnDef<Wallet>[];
