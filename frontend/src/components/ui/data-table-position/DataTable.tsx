"use client";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/Table";
import { cx } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "../data-table/DataTablePagination";
import { Filterbar } from "../data-table/DataTableFilterbar";
import { useState } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const pageSize = 25;
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const registeredFilterValue = columnFilters.find((filter) => filter.id === "registered")?.value as boolean | undefined;

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: false,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <Filterbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        registeredOnly={Boolean(registeredFilterValue)}
        setRegisteredOnly={(checked: boolean) => {
          table.getColumn("registered")?.setFilterValue(checked || null);
        }}
      />
      <div className="relative overflow-hidden overflow-x-auto">
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-200 dark:border-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    className={cx("whitespace-nowrap py-1 text-sm sm:text-xs", header.column.columnDef.meta?.className)}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} className="group select-none hover:bg-[#FBFBFC] hover:dark:bg-gray-900">
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className={cx(
                                  "relative whitespace-nowrap py-2.5 text-gray-600 dark:text-gray-400",
                                  cell.column.columnDef.meta?.className,
                                  cell.column.columnDef.meta?.cell
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSize={pageSize} />
    </div>
  );
}
