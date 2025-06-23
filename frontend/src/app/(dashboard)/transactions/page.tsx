"use client";
// components
import { useEffect, useState, useCallback } from "react";
import { Transaction } from "@/lib/definition";
import { fetchTransactionsAll, fetchTransactionsAllWithSearch } from "@/lib/data";
import React from "react";
import { Row } from "@tanstack/react-table";
import { Divider } from "@/components/Divider";
import { DataTable } from "@/components/ui/data-table-transaction/DataTable";
import { TransactionDrawer } from "@/components/ui/TransactionDrawer";
import { getColumns } from "@/components/ui/data-table-transaction/columns";
import { Button } from "@/components/Button";
import { RiDownload2Line } from "@remixicon/react";
import { exportAllTransactions } from "@/lib/export-transaction";
import saveAs from "file-saver";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Memoize fetchTransactionData using useCallback
  const fetchTransactionData = useCallback(async () => {
    await fetchTransactionsAll(setTransactions);
  }, []); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchTransactionData
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Include fetchTransactionData as a dependency

  const fetchTransactionDataWithSearch = async (searchTerm: string) => {
    await fetchTransactionsAllWithSearch(String(searchTerm), setTransactions);
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchTransactionDataWithSearch(searchTerm);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [row, setRow] = React.useState<Row<Transaction> | null>(null);
  const datas = row?.original;

  const columns = getColumns({
    onEditClick: (row) => {
      setRow(row);
      setIsOpen(true);
    },
  });

  const handleExport = async () => {
    console.log("Export function called"); // Debug log

    try {
      console.log("Attempting to export transactions");

      const response = await exportAllTransactions();

      // Log response to check if we got it successfully
      console.log("Export API response received:", response);

      // Create a Blob from the response data
      const blob = new Blob([response], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, `transactions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`);
    } catch (error) {
      console.error("An error occurred while exporting transactions:", error);
    }
  };

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Transactions</h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Monitor transaction performance and manage ticket generation</p>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="secondary" className="flex items-center gap-2 text-base sm:text-sm" onClick={() => handleExport()}>
            Export
            <RiDownload2Line className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
          </Button>
        </div>
        <TransactionDrawer open={isOpen} onOpenChange={setIsOpen} datas={datas} />
      </div>
      <Divider />
      <section className="mt-8">
        <DataTable data={transactions} columns={columns} />
      </section>
    </main>
  );
};

export default Transactions;
