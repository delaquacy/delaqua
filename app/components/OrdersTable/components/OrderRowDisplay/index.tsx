import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { useScreenSize } from "@/app/hooks";
import { CombinedItem, OrdersData } from "@/app/types";
import { getPompsCount } from "@/app/utils";
import { findBottlesByCode } from "@/app/utils/findBottlesByCode";
import {
  CancelOutlined,
  CheckCircle,
  ContentCopy,
  Edit,
  HourglassBottom,
  LocalShipping,
} from "@mui/icons-material";
import { Button, Checkbox, TableRow, Tooltip } from "@mui/material";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StandardTableCell, StickyTableCell } from "../../styled";

interface OrderRowDisplayProps {
  row: OrdersData;
  isItemSelected: boolean;
  labelId: string;
  onCopy: (event: any) => void;
  inDelivery: boolean;
  completed: boolean;
  canceled: boolean;
  tooltipTitle: string;
  paymentStatusText: string;
}

export const OrderRowDisplay = ({
  row,
  isItemSelected,
  labelId,
  onCopy,
  inDelivery,
  completed,
  canceled,
  tooltipTitle,
  paymentStatusText,
}: OrderRowDisplayProps) => {
  const { editOrderMode, handleClick, toggleEditMode } =
    useOrdersTableContext();
  const { isSmallScreen } = useScreenSize();
  const { t } = useTranslation(["orderTable", "form"]);

  const { bigBottle, middleBottle, smallBottle } = useMemo(() => {
    return findBottlesByCode(row.items) as Record<
      string,
      CombinedItem | undefined
    >;
  }, [row.items]);

  const fullAddress = [row.postalIndex, row.deliveryAddress, row.addressDetails]
    .filter(Boolean)
    .join(", ");

  isItemSelected && console.log(row);

  const getBackgroundColor = () => {
    if (completed) return "#EAF4EA";
    if (canceled) return "#FFE5E5";
    if (inDelivery) return "#E8DFF1";
    return "#fff";
  };

  return (
    <TableRow
      onClick={() => !editOrderMode && handleClick(row.id as string)}
      role="checkbox"
      tabIndex={-1}
      key={row.id as string}
      aria-checked={isItemSelected}
      selected={isItemSelected}
      sx={{
        cursor: "pointer",
        background: getBackgroundColor(),

        "&.Mui-selected": {
          background: "#D1E3F6",
          "&:hover": {
            background: "#E8F1FA",
          },
        },

        "&:hover": {
          background:
            completed || canceled || inDelivery ? "#D1E3F6" : "#F0F0F0",
        },
      }}
    >
      <StickyTableCell left={0}>
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </StickyTableCell>

      <StickyTableCell left={74}>{row.userId || row.useId}</StickyTableCell>

      <StickyTableCell left={154}>{row.phoneNumber}</StickyTableCell>

      <StickyTableCell
        left={289}
        sx={{
          borderRight: "solid 1px rgba(38, 40, 82, 0.1)",
        }}
      >
        {row.firstAndLast}
      </StickyTableCell>

      <StandardTableCell>
        {bigBottle?.count || row.bottlesNumberToBuy || "-"}
      </StandardTableCell>

      <StandardTableCell>{row.bottlesNumberToReturn || 0}</StandardTableCell>

      <StandardTableCell>{middleBottle?.count || "-"}</StandardTableCell>

      <StandardTableCell>{smallBottle?.count || "-"}</StandardTableCell>

      <StandardTableCell>
        {(row?.items && getPompsCount(row.items)) || "no"}
      </StandardTableCell>

      <StandardTableCell>
        <Link
          target="new_blanc"
          href={row.geolocation as string}
          onClick={(event) => event.stopPropagation()}
        >
          {fullAddress}
        </Link>
      </StandardTableCell>

      <StandardTableCell>{row.deliveryDate}</StandardTableCell>

      <StandardTableCell>{row.deliveryTime}</StandardTableCell>

      <StandardTableCell>{row.totalPayments}</StandardTableCell>

      <StandardTableCell>{paymentStatusText}</StandardTableCell>

      <StandardTableCell>{row.comments || "-"}</StandardTableCell>
      <StandardTableCell>{row.createdAt}</StandardTableCell>

      <StandardTableCell>
        <Tooltip title={tooltipTitle}>
          {inDelivery ? (
            <LocalShipping
              sx={{
                color: "#453B4D",
              }}
            />
          ) : canceled ? (
            <CancelOutlined sx={{ color: "red" }} />
          ) : completed ? (
            <CheckCircle sx={{ color: "green" }} />
          ) : (
            <HourglassBottom sx={{ color: "#1976d2" }} />
          )}
        </Tooltip>
      </StandardTableCell>

      <StandardTableCell>{row?.courierComment || "-"}</StandardTableCell>

      <StandardTableCell>
        <Button onClick={onCopy}>
          <ContentCopy
            sx={{
              color: "#4788C7",
            }}
          />
        </Button>
      </StandardTableCell>

      <StandardTableCell>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleEditMode(row.id);
          }}
        >
          <Edit sx={{ color: "#4788C7" }} />
        </Button>
      </StandardTableCell>
    </TableRow>
  );
};
