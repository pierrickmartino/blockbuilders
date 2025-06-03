"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  Box,
} from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Wallet } from "@/lib/definition";
import { fetchWallets } from "@/lib/data";
import { Add, Edit, Delete } from "@mui/icons-material";
import { deleteWallet } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { AuthActions } from "@/app/(auth)/utils";
import WalletTable from "../components/dashboard/WalletTable";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";

export default function Wallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [open, setOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [form, setForm] = useState({ name: "", address: "", description: "" });
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items
  const router = useRouter();
  const { createWallet } = AuthActions();

  useEffect(() => {
    fetchWalletsData();
  }, []);

  // Memoize fetchTransactionData using useCallback
  const fetchWalletsData = useCallback(async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  const handleOpen = (wallet: Wallet | null = null) => {
    if (wallet) {
      setEditingWallet(wallet);
      setForm({ name: wallet.name, address: wallet.address, description: wallet.description });
    } else {
      setEditingWallet(null);
      setForm({ name: "", address: "", description: "" });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (editingWallet) {
      //   await axios.put(`/api/wallets/${editingWallet.id}/`, form);
    } else {
      createWallet(form.address, form.name, form.description).json((json) => {
        router.push("/dashboard/wallets");
      });
      //   .catch((err) => {
      //     setError("root", { type: "manual", message: err.json.detail });
      //   });
    }
    setOpen(false);
    fetchWalletsData();
  };

  const handleDelete = async (id: string) => {
    await deleteWallet(id);
    fetchWalletsData();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
    fetchWalletsData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchWalletsData();
  };

  const handleShowWalletDrawer = () => {};
  const handleWalletFullRefreshed = () => {};
  const handleWalletDeleted = () => {};
  const handleWalletRefreshed = () => {};
  const handleWalletDownloaded = () => {};

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Heading variant="h6" className="mb-2">
          Wallets
        </Heading>
        <Button variant="primary" onClick={() => handleOpen()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-3.5 h-3.5 me-2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Wallet
        </Button>
      </Stack>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          {/* <List>
            {wallets.map((wallet) => (
              <ListItem
                key={wallet.id}
                secondaryAction={
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <IconButton onClick={() => handleOpen(wallet)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(wallet.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={`${wallet.name} (${wallet.description})`} secondary={`Address: ${wallet.address}`} />
              </ListItem>
            ))}
          </List> */}
          <WalletTable
            wallets={wallets}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onWalletDeleted={handleWalletDeleted}
            onWalletDownloaded={handleWalletDownloaded}
            onWalletRefreshed={handleWalletRefreshed}
            onWalletFullRefreshed={handleWalletFullRefreshed}
            onWalletClick={handleShowWalletDrawer}
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingWallet ? "Edit" : "Add"} Wallet</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  //   // Memoize fetchTransactionData using useCallback
  //   const fetchTransactionData = useCallback(async () => {
  //     await fetchTransactionsAll(setTransactions, setTotalCount, page, rowsPerPage);
  //   }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  //   // Use useEffect to call fetchTransactionData
  //   useEffect(() => {
  //     fetchTransactionData();
  //   }, [fetchTransactionData]); // Include fetchTransactionData as a dependency

  //   const fetchTransactionDataWithSearch = async (searchTerm: string) => {
  //     await fetchTransactionsAllWithSearch(String(searchTerm), setTransactions, setTotalCount, page, rowsPerPage);
  //   };

  //   const handlePageChange = (newPage: number) => {
  //     setPage(newPage); // Update page state
  //   };

  //   const handleRowsPerPageChange = (newRowsPerPage: number) => {
  //     setRowsPerPage(newRowsPerPage); // Update rows per page state
  //     setPage(0); // Reset page to 0 whenever rows per page changes
  //   };

  //   const handleSearch = (searchTerm: string) => {
  //     // Implement your search logic here, such as making API calls
  //     fetchTransactionDataWithSearch(searchTerm);
  //   };

  //   /* Drawer for transaction detail */
  //   const [drawerOpen, setDrawerOpen] = useState(false);
  //   const toggleDrawer = (open: boolean) => {
  //     setDrawerOpen(open);
  //   };
  //   const handleShowTransactionDrawer = () => {
  //     toggleDrawer(true);
  //   };

  //   const DrawerList = (
  //     <Box sx={{ width: 350, height: "100%" }} role="presentation">
  //       {/* <CreateWalletForm /> */}
  //     </Box>
  //   );

  //   return (
  //     <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
  //       <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
  //         <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
  //           Transactions
  //         </Typography>
  //       </Stack>
  //       <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
  //         <Grid size={{ xs: 12, lg: 12 }}>
  //           <TransactionTable
  //             transactions={transactions}
  //             page={page}
  //             rowsPerPage={rowsPerPage}
  //             totalCount={totalCount}
  //             onPageChange={handlePageChange}
  //             onRowsPerPageChange={handleRowsPerPageChange}
  //             onTransactionClick={handleShowTransactionDrawer}
  //           />
  //         </Grid>
  //       </Grid>
  //       <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
  //         {DrawerList}
  //       </Drawer>
  //     </Box>
  //   );
}
