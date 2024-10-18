import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { OrdersData } from "@/app/types";
import { getOrderInfo } from "@/app/utils";
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

  const { inDelivery, completed, canceled, tooltipTitle, paymentStatusText } =
    getOrderInfo(row, t);

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
