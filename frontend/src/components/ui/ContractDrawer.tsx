"use client";
import { Button } from "@/components/Button";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/Drawer";
import React from "react";
import { Input } from "../Input";
import { Label } from "../Label";

import { Contract } from "@/lib/definition";
import { setContractAsStable, setContractAsSuspicious } from "@/lib/actions";

interface ContractDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datas: Contract | undefined;
  onContractSetAsSuspicious: () => void;
  onContractSetAsStable: () => void;
}

interface FormPageProps {
  datas: Contract | undefined;
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
        <p>Contract</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Information</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Blockchain">
          <Input value={datas?.blockchain.name} readOnly />
        </FormField>
        <FormField label="Name">
          <Input value={datas?.name} readOnly />
        </FormField>
        <FormField label="Category">
          <Input value={datas?.category} readOnly />
        </FormField>
        <FormField label="Symbol">
          <Input value={datas?.symbol} readOnly />
        </FormField>
        <FormField label="Address">
          <Input value={datas?.address} readOnly />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SummaryItem label="Total Supply" value={datas?.supply_total} />
        <SummaryItem label="Decimals" value={datas?.decimals} />
      </div>
    </DrawerBody>
  </>
);

export function ContractDrawer({ open, onOpenChange, datas, onContractSetAsSuspicious, onContractSetAsStable }: ContractDrawerProps) {
  const handleSetAsSuspicious = async (selectedContractId: string) => {
    if (selectedContractId !== null) {
      const response = await setContractAsSuspicious(selectedContractId.toString());
      if (response.message !== "Database Error: Failed to set contract as suspicious.") {
        onContractSetAsSuspicious(); // Notify parent to refresh
      }
      onOpenChange(false);
    }
  };

  const handleSetAsStable = async (selectedContractId: string) => {
    if (selectedContractId !== null) {
      const response = await setContractAsStable(selectedContractId.toString());
      if (response.message !== "Database Error: Failed to set contract as stable.") {
        onContractSetAsStable(); // Notify parent to refresh
      }
      onOpenChange(false);
    }
  };

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
          <Button onClick={() => handleSetAsSuspicious(datas.id.toString())}>Suspicious</Button>
          <Button onClick={() => handleSetAsStable(datas.id.toString())}>Stable</Button>
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
