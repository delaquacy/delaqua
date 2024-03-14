import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IForm } from "@/app/lib/definitions";
import { CircularProgress } from "@mui/material";
import useGetOrdersFromDb from "@/app/utils/getOrdersfromDb";

export default function OrdersList() {
  const { orders, loading } = useGetOrdersFromDb();

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center">Index</TableCell>
            <TableCell align="center">Address</TableCell>

            <TableCell align="center">Pump</TableCell>
            <TableCell align="center">Bottles to buy</TableCell>
            <TableCell align="center">Bottles to return</TableCell>
            <TableCell align="center">Delivery time</TableCell>
            <TableCell align="center">Payment method</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} align="center">
                Еще нет заказов
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order: IForm) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">
                  {order.phoneNumber}
                </TableCell>
                <TableCell align="center">
                  {order.postalIndex}
                </TableCell>
                <TableCell align="center">
                  {order.deliveryAddress}
                </TableCell>

                <TableCell align="center">
                  {order.pump ? "да" : null}
                </TableCell>
                <TableCell align="center">
                  {order.bottlesNumberToBuy}
                </TableCell>
                <TableCell align="center">
                  {order.bottlesNumberToReturn}
                </TableCell>
                <TableCell align="center">
                  {" "}
                  {order.deliveryTime}
                </TableCell>
                <TableCell align="center">
                  {order.paymentMethod}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
