"use client";
import { Button } from "@/components/Button";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/Drawer";
import React from "react";
import { Input } from "../Input";
import { Label } from "../Label";
import { Textarea } from "../Textarea";
import { Wallet } from "@/lib/definition";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import { downloadWallet, refreshFullWallet } from "@/lib/actions";
import { formatNumber } from "@/lib/format";

type WalletFormData = Partial<Wallet>;

interface WalletDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datas: Wallet | undefined;
  onWalletCreated: () => void;
  onWalletDownloaded: (response: string) => void;
  onWalletFullRefreshed: (response: string) => void;
}

interface FormPageProps {
  formData: WalletFormData;
  onUpdateForm: (updates: Partial<WalletFormData>) => void;
  datas: Wallet | undefined;
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

const FirstPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Create Wallet</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Wallet Type & Category</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Wallet Name">
        <Input name="walletName" value={formData.name} onChange={(e) => onUpdateForm({ name: e.target.value })} placeholder="Name" />
      </FormField>

      <FormField label="Wallet Address">
        <Input
          name="walletAddress"
          value={formData.address}
          onChange={(e) => onUpdateForm({ address: e.target.value })}
          placeholder="Address"
        />
      </FormField>

      <FormField label="Wallet Description">
        <Textarea
          name="walletDescription"
          value={formData.description}
          onChange={(e) => onUpdateForm({ description: e.target.value })}
          placeholder="Description"
        />
      </FormField>

      {/* <FormField label="Contact Type">
        <RadioCardGroup
          defaultValue={formData.type}
          className="grid grid-cols-2 gap-2 text-sm"
          onValueChange={(value) => onUpdateForm({ type: value })}
        >
          {ticketTypes.map((type) => (
            <RadioCardItem
              key={type.value}
              value={type.value}
              className="flex flex-col justify-start p-2.5 text-base duration-75 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500 data-[state=checked]:text-white sm:text-sm dark:focus:ring-blue-500"
            >
              {type.name}
              <span className="block text-sm opacity-75 sm:text-xs">{type.extended}</span>
            </RadioCardItem>
          ))}
        </RadioCardGroup>
      </FormField> */}

      {/* <FormField label="Policy Number">
        <Input
          disabled
          name="policyNumber"
          value={formData.policyNumber}
          onChange={(e) => onUpdateForm({ policyNumber: e.target.value })}
          placeholder="Auto generated"
        />
      </FormField> */}
    </DrawerBody>
  </>
);

const EditPage = ({ formData, onUpdateForm, datas }: FormPageProps) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Edit Wallet</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Wallet Type & Category</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Wallet ID">
        <Input disabled name="walletId" value={formData.id} onChange={(e) => onUpdateForm({ id: e.target.value })} placeholder="ID" />
      </FormField>

      <FormField label="Wallet Name">
        <Input name="walletName" value={formData.name} onChange={(e) => onUpdateForm({ name: e.target.value })} placeholder="Name" />
      </FormField>

      <FormField label="Wallet Address">
        <Input
          name="walletAddress"
          value={formData.address}
          onChange={(e) => onUpdateForm({ address: e.target.value })}
          placeholder="Address"
        />
      </FormField>

      <FormField label="Wallet Description">
        <Textarea
          name="walletDescription"
          value={formData.description}
          onChange={(e) => onUpdateForm({ description: e.target.value })}
          placeholder="Description"
        />
      </FormField>
      <div>
        <Label className="font-medium">Statistics</Label>
        <div className="mt-0 grid grid-cols-1 gap-5 lg:grid-cols-8">
          <div className="lg:col-span-8">
            <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500">Total amount</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {datas && datas.balance ? formatNumber(datas.balance, "currency") : "-"}
                    </span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+0%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500">Capital gain</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {datas && datas.capital_gain ? formatNumber(datas.capital_gain, "currency") : "-"}
                    </span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+0%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500">Unrealized Gain</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                      {datas && datas.unrealized_gain ? formatNumber(datas.unrealized_gain, "currency") : "-"}
                    </span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+12%</span>
                  </dd>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500"># Positions</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">6</span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+21%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500"># Transactions</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">15 547</span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+3%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-500">Retention Rate</dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">28.0%</span>
                    <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-500">+2%</span>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </DrawerBody>
  </>
);

const SecondPage = ({ formData, onUpdateForm }: FormPageProps) => (
  <>
    {/* <DrawerHeader>
      <DrawerTitle>
        <p>Wallet Details</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Priority & Description</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-6 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <FormField label="Priority Level">
        <RadioCardGroup
          defaultValue={formData.priority}
          className="grid grid-cols-1 gap-2 text-sm"
          onValueChange={(value) => onUpdateForm({ priority: value })}
        >
          {priorities.map((priority) => (
            <RadioCardItem
              key={priority.value}
              value={priority.value}
              className="p-2.5 text-base duration-75 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:border-transparent data-[state=checked]:bg-blue-500 data-[state=checked]:text-white sm:text-sm dark:focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{priority.label}</span>
                <span className="text-sm opacity-75 sm:text-xs">SLA: {priority.sla}</span>
              </div>
              <span className="block text-sm opacity-75 sm:text-xs">{priority.description}</span>
            </RadioCardItem>
          ))}
        </RadioCardGroup>
      </FormField>

      <FormField label="Description">
        <Textarea
          name="description"
          value={formData.description}
          onChange={(e) => onUpdateForm({ description: e.target.value })}
          placeholder="Detailed description of the issue..."
          className="h-32"
        />
      </FormField>

      <FormField label="Expected Call Duration (minutes)">
        <Input
          name="duration"
          type="number"
          value={formData.duration || ""}
          onChange={(e) => {
            onUpdateForm({ duration: e.target.value || null });
          }}
          placeholder="0"
          min="0"
        />
      </FormField>
    </DrawerBody> */}
  </>
);

const SummaryPage = ({ formData }: { formData: WalletFormData }) => (
  <>
    <DrawerHeader>
      <DrawerTitle>
        <p>Review Wallet</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-500">Please review all details before submitting</span>
      </DrawerTitle>
    </DrawerHeader>
    <DrawerBody className="-mx-6 space-y-4 overflow-y-scroll border-t border-gray-200 px-6 dark:border-gray-800">
      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="font-medium">Wallet Information</h3>
          <div className="mt-4 space-y-4">
            <SummaryItem label="Name" value={formData.name || undefined} />
            <SummaryItem label="Address" value={formData.address || undefined} />
            <SummaryItem label="Description" value={formData.description || undefined} />
          </div>
        </div>
        {/* <div className="p-4">
          <h3 className="font-medium">Details</h3>
          <div className="mt-4 space-y-4">
            <SummaryItem label="Priority" value={priorities.find((p) => p.value === formData.priority)?.label ?? undefined} />
            <SummaryItem label="Description" value={formData.description || undefined} />
            <SummaryItem
              label="Call Duration"
              value={formData.duration ? `${formData.duration} minute${formData.duration === "1" ? "" : "s"}` : undefined}
            />
            <SummaryItem label="Created" value={formData.created ? new Date(formData.created).toLocaleString() : undefined} />
          </div>
        </div> */}
      </div>
    </DrawerBody>
  </>
);

export function WalletDrawer({ open, onOpenChange, datas, onWalletCreated, onWalletDownloaded, onWalletFullRefreshed }: WalletDrawerProps) {
  const [formData, setFormData] = React.useState<WalletFormData>({
    id: "",
    name: "",
    address: "",
    description: "",
  });

  React.useEffect(() => {
    if (open && datas) {
      setFormData({
        id: datas.id || "",
        name: datas.name || "",
        address: datas.address || "",
        description: datas.description || "",
      });
    }
    if (open && !datas) {
      setFormData({
        id: "",
        name: "",
        address: "",
        description: "",
      });
    }
    if (!open) {
      setFormData({
        id: "",
        name: "",
        address: "",
        description: "",
      });
    }
  }, [open, datas]);

  const [currentPage, setCurrentPage] = React.useState(1);

  const handleUpdateForm = (updates: Partial<WalletFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const router = useRouter();
  const { createWallet, editWallet } = AuthActions();

  const handleSubmit = () => {
    console.log("Wallet created:", formData);
    createWallet(formData.address, formData.name, formData.description);
    onWalletCreated(); // Notify the parent component that a wallet has been created
    onOpenChange(false);
  };

  const handleEdition = () => {
    console.log("Wallet edited:", formData);
    editWallet(formData.id, formData.address, formData.name, formData.description)
      .json((json) => {
        router.push("/overview");
      })
      .catch((err) => {
        console.error("Error creating wallet:", err);
        // setError("root", { type: "manual", message: err.json.detail });
      });
    onOpenChange(false);
  };

  // Handle navigation to wallet details
  const handleNavigateToDetails = (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      window.location.href = `/overview/wallets/${selectedWalletId}/positions`;
    }
  };

  const handleDownload = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await downloadWallet(selectedWalletId.toString());
      if (response.task_id) {
        // console.log("Task triggered in handleDownload:", response.task_id);
        onWalletDownloaded(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
      onOpenChange(false);
    }
  };

  const handleRefreshFull = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await refreshFullWallet(selectedWalletId.toString());
      if (response.task_id) {
        onWalletFullRefreshed(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
      onOpenChange(false);
    }
  };

  const renderPage = () => {
    if (datas) {
      // If editing an existing wallet, skip the first page
      return <EditPage formData={formData} onUpdateForm={handleUpdateForm} datas={datas} />;
    } else {
      switch (currentPage) {
        case 1:
          return <FirstPage formData={formData} onUpdateForm={handleUpdateForm} datas={datas} />;
        case 2:
          return <EditPage formData={formData} onUpdateForm={handleUpdateForm} datas={datas} />;
        case 3:
          return <SummaryPage formData={formData} />;
        default:
          return null;
      }
    }
  };

  const renderFooter = () => {
    if (datas) {
      return (
        <>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
          <Button variant="secondary" onClick={() => handleDownload(datas.id.toString())}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </Button>
          <Button variant="secondary" onClick={() => handleRefreshFull(datas.id.toString())}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
              />
            </svg>
          </Button>
          <Button onClick={handleEdition}>Edit Wallet</Button>
        </>
      );
    } else {
      if (currentPage === 1) {
        return (
          <>
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
            <Button onClick={() => setCurrentPage(3)}>Review</Button>
          </>
        );
      }
      if (currentPage === 2 && datas) {
      }
      return (
        <>
          <Button variant="secondary" onClick={() => setCurrentPage(1)}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Create Wallet</Button>
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
