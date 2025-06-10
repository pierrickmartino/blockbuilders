"use client";
import { useEffect, useState, useCallback } from "react";
import { Position } from "@/lib/definition";
import { fetchPositionsAll, fetchPositionsAllWithSearch } from "@/lib/data";
import { Divider } from "@/components/Divider";
import { DataTable } from "@/components/ui/data-table-position/DataTable";
import { PositionDrawer } from "@/components/ui/PositionDrawer";
import React from "react";
import { Row } from "@tanstack/react-table";
import { getColumns } from "@/components/ui/data-table-position/columns";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);

  // Memoize fetchPositionData using useCallback
  const fetchPositionData = useCallback(async () => {
    await fetchPositionsAll(setPositions);
  }, []); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchPositionData
  useEffect(() => {
    fetchPositionData();
    // console.log("Positions after fetching:", positions); // Log positions
  }, [fetchPositionData]); // Include fetchPositionData as a dependency

  const fetchPositionDataWithSearch = async (searchTerm: string) => {
    await fetchPositionsAllWithSearch(String(searchTerm), setPositions);
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchPositionDataWithSearch(searchTerm);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [row, setRow] = React.useState<Row<Position> | null>(null);
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
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Positions</h1>
              <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Monitor position performance and manage ticket generation</p>
            </div>
            <PositionDrawer
              open={isOpen}
              onOpenChange={setIsOpen}
              datas={datas}
            />
          </div>
          <Divider />
          <section className="mt-8">
            <DataTable data={positions} columns={columns} />
          </section>
        </main>
      );
};

export default Positions;
