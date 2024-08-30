"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { OrdersData } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Headers from "../Headers/Headers";
import { ExpandRow } from "./ExpandRow";

export default function WrapperHeader() {
  const [showWindow, setShowWindow] = useState<boolean>(false);

  const { unpaidOrders } = useUserContext();
  const { t } = useTranslation("orderTable");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.includes("/my_account")) {
      router.push("/new_order");
    }
  }, [pathname]);

  return (
    <>
      <Headers setShowWindow={setShowWindow} />
      {showWindow && (
        <Dialog
          fullWidth={true}
          maxWidth="xl"
          open={showWindow}
          onClose={() => setShowWindow(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Unpaid orders"}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Delivery date and time
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Payment link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unpaidOrders.map((order: OrdersData) => (
                    <ExpandRow order={order} key={order.id} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
