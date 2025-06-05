"use client";

import { useEffect, useState, useCallback } from "react";
import { Contract } from "@/lib/definition";
import { fetchContractsAll, fetchContractsAllWithSearch } from "@/lib/data";
import { Divider } from "@/components/Divider";
import { DataTable } from "@/components/ui/data-table-contract/DataTable";
import { getColumns } from "@/components/ui/data-table-contract/columns";
import { Row } from "@tanstack/react-table";
import React from "react";

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Memoize fetchContractData using useCallback
  const fetchContractData = useCallback(async () => {
    await fetchContractsAll(setContracts);
  }, []); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchContractData
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]); // Include fetchContractData as a dependency

  const fetchContractDataWithSearch = async (searchTerm: string) => {
    await fetchContractsAllWithSearch(String(searchTerm), setContracts);
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchContractDataWithSearch(searchTerm);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [row, setRow] = React.useState<Row<Contract> | null>(null);
  const datas = row?.original;

  const columns = getColumns({
    onEditClick: (row) => {
      setRow(row);
      setIsOpen(true);
    },
  });

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Contracts</h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Monitor contract performance and manage ticket generation</p>
        </div>
      </div>
      <Divider />
      <section className="mt-8">
        <DataTable data={contracts} columns={columns} />
      </section>
    </main>
  );
};

export default Contracts;
