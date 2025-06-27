"use client";
import { Button } from "@/components/Button";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/Drawer";
import React from "react";
import { Label } from "../Label";

import { Position } from "@/lib/definition";
import { RiArrowDropRightLine } from "@remixicon/react";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { formatNumber } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";

interface PositionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datas: Position | undefined;
}

interface FormPageProps {
  datas: Position;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SummaryItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm">{value ?? "Not provided"}</p>
  </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="font-medium">{label}</Label>
    <div className="mt-2">{children}</div>
  </div>
);

const FirstPage = ({ datas }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Position</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Information</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <div>
        <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">Activity</dt>
        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">Latest transactions across the various blockchains</p>
      </div>
      <div className="mt-6">
        <ul role="list" className="space-y-4">
          {datas.last_transactions.map((step, stepIdx) => (
            <li key={step.id} className="relative flex-1 gap-x-3">
              <div
                className={classNames(
                  stepIdx === datas.last_transactions.length - 1 ? "h-6" : "-bottom-6",
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
    </DrawerBody>
  </>
);

export function PositionDrawer({ open, onOpenChange, datas }: PositionDrawerProps) {
  const renderPage = () => {
    if (datas) {
      return <FirstPage datas={datas} />;
    }
  };

  const renderFooter = () => {
    if (datas) {
      return (
        <>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </>
      );
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-x-hidden sm:max-w-lg">
        {renderPage()}
        <DrawerFooter className="-mx-6 -mb-2 gap-2 px-6 sm:justify-between">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
