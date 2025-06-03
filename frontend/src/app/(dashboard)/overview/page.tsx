"use client";
// import WalletTable from "../components/dashboard/WalletTable";
import { useEffect, useState, useCallback } from "react";
import { Wallet, Position, Blockchain, Transaction } from "@/lib/definition";
import {
  fetchWallets,
  fetchTopPositions,
  fetchTopBlockchains,
  fetchLastTransactions,
  fetchCountTransactions,
  fetchTaskStatus,
} from "@/lib/data";
// import LastTransactions from "../components/dashboard/LastTransactions";
// import TradingCalendar from "../components/dashboard/TradingCalendar";
import React from "react";
import CreateWalletForm from "@/components/forms/CreateWalletForm";
// import StatCard, { StatCardProps } from "../components/dashboard/StatCard";
// import HighlightedCard from "../components/dashboard/HighlightedCard";
// import BasicCard from "../components/shared/BasicCard";
// import TopPositions from "../components/dashboard/TopPositions";
// import TopBlockchains from "../components/dashboard/TopBlockchains";
import { Toaster } from "@/components/Toaster";
import { useToast } from "@/lib/useToast";
import { DataTable } from "@/components/ui/data-table-support/DataTable";
import { LineChartSupport } from "@/components/LineChartSupport";
import { ProgressCircle } from "@/components/ProgressCircle";
import { CategoryBar } from "@/components/CategoryBar";
import { WalletDrawer } from "@/components/ui/WalletDrawer";
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";
import { RiAddLine } from "@remixicon/react";
import { volume } from "@/data/wallet/volume";
import { List, ListItem } from "@tremor/react";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/Card";
import { getColumns } from "@/components/ui/data-table-support/columns";
import { Row } from "@tanstack/react-table";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [top_positions, setTopPositions] = useState<Position[]>([]);
  const [top_blockchains, setTopBlockchains] = useState<Blockchain[]>([]);
  const [last_transactions, setLastTransactions] = useState<Transaction[]>([]);
  const [count_transactions, setCountTransactions] = useState(0);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items
  const [taskPolling, setTaskPolling] = useState<{
    [taskId: string]: NodeJS.Timeout;
  }>({}); // New state for task polling
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleAddWalletClick = () => {
    toggleDrawer(true);
  };

  /* Drawer for wallet detail */
  const [drawerWalletOpen, setDrawerWalletOpen] = useState(false);
  const toggleWalletDrawer = (open: boolean) => {
    setDrawerWalletOpen(open);
  };
  const handleShowWalletDrawer = () => {
    toggleWalletDrawer(true);
  };

  const { toast } = useToast();

  // New function to poll task status
  const pollTaskStatus = (taskId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await fetchTaskStatus(taskId);
        console.log("Task result in pollTaskStatus:", status);
        if (status === "SUCCESS") {
          toast({
            title: "Great News !",
            description: `Task ${taskId} finished successfully.`,
            variant: "success",
            duration: 3000,
          });
          clearInterval(taskPolling[taskId]);
          setTaskPolling((prev) => {
            const { [taskId]: _, ...remainingPolling } = prev; // Remove the completed task
            return remainingPolling;
          });
        }
      } catch (error) {
        console.error("Error polling task status:", error);
        clearInterval(intervalId);
        setTaskPolling((prev) => {
          const { [taskId]: _, ...remainingPolling } = prev; // Remove the errored task
          return remainingPolling;
        });
      }
    }, 3000); // Poll every 3 seconds

    setTaskPolling((prev) => ({
      ...prev,
      [taskId]: intervalId,
    }));
  };

  // Memoize fetchWalletData using useCallback
  const fetchWalletData = useCallback(async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchWalletData
  useEffect(() => {
    fetchWalletData();
  }, [page, rowsPerPage, fetchWalletData]); // Include fetchWalletData as a dependency

  // Fetch top positions function
  const fetchTopPositionData = async () => {
    await fetchTopPositions(5, setTopPositions);
  };

  // Fetch top blockchain function
  const fetchTopBlockchainData = async () => {
    await fetchTopBlockchains(5, setTopBlockchains);
  };

  // Fetch last transaction function
  const fetchLastTransactionData = async () => {
    await fetchLastTransactions(6, setLastTransactions);
  };

  // Fetch last transaction function
  const fetchCountTransactionData = async () => {
    await fetchCountTransactions(setCountTransactions);
  };

  useEffect(() => {
    fetchTopPositionData();
  }, []);

  useEffect(() => {
    fetchTopBlockchainData();
  }, []);

  useEffect(() => {
    fetchLastTransactionData();
  }, []);

  useEffect(() => {
    fetchCountTransactionData();
  }, []);

  // const handleWalletCreated = () => {
  //   fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  //   toggleDrawer(false);
  // };

  const handleWalletDeleted = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleWalletDownloaded = (taskId: string) => {
    // handleClick("Download in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handleWalletRefreshed = (taskId: string) => {
    // handleClick("Refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handleWalletFullRefreshed = (taskId: string) => {
    // handleClick("Full refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
    fetchWalletData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchWalletData();
  };

  // Handle cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      Object.values(taskPolling).forEach((intervalId) => clearInterval(intervalId));
    };
  }, [taskPolling]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [row, setRow] = React.useState<Row<Wallet> | null>(null)
  
  const columns = getColumns({
    onEditClick: (row) => {
      setRow(row)
      setIsOpen(true)
    },
  })

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Overview</h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Real-time monitoring of support metrics with AI-powered insights</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-base sm:text-sm">
          Add Wallet
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <WalletDrawer open={isOpen} onOpenChange={setIsOpen} />
      </div>
      <Divider />
      <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Current Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-50">247</dd>
          <CategoryBar values={[82, 13, 5]} className="mt-6" colors={["blue", "lightGray", "red"]} showLabels={false} />
          <ul role="list" className="mt-4 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <li>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-50">82%</span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500" aria-hidden="true" />
                <span className="text-sm">Resolved</span>
              </div>
            </li>
            <li>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-50">13%</span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-sm bg-gray-400 dark:bg-gray-600" aria-hidden="true" />
                <span className="text-sm">In Progress</span>
              </div>
            </li>
            <li>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-50">5%</span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-sm bg-red-500 dark:bg-red-500" aria-hidden="true" />
                <span className="text-sm">Escalated</span>
              </div>
            </li>
          </ul>
        </Card>
        <Card>
          <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">SLA Performance</dt>
          <div className="mt-4 flex flex-nowrap items-center justify-between gap-y-4">
            <dd className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500" aria-hidden="true" />
                  <span className="text-sm">Within SLA</span>
                </div>
                <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">83.3%</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-sm bg-red-500 dark:bg-red-500" aria-hidden="true" />
                  <span className="text-sm text-gray-900 dark:text-gray-50">SLA Breached</span>
                </div>
                <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">16.7%</span>
              </div>
            </dd>
            <ProgressCircle value={83} radius={45} strokeWidth={7} />
          </div>
        </Card>
        <Card>
          <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Call Volume Trends</dt>
          <div className="mt-4 flex items-center gap-x-8 gap-y-4">
            <dd className="space-y-3 whitespace-nowrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-sm bg-blue-500 dark:bg-blue-500" aria-hidden="true" />
                  <span className="text-sm">Today</span>
                </div>
                <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">573</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-sm bg-gray-400 dark:bg-gray-600" aria-hidden="true" />
                  <span className="text-sm">Yesterday</span>
                </div>
                <span className="mt-1 block text-2xl font-semibold text-gray-900 dark:text-gray-50">451</span>
              </div>
            </dd>
            <LineChartSupport
              className="h-28"
              data={volume}
              index="time"
              categories={["Today", "Yesterday"]}
              colors={["blue", "lightGray"]}
              showTooltip={false}
              valueFormatter={(number: number) => Intl.NumberFormat("us").format(number).toString()}
              startEndOnly={true}
              showYAxis={false}
              showLegend={false}
            />
          </div>
        </Card>
        <Card className="sm:mx-auto sm:max-w-lg">
          <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Biggest Positions</dt>
          <p className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>Token</span>
            <span>Amount / Share</span>
          </p>
          <List className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
            {top_positions.map((item, idx) => {
              const colorClasses = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];
              return (
                <ListItem key={item.contract.name} className="space-x-6">
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={classNames(colorClasses[idx], "size-2.5 shrink-0 rounded-sm")} aria-hidden={true} />
                    <span className="truncate dark:text-gray-300">{item.contract.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                      {formatNumber(item.amount, "currency")}
                    </span>
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {formatNumber(item.progress_percentage, "percentage")}
                    </span>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <Card className="sm:mx-auto sm:max-w-lg">
          <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Biggest Blockchains</dt>
          <p className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>Blockchain</span>
            <span>Amount / Share</span>
          </p>
          <List className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
            {top_blockchains.map((item, idx) => {
              const colorClasses = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];
              return (
                <ListItem key={item.name} className="space-x-6">
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={classNames(colorClasses[idx], "size-2.5 shrink-0 rounded-sm")} aria-hidden={true} />
                    <span className="truncate dark:text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                      {formatNumber(item.balance, "currency")}
                    </span>
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {formatNumber(item.progress_percentage, "percentage")}
                    </span>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Card>
      </dl>
      <DataTable
        data={wallets}
        columns={columns}
      />
    </main>
    // <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
    //   <Heading variant="h6" className="mb-2">
    //     Overview
    //   </Heading>
    //   <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
    //     {data.map((card, index) => (
    //       <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
    //         <StatCard {...card} />
    //       </Grid>
    //     ))}
    //     <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
    //       <HighlightedCard />
    //     </Grid>
    //   </Grid>
    //   <Heading variant="h6" className="mb-2">
    //     Details
    //   </Heading>
    //   <Grid container spacing={2} columns={12}>
    //     <Grid size={{ xs: 12, lg: 9 }}>
    //       <Grid container spacing={2}>
    //         <Grid size={{ xs: 12 }}>
    //           <WalletTable
    //             wallets={wallets}
    //             page={page}
    //             rowsPerPage={rowsPerPage}
    //             totalCount={totalCount}
    //             onPageChange={handlePageChange}
    //             onRowsPerPageChange={handleRowsPerPageChange}
    //             onWalletDeleted={handleWalletDeleted}
    //             onWalletDownloaded={handleWalletDownloaded}
    //             onWalletRefreshed={handleWalletRefreshed}
    //             onWalletFullRefreshed={handleWalletFullRefreshed}
    //             onWalletClick={handleShowWalletDrawer}
    //           />
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //     <Grid size={{ xs: 12, sm: 12, lg: 3 }}>
    //       <BasicCard
    //         title="Activity"
    //         subtitle="Latest transactions across the various blockchains"
    //         action={
    //           <Fragment>
    //             <IconButton size="small" href="/dashboard/transactions">
    //               <ReadMoreOutlined />
    //             </IconButton>
    //           </Fragment>
    //         }
    //       >
    //         <LastTransactions transactions={last_transactions} count={count_transactions} />
    //       </BasicCard>
    //     </Grid>
    //   </Grid>
    //   <Toaster />
    //   <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
    //     {DrawerList}
    //   </Drawer>
    //   <Drawer anchor="right" open={drawerWalletOpen} onClose={() => toggleWalletDrawer(false)}>
    //     {DrawerWallet}
    //   </Drawer>
    // </Box>
  );
};

export default Wallets;
