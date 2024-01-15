import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IForm } from "@/app/lib/definitions";
import { CircularProgress } from "@mui/material";
import useUserOrders from "@/app/utils/getOrdersfromDb";

export default function OrdersList() {
  const { userOrders, loading } = useUserOrders();
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Index</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="center">Location</TableCell>
            <TableCell align="right">Pump</TableCell>
            <TableCell align="right">Bottles to buy</TableCell>
            <TableCell align="right">Bottles to return</TableCell>
            <TableCell align="right">Delivery time</TableCell>
            <TableCell align="right">Payment method</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userOrders?.map((order: IForm) => (
            <TableRow
              key={order.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {order.firstAndLast}
              </TableCell>

              <TableCell align="right">{order.phoneNumber}</TableCell>
              <TableCell align="right">{order.postalIndex}</TableCell>
              <TableCell align="right">
                {order.deliveryAddress}
              </TableCell>
              <TableCell align="right">{order.geolocation}</TableCell>
              <TableCell align="right">
                {order.pump ? "да" : "нет"}
              </TableCell>
              <TableCell align="right">
                {order.bottlesNumberToBuy}
              </TableCell>
              <TableCell align="right">
                {order.bottlesNumberToReturn}
              </TableCell>
              <TableCell align="right">
                {" "}
                {order.deliveryTime}
              </TableCell>
              <TableCell align="right">
                {order.paymentMethod}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
