import { USER_INVOICES_HEAD } from "@/app/constants/UserInvoicesTable";
import { OrdersData } from "@/app/types";
import { ContentCopy } from "@mui/icons-material";
import { Box, Button, TableCell, TableRow } from "@mui/material";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

interface InvoiceTableRowProps {
  handleClick: (event: any, id: string) => void;
  row: any;
  order: OrdersData | null;
  isItemSelected: boolean;
  labelId: string;
  onCopy: (event: any) => void;
}

export const InvoiceTableRow = ({
  handleClick,
  row,
  order,
  isItemSelected,
  labelId,
  onCopy,
}: InvoiceTableRowProps) => {
  const GeneratePdf = dynamic(() => import("../../../InvoiceGenerator"), {
    ssr: false,
  });

  const { t } = useTranslation(["orderTable", "form"]);

  const paymentStatusText = Array.isArray(order?.paymentStatus)
    ? order?.paymentStatus
        .map((status) =>
          t(`paymentStatuses.${status.toLowerCase().replace(/\s+/g, "_")}`)
        )
        .join(", ")
    : typeof row.paymentStatus === "string"
    ? t(
        `paymentStatuses.${row.paymentStatus
          .toLowerCase()
          .replace(/\s+/g, "_")}`
      )
    : t("paymentStatuses.unpaid");

  return (
    <TableRow
      role="checkbox"
      aria-checked={isItemSelected}
      selected={isItemSelected}
      sx={{
        cursor: "pointer",
        transition: "all, 0.3s",
        "&.Mui-selected": {
          background: "#D1E3F6",
          "&:hover": {
            background: "#E8F1FA",
          },
        },
        ":hover": {
          background: !row.completed && !row.expire ? "#E8F1FA" : "",
        },
      }}
    >
      {USER_INVOICES_HEAD.map(({ key }, index) => (
        <TableCell
          key={index}
          sx={{
            textAlign: "center",
            borderRight:
              index !== USER_INVOICES_HEAD.length - 1
                ? "solid 1px rgba(38, 40, 82, 0.1)"
                : "",
          }}
        >
          {key === "paymentStatus"
            ? order && paymentStatusText
            : key === "addressType"
            ? row[key] || "Home"
            : row[key]}
        </TableCell>
      ))}
      <TableCell align="center">
        <Button onClick={onCopy}>
          <ContentCopy
            sx={{
              color: "#4788C7",
            }}
          />
        </Button>
      </TableCell>
      <TableCell align="center">
        {!!order ? (
          <GeneratePdf order={order} />
        ) : (
          <Box
            sx={{
              width: "42px",
              height: "42px",
            }}
          ></Box>
        )}
      </TableCell>
    </TableRow>
  );
};
