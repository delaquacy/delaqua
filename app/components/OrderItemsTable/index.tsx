import { ORDER_DETAILS_HEAD } from "@/app/constants/OrderDetailsHead";
import { RENT_BOTTLE_ID } from "@/app/constants/OrderItemsIds";
import { useScreenSize } from "@/app/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface OrderItemsTableProps {
  orderItems: any[];
  totalPayments: string;
}

export const OrderItemsTable = ({
  orderItems,
  totalPayments,
}: OrderItemsTableProps) => {
  const { t } = useTranslation("form");
  const { isSmallScreen } = useScreenSize();

  return (
    <Table
      size="small"
      sx={{
        padding: "20px",
      }}
    >
      <TableHead>
        <TableRow sx={{}}>
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
              {t(`${order.key}`)}
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
                  padding="none"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.count}
                </TableCell>
                <TableCell
                  align="center"
                  padding="none"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {order.sellPrice}
                </TableCell>
                <TableCell
                  align="center"
                  padding="none"
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
          <TableCell colSpan={isSmallScreen ? 1 : 3} padding="none" />
          <TableCell
            colSpan={isSmallScreen ? 2 : 1}
            align="center"
            padding="none"
            sx={{
              fontWeight: 600,
            }}
          >
            {t("total")}
          </TableCell>

          <TableCell
            colSpan={isSmallScreen ? 2 : 1}
            align="center"
            padding="none"
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
