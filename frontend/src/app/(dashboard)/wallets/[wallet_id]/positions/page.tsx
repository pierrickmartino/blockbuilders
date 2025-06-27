"use client";
import { useEffect, useState, useCallback } from "react";
import { Position } from "@/lib/definition";
import { fetchPositionsAll, fetchPositionsAllWithSearch, fetchWalletPositions } from "@/lib/data";
import { Divider } from "@/components/Divider";
import { DataTable } from "@/components/ui/data-table-position/DataTable";
import { PositionDrawer } from "@/components/ui/PositionDrawer";
import React from "react";
import { Row } from "@tanstack/react-table";
import { getColumns } from "@/components/ui/data-table-position/columns";
import { Button } from "@/components/Button";
import { RiDownload2Line } from "@remixicon/react";
import { exportAllPositions } from "@/lib/export-transaction";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const params = useParams();
  const wallet_id = params.wallet_id;

  // Memoize fetchPositionData using useCallback
  const fetchPositionData = useCallback(async () => {
    if (wallet_id) {
      await fetchWalletPositions(String(wallet_id), setPositions);
    }
  }, [wallet_id]); // Dependencies include wallet_id

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

  const handleExport = async () => {
    console.log("Export function called"); // Debug log

    try {
      console.log("Attempting to export positions");

      const response = await exportAllPositions();

      // Log response to check if we got it successfully
      console.log("Export API response received:", response);

      // Create a Blob from the response data
      const blob = new Blob([response], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, `positions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`);
    } catch (error) {
      console.error("An error occurred while exporting positions:", error);
    }
  };

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Positions</h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Monitor position performance and manage ticket generation</p>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="secondary" className="flex items-center gap-2 text-base sm:text-sm" onClick={() => handleExport()}>
            Export
            <RiDownload2Line className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
          </Button>
        </div>
        <PositionDrawer open={isOpen} onOpenChange={setIsOpen} datas={datas} />
      </div>
      <Divider />
      <section className="mt-8">
        <DataTable data={positions} columns={columns} />
      </section>
    </main>
  );
};

export default Positions;
