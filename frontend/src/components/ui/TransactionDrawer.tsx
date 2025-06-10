"use client";
import { Button } from "@/components/Button";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/Drawer";
import React from "react";
import { Input } from "../Input";
import { Label } from "../Label";

import { Transaction } from "@/lib/definition";

interface TransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datas: Transaction | undefined;
}

interface FormPageProps {
  datas: Transaction | undefined;
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
        <p>Transaction</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Information</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      
    </DrawerBody>
  </>
);

export function TransactionDrawer({ open, onOpenChange, datas }: TransactionDrawerProps) {
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
