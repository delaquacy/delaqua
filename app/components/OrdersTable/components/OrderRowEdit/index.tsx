import { BOTTLE_CODES } from "@/app/constants/BottleCodes";
import { POMP_CODES_MAX } from "@/app/constants/pompMaxCode";
import {
  UserOrderItem,
  useOrderDetailsContext,
} from "@/app/contexts/OrderDetailsContext";
import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { useScreenSize, useToast } from "@/app/hooks";
import { OrderService } from "@/app/lib/OrderService";
import { UserService } from "@/app/lib/UserService";
import { Address, CombinedItem, OrdersData } from "@/app/types";
import {
  calculateItemSumWithBigBottlePrice,
  datePickerStyle,
  dayOfWeekFormatter,
  findBottlesByCode,
  getPompsCount,
} from "@/app/utils";

import {
  Cancel,
  CancelOutlined,
  CheckCircle,
  ContentCopy,
  HourglassBottom,
  LocalShipping,
  Save,
} from "@mui/icons-material";
import { Box, Button, Checkbox, TableRow, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StandardTableCell, StickyTableCell } from "../../styled";
import { EditAddressModal } from "../EditAddressModal";
import { EditPompsModal } from "../EditPompsModal";
import EditableInput from "../EditableInput";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

interface OrderRowProps {
  row: OrdersData;
  onCopy: (event: any) => void;
  inDelivery: boolean;
  completed: boolean;
  canceled: boolean;
  tooltipTitle: string;
  paymentStatusText: string;
}

export const OrderRowEdit = ({
  row,
  onCopy,
  inDelivery,
  completed,
  canceled,
  tooltipTitle,
  paymentStatusText,
}: OrderRowProps) => {
  const { defaultItems } = useOrderDetailsContext();
  const { toggleEditMode, editOrderMode, editRowId } = useOrdersTableContext();

  const { isSmallScreen } = useScreenSize();
  const { t } = useTranslation(["orderTable", "form"]);

  const { showSuccessToast, showErrorToast } = useToast();

  const [pompFields, setPompFields] = useState<any[]>();
  const [addressFields, setAddressFields] = useState<Address>();
  const [openPompsModal, setOpenPompsModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const isEditing = editOrderMode && editRowId === row.id;

  const rowItems = defaultItems.map((item) => {
    const rowItem = row.items?.find(({ id }) => id === item.id);
    return rowItem || item;
  });

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      ...row,
      items: rowItems,
    },
  });

  const items = watch("items");
  const address = watch("deliveryAddressObj");
  const total = watch("totalPayments");
  const bottlesToReturn = watch("bottlesNumberToReturn");

  const getItemIndex = (id?: string) =>
    rowItems.findIndex((item) => item.id === id);

  const handleCountChange = () => {
    if (!items) return;

    const updatedItems = items.map(
      (item) => calculateItemSumWithBigBottlePrice(item, false) //set isFirstOrder false
    );

    const bigBottleCount = updatedItems.find(
      (item) => +item.id === +BOTTLE_CODES.bigBottle
    )?.count;

    const afterReturnCalc = updatedItems.map((item) => {
      const isRent = +item.id === +BOTTLE_CODES.bigBottleRent;

      if (!isRent) return item;

      const rentCount = Math.max(+(bigBottleCount || "") - +bottlesToReturn, 0);

      return {
        ...item,
        count: rentCount,
        sum: rentCount * +item.sellPrice,
      };
    });

    const total = afterReturnCalc.reduce((acc: number, item: any) => {
      console.log(item, "IT");
      return acc + parseFloat(item.sum || 0);
    }, 0);

    setValue("items", updatedItems);
    setValue("totalPayments", total);
  };

  const { bigBottle, middleBottle, smallBottle } = useMemo(() => {
    return findBottlesByCode(rowItems) as Record<
      string,
      CombinedItem | undefined
    >;
  }, [rowItems]);

  const onSubmit = async (data: any) => {
    const { bigBottle } = findBottlesByCode(data.items);

    const numberOfBottles =
      Math.max(data.numberOfBottles - +data.bottlesNumberToReturn, 0) +
      +((bigBottle as UserOrderItem)?.count || "0");

    if ((bigBottle as UserOrderItem)?.count) {
      const userDbId = await UserService.getUserIdByUserNumber(data.userId);
      userDbId
        ? await OrderService.updateAddressWithBottles(
            userDbId,
            row.deliveryAddressObj.id,
            numberOfBottles
          )
        : showErrorToast("There are no users with this user number");
    }

    const editedOrderData = {
      ...data,
      editedAt: dayjs().format("DD.MM.YYYY HH:mm"),
      numberOfBottles,
      deliveryAddressObj: { ...data.deliveryAddressObj, numberOfBottles },
    };

    await OrderService.updateEditedOrder(editedOrderData);
    showSuccessToast("The order was successfully updated");
    toggleEditMode(row.id);
    reset();
  };

  const editFullAddress =
    address &&
    [address?.postalIndex, address?.deliveryAddress, address?.addressDetails]
      .filter(Boolean)
      .join(", ");

  useEffect(() => {
    handleCountChange();
  }, [bottlesToReturn]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TableRow
          tabIndex={-1}
          key={row.id as string}
          sx={{
            cursor: "pointer",
            transition: "all, 0.3s",
            background: "#E0E1E6",
          }}
        >
          <StickyTableCell left={0}>
            <Checkbox color="primary" />
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
            <EditableInput
              fieldName={`items.${getItemIndex(bigBottle?.id)}.count`}
              control={control}
              type="number"
              onCountChange={handleCountChange}
            />
          </StandardTableCell>

          <StandardTableCell>
            <EditableInput
              fieldName={`bottlesNumberToReturn`}
              control={control}
              type="number"
              onCountChange={() => {}}
            />
          </StandardTableCell>

          <StandardTableCell>
            <EditableInput
              fieldName={`items.${getItemIndex(middleBottle?.id)}.count`}
              control={control}
              type="number"
              onCountChange={handleCountChange}
            />
          </StandardTableCell>

          <StandardTableCell>
            <EditableInput
              fieldName={`items.${getItemIndex(smallBottle?.id)}.count`}
              control={control}
              type="number"
              onCountChange={handleCountChange}
            />
          </StandardTableCell>

          <StandardTableCell
            onClick={(e) => {
              if (isEditing) {
                e.stopPropagation();
                setOpenPompsModal(true);
                setPompFields(
                  rowItems.filter((item) => +item.itemCode <= +POMP_CODES_MAX)
                );
              }
              return;
            }}
          >
            {(items && getPompsCount(items)?.trim().split(" ").join(", ")) ||
              "no"}
          </StandardTableCell>

          <StandardTableCell
            padding="none"
            onClick={(e) => {
              if (isEditing) {
                e.stopPropagation();
                setOpenAddressModal(true);
                setAddressFields(row.deliveryAddressObj);
              }
              return;
            }}
          >
            <Box
              paddingBlock={2}
              sx={{
                transition: "all 0.3s",
                ":hover": {
                  color: !isEditing ? "#4788C7" : "inherit",
                  textDecoration: !isEditing ? "underline" : "none",
                  textUnderlineOffset: !isEditing ? "2px" : "none",
                },
              }}
            >
              {editFullAddress}
            </Box>
          </StandardTableCell>

          <StandardTableCell>
            <Controller
              name="deliveryDate"
              control={control}
              render={({ field }) => (
                <Box>
                  <DatePicker
                    label={t("delivery_date_short", { ns: "form" })}
                    format="DD-MM-YYYY"
                    disablePast
                    value={dayjs(field.value, "DD.MM.YYYY") as Dayjs}
                    onChange={(newVal) => field.onChange(newVal)}
                    dayOfWeekFormatter={dayOfWeekFormatter}
                    sx={datePickerStyle(isSmallScreen, true)}
                  />
                </Box>
              )}
            />
          </StandardTableCell>

          <StandardTableCell>{row.deliveryTime}</StandardTableCell>

          <StandardTableCell>{total}</StandardTableCell>

          <StandardTableCell>{paymentStatusText}</StandardTableCell>

          <StandardTableCell padding="none">
            {row.comments || "-"}
          </StandardTableCell>

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

          <StandardTableCell>
            {row?.courierComment ? row?.courierComment : "-"}
          </StandardTableCell>

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
            <>
              <Button onClick={handleSubmit(onSubmit)}>
                <Save />
              </Button>

              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleEditMode(row.id);
                  reset();
                }}
              >
                <Cancel />
              </Button>
            </>
          </StandardTableCell>
        </TableRow>
        {openPompsModal && (
          <EditPompsModal
            open={openPompsModal}
            editFields={pompFields}
            getItemIndex={getItemIndex}
            control={control}
            reset={reset}
            onClose={() => setOpenPompsModal(false)}
            onCountChange={handleCountChange}
          />
        )}
        {openAddressModal && (
          <EditAddressModal
            open={openAddressModal}
            editFields={addressFields}
            getItemIndex={getItemIndex}
            control={control}
            reset={reset}
            onClose={() => setOpenAddressModal(false)}
          />
        )}
      </LocalizationProvider>
    </>
  );
};
