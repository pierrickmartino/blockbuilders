"use client";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/Table";
import { cx } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
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
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
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
                  <TableHeaderCell key={header.id} className={cx("whitespace-nowrap py-2.5", header.column.columnDef.meta?.className)}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="odd:bg-gray-50 odd:dark:bg-[#090E1A]">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cx("whitespace-nowrap py-2.5", cell.column.columnDef.meta?.className, cell.column.columnDef.meta?.cell)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSize={pageSize} />
    </div>
  );
}
