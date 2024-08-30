import { ORDER_DETAILS_HEAD } from "@/app/constants/OrderDetailsHead";
import { RENT_BOTTLE_ID } from "@/app/constants/OrderItemsIds";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

interface OrderItemsTableProps {
  orderItems: any[];
  totalPayments: string;
}

export const OrderItemsTable = ({
  orderItems,
  totalPayments,
}: OrderItemsTableProps) => {
  console.log(orderItems);
  return (
    <Table
      size="small"
      sx={{
        padding: "20px",
      }}
    >
      <TableHead>
        <TableRow>
          {ORDER_DETAILS_HEAD.map((order, index) => (
            <TableCell
              key={index}
              scope="row"
              padding="none"
              variant="head"
              align="center"
              sx={{
                fontWeight: "bold",
                borderRight:
                  index < ORDER_DETAILS_HEAD.length - 1
                    ? "1px solid #ddd"
                    : "none",
              }}
            >
              {order.value}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {(
          [...orderItems].sort(
            (itemA, itemB) => +itemA.itemCode - +itemB.itemCode
          ) || []
        )
          .filter(({ count }) => !!+count)
          .map((order, index) => (
            <Tooltip
              key={index}
              title={
                order.itemCode === RENT_BOTTLE_ID
                  ? "Deposit for additional bottles"
                  : ""
              }
            >
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.id}
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.name}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.count}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.sellPrice}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.sum}
                </TableCell>
              </TableRow>
            </Tooltip>
          ))}
        <TableRow>
          <TableCell colSpan={3} />
          <TableCell
            colSpan={1}
            align="center"
            sx={{
              fontWeight: 600,
            }}
          >
            Total
          </TableCell>
          <TableCell
            align="center"
            sx={{
              fontWeight: 600,
            }}
          >
            {totalPayments} €
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
