"use client";
import { useEffect, useState, useCallback } from "react";
import { Wallet, Position, Blockchain, Transaction, CapitalGainHisto, UnrealizedGain } from "@/lib/definition";
import {
  fetchTopPositions,
  fetchTopBlockchains,
  fetchMostProfitablePositions,
  fetchLessProfitablePositions,
  fetchLastTransactions,
  fetchCountTransactions,
  fetchTaskStatus,
  fetchWalletsAll,
  fetchTotalCapitalGainHisto,
  fetchBestPerformerPositions,
  fetchWorstPerformerPositions,
  fetchUnrealizedGain,
} from "@/lib/data";
import React from "react";
import { Toaster } from "@/components/Toaster";
import { useToast } from "@/lib/useToast";
import { DataTable } from "@/components/ui/data-table-wallet/DataTable";
import { LineChartSupport } from "@/components/LineChartSupport";
import { ProgressCircle } from "@/components/ProgressCircle";
import { CategoryBar } from "@/components/CategoryBar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover";
import { WalletDrawer } from "@/components/ui/WalletDrawer";
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";
import { RiAddLine, RiArrowDropRightLine, RiExternalLinkLine, RiRefreshLine } from "@remixicon/react";
import { volume } from "@/data/wallet/volume";
import { BarChart, List, ListItem } from "@tremor/react";
import { currencyFormatter, formatNumber } from "@/lib/format";
import { Card } from "@/components/Card";
import { getColumns } from "@/components/ui/data-table-wallet/columns";
import { Row } from "@tanstack/react-table";
import { refresh } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { formatDistanceToNow } from "date-fns";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/* This function calculates the total capital gain from an array of wallets. */
function getTotalCapitalGain(wallets: Wallet[]): number {
  return wallets.reduce((sum, wallet) => sum + (Number(wallet.capital_gain) || 0), 0);
}

/* This function calculates the total amount from an array of wallets. */
function getTotalAmount(wallets: Wallet[]): number {
  return wallets.reduce((sum, wallet) => sum + (Number(wallet.balance) || 0), 0);
}

function getCapitalGainsDelta(capitalGainHisto: CapitalGainHisto[]): number {
  if (capitalGainHisto.length < 2) return 0; // Not enough data to calculate delta
  const firstGain = capitalGainHisto[0].running_capital_gain;
  const lastGain = capitalGainHisto[capitalGainHisto.length - 1].running_capital_gain;

  return ((lastGain - firstGain) / Math.abs(firstGain)) * 100; // Return percentage change
}

function getCapitalGainsAmount(capitalGainHisto: CapitalGainHisto[]): number {
  if (capitalGainHisto.length < 2) return 0; // Not enough data to calculate delta
  const firstGain = capitalGainHisto[0].running_capital_gain;
  const lastGain = capitalGainHisto[capitalGainHisto.length - 1].running_capital_gain;

  return lastGain - firstGain; // Return absolute change
}

function getTotalCapitalGainforPeriod(capitalGainHisto: CapitalGainHisto[]): number {
  return capitalGainHisto.reduce((sum, item) => sum + (Number(item.capital_gain) || 0), 0);
}

function getTotalCapitalLossforPeriod(capitalGainHisto: CapitalGainHisto[]): number {
  return capitalGainHisto.reduce((sum, item) => sum + (Number(item.capital_loss) || 0), 0);
}

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [top_positions, setTopPositions] = useState<Position[]>([]);
  const [top_blockchains, setTopBlockchains] = useState<Blockchain[]>([]);
  const [most_profitable_positions, setMostProfitablePositions] = useState<Position[]>([]);
  const [less_profitable_positions, setLessProfitablePositions] = useState<Position[]>([]);
  const [best_performer_positions, setBestPerformerPositions] = useState<Position[]>([]);
  const [worst_performer_positions, setWorstPerformerPositions] = useState<Position[]>([]);
  const [last_transactions, setLastTransactions] = useState<Transaction[]>([]);
  const [total_capital_gains, setTotalCapitalGainHisto] = useState<CapitalGainHisto[]>([]);
  const [total_unrealized_gains, setTotalUnrealizedGain] = useState<UnrealizedGain[]>([]);
  const [count_transactions, setCountTransactions] = useState(0);
  const [taskPolling, setTaskPolling] = useState<{
    [taskId: string]: NodeJS.Timeout;
  }>({}); // New state for task polling

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
    await fetchWalletsAll(setWallets);
  }, []); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchWalletData
  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]); // Include fetchWalletData as a dependency

  const fetchTotalCapitalGainHistoData = useCallback(async () => {
    // console.log("fetchPositionCapitalGainHistoData");
    await fetchTotalCapitalGainHisto(90, setTotalCapitalGainHisto);
  }, [fetchTotalCapitalGainHisto, setTotalCapitalGainHisto]);

  useEffect(() => {
    fetchTotalCapitalGainHistoData();
  }, []);

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
    await fetchLastTransactions(5, setLastTransactions);
  };

  // Fetch last transaction function
  const fetchCountTransactionData = async () => {
    await fetchCountTransactions(setCountTransactions);
  };

  // Fetch most profitable position function
  const fetchMostProfitablePositionsData = async () => {
    await fetchMostProfitablePositions(5, setMostProfitablePositions);
  };

  useEffect(() => {
    fetchMostProfitablePositionsData();
  }, []);

  // Fetch less profitable position function
  const fetchLessProfitablePositionsData = async () => {
    await fetchLessProfitablePositions(5, setLessProfitablePositions);
  };

  useEffect(() => {
    fetchLessProfitablePositionsData();
  }, []);

  // Fetch best performer position function
  const fetchBestPerformerPositionsData = async () => {
    await fetchBestPerformerPositions(5, setBestPerformerPositions);
  };

  useEffect(() => {
    fetchBestPerformerPositionsData();
  }, []);

  const fetchWorstPerformerPositionsData = async () => {
    await fetchWorstPerformerPositions(5, setWorstPerformerPositions);
  };
  useEffect(() => {
    fetchWorstPerformerPositionsData();
  }, []);

  const fetchUnrealizedGainData = async () => {
    await fetchUnrealizedGain(setTotalUnrealizedGain);
  };
  useEffect(() => {
    fetchUnrealizedGainData();
  }, []);

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

  const handleRefresh = async () => {
    const response = await refresh();
    if (response.task_id) {
      pollTaskStatus(response.task_id); // Start polling task status
    } else {
      console.error("Error: Task ID not found in the response.");
    }
  };

  const handleWalletDeleted = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleWalletDownloaded = (taskId: string) => {
    // handleClick("Download in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handleWalletFullRefreshed = (taskId: string) => {
    // handleClick("Full refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  // Handle navigation to wallet details
  const handleNavigateToDetails = (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      window.location.href = `/wallets/${selectedWalletId}/positions`;
    }
  };

  // Handle cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      Object.values(taskPolling).forEach((intervalId) => clearInterval(intervalId));
    };
  }, [taskPolling]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [row, setRow] = React.useState<Row<Wallet> | null>(null);
  const datas = row?.original;

  const columns = getColumns({
    onEditClick: (row) => {
      setRow(row);
      setIsOpen(true);
    },
    onDetailsClick: (row) => {
      handleNavigateToDetails(row.original.id.toString());
    },
  });

  const difference_neutre: number = 0;

  const total_amount = getTotalAmount(wallets);
  const total_capital_gain = getTotalCapitalGain(wallets);
  const capitalGainDelta = getCapitalGainsDelta(total_capital_gains);
  const capitalGainAmount = getCapitalGainsAmount(total_capital_gains);
  const summary_daily_performance = [
    {
      name: "Best",
      data: best_performer_positions,
    },
    {
      name: "Worst",
      data: worst_performer_positions,
    },
  ];
  const summary_profitability = [
    {
      name: "Most Profitable",
      data: most_profitable_positions,
    },
    {
      name: "Less Profitable",
      data: less_profitable_positions,
    },
  ];
  const summary_repartition = [
    {
      name: "Positions",
      data: top_positions,
    },
    {
      name: "Blockchains",
      data: top_blockchains,
    },
  ];

  
const summary = [
  {
    name: "Capital gain",
    total: getTotalCapitalGainforPeriod(total_capital_gains),
    color: "bg-blue-500",
  },
  {
    name: "Capital loss",
    total: getTotalCapitalLossforPeriod(total_capital_gains),
    color: "bg-red-500",
  },
];

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Overview</h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">Real-time monitoring of support metrics with AI-powered insights</p>
        </div>
        <div className="flex items-end gap-2">
          <Button
            onClick={() => {
              setRow(null);
              setIsOpen(true);
            }}
            className="flex items-center gap-2 text-base sm:text-sm"
          >
            Add Wallet
            <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 text-base sm:text-sm" onClick={() => handleRefresh()}>
            Refresh
            <RiRefreshLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
          </Button>
        </div>
        <WalletDrawer
          open={isOpen}
          onOpenChange={setIsOpen}
          datas={datas}
          onWalletDeleted={handleWalletDeleted}
          onWalletDownloaded={handleWalletDownloaded}
          onWalletFullRefreshed={handleWalletFullRefreshed}
        />
      </div>
      <Divider />
      <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span
            className="absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-blue-500 dark:bg-blue-500"
            aria-hidden="true"
          />
          <div>
            <p className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-500">Total amount</span>
              <span className="text-sm text-gray-500 dark:text-gray-500"></span>
            </p>
            <p className="flex items-center justify-between gap-2">
              <span className="text-lg font-medium text-gray-900 dark:text-gray-50">{formatNumber(total_amount, "currency")}</span>
              <span
                className={`rounded px-1.5 py-1 text-right text-xs font-semibold ${
                  difference_neutre === 0
                    ? "bg-gray-50 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400"
                    : difference_neutre > 0
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-400/20 dark:text-red-500"
                }`}
              >
                {difference_neutre === 0 ? "0.0%" : `${difference_neutre > 0 ? "+" : ""}${difference_neutre.toFixed(1)}%`}
              </span>
            </p>
          </div>
        </div>
        <div className="relative rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span
            className="absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-blue-500 dark:bg-blue-500"
            aria-hidden="true"
          />
          <div>
            <p className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-500">Total capital gain</span>
              <span className="text-sm text-gray-500 dark:text-gray-500"></span>
            </p>
            <p className="flex items-center justify-between gap-2">
              <span className="text-lg font-medium text-gray-900 dark:text-gray-50">{formatNumber(total_capital_gain, "currency")}</span>
              <span
                className={`rounded px-1.5 py-1 text-right text-xs font-semibold ${
                  capitalGainDelta === 0
                    ? "bg-gray-50 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400"
                    : capitalGainDelta > 0
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-400/20 dark:text-red-500"
                }`}
              >
                {capitalGainDelta === 0 ? "0.0%" : `${capitalGainDelta > 0 ? "+" : ""}${capitalGainDelta.toFixed(1)}%`}
              </span>
            </p>
          </div>
        </div>
        <div className="relative rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span
            className="absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-blue-500 dark:bg-blue-500"
            aria-hidden="true"
          />
          <div>
            <p className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-500">Total unrealized</span>
              <span className="text-sm text-gray-500 dark:text-gray-500"></span>
            </p>
            <p className="flex items-center justify-between gap-2">
              <span className="text-lg font-medium text-gray-900 dark:text-gray-50">
                {total_unrealized_gains[0]
                  ? formatNumber(total_unrealized_gains[0].total_unrealized_gain, "currency")
                  : formatNumber(0, "currency")}
              </span>
              <span
                className={`rounded px-1.5 py-1 text-right text-xs font-semibold ${
                  difference_neutre === 0
                    ? "bg-gray-50 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400"
                    : difference_neutre > 0
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-400/20 dark:text-red-500"
                }`}
              >
                {difference_neutre === 0 ? "0.0%" : `${difference_neutre > 0 ? "+" : ""}${difference_neutre.toFixed(1)}%`}
              </span>
            </p>
          </div>
        </div>

        <Card className="p-0 sm:mx-auto sm:max-w-lg">
          <div className="px-6 pt-6">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Repartition</dt>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">Token allocation across all user wallets</p>
          </div>
          <Tabs defaultValue="Positions">
            <TabsList className="px-6 pt-6">
              {summary_repartition.map((category) => (
                <TabsTrigger value={category.name} key={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="px-6 pb-6">
              {summary_repartition.map((category) => (
                <TabsContent value={category.name} key={category.name}>
                  <p className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>{category.name === "Blockchains" ? "Chain" : "Token"}</span>
                    <span>Amount / Share</span>
                  </p>
                  <List className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
                    {category.data.map((item, idx) => {
                      const colorClasses = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];
                      // Si la catégorie est "Blockchains", item est un Blockchain, sinon c'est une Position
                      const isBlockchain = category.name === "Blockchains";
                      const name = isBlockchain ? (item as Blockchain).name : (item as Position).contract.name;
                      const value = isBlockchain ? (item as Blockchain).balance : (item as Position).amount;
                      const share = isBlockchain ? (item as Blockchain).progress_percentage : (item as Position).progress_percentage;
                      return (
                        <ListItem key={name} className="space-x-6">
                          <div className="flex items-center space-x-2.5 truncate">
                            <span className={classNames(colorClasses[idx], "size-2.5 shrink-0 rounded-sm")} aria-hidden={true} />
                            <span className="truncate dark:text-gray-300">{name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                              {formatNumber(value, "currency")}
                            </span>
                            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {formatNumber(share, "percentage")}
                            </span>
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Card>
        <Card className="p-0 sm:mx-auto sm:max-w-lg">
          <div className="px-6 pt-6">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Position Profitability</dt>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">Profit or loss analysis for each individual position</p>
          </div>
          <Tabs defaultValue="Most Profitable">
            <TabsList className="px-6 pt-6">
              {summary_profitability.map((category) => (
                <TabsTrigger value={category.name} key={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="px-6 pb-6">
              {summary_profitability.map((category) => (
                <TabsContent value={category.name} key={category.name}>
                  <p className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>Token</span>
                    <span>Amount</span>
                  </p>
                  <List className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
                    {category.data.map((item, idx) => {
                      const colorClasses = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];
                      return (
                        <ListItem key={item.contract.name} className="space-x-6">
                          <div className="flex items-center space-x-2.5 truncate">
                            <span className={classNames(colorClasses[idx], "size-2.5 shrink-0 rounded-sm")} aria-hidden={true} />
                            <span className="truncate dark:text-gray-300">{item.contract.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                              {formatNumber(item.capital_gain, "currency")}
                            </span>
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Card>
        <Card className="p-0 sm:mx-auto sm:max-w-lg">
          <div className="px-6 pt-6">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Token Daily Performance</dt>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">Daily variation in token prices</p>
          </div>
          <Tabs defaultValue="Best">
            <TabsList className="px-6 pt-6">
              {summary_daily_performance.map((category) => (
                <TabsTrigger value={category.name} key={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="px-6 pb-6">
              {summary_daily_performance.map((category) => (
                <TabsContent value={category.name} key={category.name}>
                  <p className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>Token</span>
                    <span>Share</span>
                  </p>
                  <List className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
                    {category.data.map((item, idx) => {
                      const colorClasses = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"];
                      return (
                        <ListItem key={item.contract.name} className="space-x-6">
                          <div className="flex items-center space-x-2.5 truncate">
                            <span className={classNames(colorClasses[idx], "size-2.5 shrink-0 rounded-sm")} aria-hidden={true} />
                            <span className="truncate dark:text-gray-300">{item.contract.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {formatNumber(item.daily_price_delta, "percentage")}
                            </span>
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Card>
      </dl>
      <DataTable data={wallets} columns={columns} />
      <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 sm:mx-auto sm:max-w-lg">
          <div>
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Activity</dt>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">Latest transactions across the various blockchains</p>
          </div>
          <div className="mt-6">
            <ul role="list" className="space-y-4">
              {last_transactions.map((step, stepIdx) => (
                <li key={step.id} className="relative flex-1 gap-x-3">
                  <div
                    className={classNames(
                      stepIdx === last_transactions.length - 1 ? "h-6" : "-bottom-6",
                      "absolute left-0 top-0 flex w-6 justify-center"
                    )}
                  >
                    <span className="w-px bg-gray-200 dark:bg-gray-800" aria-hidden={true} />
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-[#090E1A]">
                      {step.type === "IN" ? (
                        <div
                          className="size-1.5 rounded-full bg-emerald-100 ring-1 ring-emerald-500 dark:bg-emerald-400/20 dark:ring-emerald-700"
                          aria-hidden={true}
                        />
                      ) : step.type === "OUT" ? (
                        <div
                          className="size-1.5 rounded-full bg-red-100 ring-1 ring-red-500 dark:bg-red-400/20 dark:ring-red-700"
                          aria-hidden={true}
                        />
                      ) : (
                        <div
                          className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300 dark:bg-[#090E1A] dark:ring-gray-700"
                          aria-hidden={true}
                        />
                      )}
                    </div>
                    <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-300 dark:ring-gray-800">
                      <div className="flex justify-between gap-x-4">
                        <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                          {step.type === "IN" ? "Buy" : step.type === "OUT" ? "Sell" : ""}{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-50">{step.position.contract.symbol}</span>
                          {step.against_contract ? <span> / {step.against_contract.symbol}</span> : ""}
                        </div>
                        <time dateTime={step.date} className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                          {formatDistanceToNow(new Date(step.date), { addSuffix: true })}
                        </time>
                      </div>
                      <div className="flex justify-between gap-x-4">
                        <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                          @ <span className="font-medium text-gray-900 dark:text-gray-50">{formatNumber(step.price, "currency")} </span>for{" "}
                          {formatNumber(step.cost, "currency")}
                        </div>
                        <a
                          href={`${step.position.contract.blockchain.transaction_link}${step.hash}`}
                          className="py-0.5 flex items-center gap-0.5 text-xs font-normal text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-500"
                          aria-label={`Explorer link for ${step.hash}`}
                        >
                          Explorer
                          <RiArrowDropRightLine className="size-4 shrink-0" aria-hidden="true" />
                        </a>
                      </div>
                      <div className="flex justify-between gap-x-4">
                        <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                          on {step.position.contract.blockchain.name}
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <a
                              className="py-0.5 flex items-center gap-0.5 text-xs font-normal text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-500"
                              aria-label={`Details for ${step.hash}`}
                            >
                              Details
                              <RiArrowDropRightLine className="size-4 shrink-0" aria-hidden="true" />
                            </a>
                          </PopoverTrigger>
                          <PopoverContent className="p-4">
                            <div className="flex flex-col gap-1">
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-50">Quantity:</span>{" "}
                                <span className="text-xs leading-5 text-gray-500 dark:text-gray-500">
                                  {formatNumber(step.quantity, "quantity_precise")}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-50">Average cost:</span>{" "}
                                <span className="text-xs leading-5 text-gray-500 dark:text-gray-500">
                                  {formatNumber(step.average_cost, "currency")}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-50">Capital gain:</span>{" "}
                                <span className="text-xs leading-5 text-gray-500 dark:text-gray-500">
                                  {formatNumber(step.capital_gain, "currency")}
                                </span>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {/* <a
                          href={`${step.position.contract.blockchain.transaction_link}${step.hash}`}
                          className="py-0.5 flex items-center gap-0.5 text-xs font-normal text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-500"
                          aria-label={`Details for ${step.hash}`}
                        >
                          Details
                          <RiArrowDropRightLine className="size-4 shrink-0" aria-hidden="true" />
                        </a> */}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
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
      </dl>
      <Card className="p-0 mt-8">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Performance</h3>
          <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
            Capital gain performance in the last 90 days.{" "}
            <a href="#" className="inline-flex items-center gap-1 text-sm/6 text-blue-500 dark:text-blue-500">
              Learn more
              <RiExternalLinkLine className="size-4" aria-hidden={true} />
            </a>
          </p>
        </div>
        <div className="relative rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ul role="list" className="flex flex-wrap gap-x-20 gap-y-10">
            {summary.map((item) => (
              <li key={item.name}>
                <div className="flex items-center space-x-2">
                  <span className={classNames(item.color, "size-3 shrink-0 rounded-sm")} aria-hidden={true} />
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-50">
                    {currencyFormatter(item.total)}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm/6 text-gray-500 dark:text-gray-500">{item.name}</p>
              </li>
            ))}
          </ul>
          <BarChart
            data={total_capital_gains}
            index="date"
            categories={["capital_gain", "capital_loss"]}
            colors={["blue", "red"]}
            stack={true}
            showLegend={false}
            yAxisWidth={45}
            valueFormatter={currencyFormatter}
            className="mt-10 hidden h-72 md:block text-xs text-gray-500 dark:text-gray-500 fill-gray-500 dark:fill-gray-500"
          />
          <BarChart
            data={total_capital_gains}
            index="date"
            categories={["capital_gain", "capital_loss"]}
            colors={["blue", "red"]}
            stack={true}
            showLegend={false}
            showYAxis={false}
            valueFormatter={currencyFormatter}
            className="mt-6 h-72 md:hidden text-xs text-gray-500 dark:text-gray-500 fill-gray-500 dark:fill-gray-500"
          />
        </div>
      </Card>
      <Toaster />
    </main>
  );
};

export default Wallets;
