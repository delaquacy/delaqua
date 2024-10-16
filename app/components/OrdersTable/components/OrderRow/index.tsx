import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { OrdersData } from "@/app/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { useTranslation } from "react-i18next";
import { OrderRowDisplay } from "../OrderRowDisplay";
import { OrderRowEdit } from "../OrderRowEdit";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

interface OrderRowProps {
  row: OrdersData;
  isItemSelected: boolean;
  labelId: string;
  onCopy: (event: any) => void;
}

export const OrderRow = ({
  row,
  isItemSelected,
  labelId,
  onCopy,
}: OrderRowProps) => {
  const { editOrderMode, editRowId } = useOrdersTableContext();
  const { t } = useTranslation(["orderTable", "form"]);

  const isEditing = editOrderMode && editRowId === row.id;

  const inDelivery = row?.orderStatus === "In delivery";

  const completed = row?.orderStatus
    ? row?.orderStatus === "Delivered"
    : row?.completed;

  const canceled = row?.orderStatus
    ? ["Cancelled (client)", "Cancelled (admin)", "Cancelled"].includes(
        row?.orderStatus
      )
    : row?.canceled;

  const tooltipTitle = row?.orderStatus
    ? row.orderStatus
    : completed
    ? "Delivered"
    : canceled
    ? "Cancelled"
    : inDelivery
    ? "InDelivery"
    : "InProgress";

  const paymentStatusText = Array.isArray(row.paymentStatus)
    ? row.paymentStatus
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
    <>
      {isEditing ? (
        <OrderRowEdit
          row={row}
          onCopy={onCopy}
          inDelivery={inDelivery}
          completed={completed}
          canceled={canceled}
          tooltipTitle={tooltipTitle}
          paymentStatusText={paymentStatusText}
        />
      ) : (
        <OrderRowDisplay
          row={row}
          onCopy={onCopy}
          isItemSelected={isItemSelected}
          labelId={labelId}
          inDelivery={inDelivery}
          completed={completed}
          canceled={canceled}
          tooltipTitle={tooltipTitle}
          paymentStatusText={paymentStatusText}
        />
      )}
    </>
  );
};
