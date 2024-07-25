"use client";
import { useState } from "react";
import Headers from "../Headers/Headers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useUserContext } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { OrdersData } from "@/app/types";

export default function WrapperHeader() {
  const [showWindow, setShowWindow] = useState<boolean>(false);

  const { unpaidOrders } = useUserContext();
  const { t } = useTranslation("orderTable");

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
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Bottles to buy / to return / pump
                    </TableCell>
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
                    <TableRow key={order.id}>
                      <TableCell align="center">
                        {`${order.bottlesNumberToBuy} / ${order.bottlesNumberToReturn} / ${order.pump}`}
                      </TableCell>
                      <TableCell align="center">{`${order.deliveryDate}, ${order.deliveryTime}`}</TableCell>
                      <TableCell align="center">
                        {order.totalPayments}
                      </TableCell>

                      <TableCell align="center">
                        {order.paymentStatus}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ":hover": {
                            color: "#1565c0",
                            textDecoration: "underline",
                            textUnderlineOffset: 2,
                          },
                        }}
                      >
                        <Link href={order.paymentLink as string}>
                          {order.paymentLink}
                        </Link>
                      </TableCell>
                    </TableRow>
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
