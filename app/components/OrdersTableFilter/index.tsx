"use client";
import { TableHeadCells } from "@/app/constants/TableHeadCells";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  SelectChangeEvent,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { FilterItem } from "../OrdersTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "@/app/hooks/useToast";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface OrdersTableFilterProps {
  filters: FilterItem[];
  onFilterChange: Dispatch<SetStateAction<FilterItem[]>>;
}

export const OrdersTableFilter = ({
  filters,
  onFilterChange,
}: OrdersTableFilterProps) => {
  const { showErrorToast } = useToast();
  const { t } = useTranslation("orderTable");

  const handleFilterFieldsChange = (
    id: string,
    filterProp: string,
    event:
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | null,
    val?: string
  ) => {
    if (filterProp === "column") {
      const isColumnExist = filters.findIndex(
        (filter) => filter.column === event?.target.value
      );

      if (isColumnExist !== -1) {
        showErrorToast("This field is already selected");
        return;
      }
    }

    const updatedFilters = filters.map((filter) =>
      filter.id === id
        ? { ...filter, [filterProp]: event?.target.value || val }
        : filter
    );
    onFilterChange(updatedFilters);
  };

  const handleRemoveFilter = (id: string, column: string) => {
    if (!column) return;

    onFilterChange((prev) => {
      const filtered = prev.filter((filter) => filter.id !== id);

      return filtered.length > 1
        ? filtered
        : [
            {
              id: `${Date.now()}`,
              column: "",
              operator: "",
              value1: "",
            },
          ];
    });
  };

  const filteredColumns = TableHeadCells.filter((cell) => cell.columns).map(
    (cell) => cell.columns
  );

  const paymentStatus = [
    { value: "CASH", label: "paymentStatus.cash" },
    { value: "Unpaid", label: "paymentStatus.unpaid" },
    { value: "COMPLETED", label: "paymentStatus.completed" },
  ];
  const orderStatus = [
    { value: "progress", label: "orderStatus.progress" },
    { value: "completed", label: "orderStatus.completed" },
    { value: "canceled", label: "orderStatus.canceled" },
  ];
  const deliveryTime = [{ value: "9 - 17" }, { value: "9 - 12" }];

  return (
    <>
      {filters.map((filter) => (
        <MenuItem
          key={filter.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            key={filter.id}
          >
            <Tooltip
              title={t("removeFilter")}
              onClick={() => handleRemoveFilter(filter.id, filter.column)}
              sx={{
                width: "50px",
                height: "50px",
              }}
            >
              <DeleteIcon
                sx={{
                  color: filter.column === "" ? "gray" : "#990000",
                }}
              />
            </Tooltip>
            <FormControl sx={{ m: 1, minWidth: 177 }}>
              <InputLabel>{t("fieldsLabel.columns")}</InputLabel>
              <Select
                label={t("fieldsLabel.columns")}
                labelId="columns-select-label"
                id="columns-select"
                value={filter.column}
                onChange={(event) =>
                  handleFilterFieldsChange(filter.id, "column", event)
                }
              >
                {filteredColumns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {t(`${column}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {filter.column !== "Delivery Date" && (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  minWidth: 231,
                  marginInline: "8px",
                  background: "inherit",
                  color: "#777777",
                  height: "56px",
                  border: "1px solid rgba(118, 118, 118, 0.5)",
                  textTransform: "none",
                  fontSize: "medium",

                  ":hover": {
                    background: "inherit",
                    color: "inherit",
                    boxShadow: "none",
                  },
                }}
              >
                {t("fieldsLabel.equal")}
              </Button>
            )}

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, minWidth: 231 },
              }}
              noValidate
            >
              {filter.column === "Delivery Date" && (
                <>
                  <DatePicker
                    label={t("fieldsLabel.from")}
                    value={filter.value1 || null}
                    onChange={(newVal) =>
                      handleFilterFieldsChange(
                        filter.id,
                        "value1",
                        null,
                        newVal as string
                      )
                    }
                  />
                  <DatePicker
                    label={t("fieldsLabel.to")}
                    value={filter.value2 || null}
                    onChange={(newVal) =>
                      handleFilterFieldsChange(
                        filter.id,
                        "value2",
                        null,
                        newVal as string
                      )
                    }
                  />
                </>
              )}
              {filter.column === "Payment Status" && (
                <FormControl sx={{ m: 1, minWidth: 177 }}>
                  <InputLabel>{t("fieldsLabel.paymentStatus")}</InputLabel>
                  <Select
                    label={t("fieldsLabel.paymentStatus")}
                    labelId="columns-select-label"
                    id="columns-select"
                    value={filter.value1}
                    onChange={(event) => {
                      handleFilterFieldsChange(filter.id, "value1", event);
                    }}
                  >
                    {paymentStatus.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {t(`${status.label}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filter.column === "Delivery Time" && (
                <FormControl sx={{ m: 1, minWidth: 177 }}>
                  <InputLabel>{t("fieldsLabel.deliveryTime")}</InputLabel>
                  <Select
                    label={t("fieldsLabel.deliveryTime")}
                    labelId="columns-select-label"
                    id="columns-select"
                    value={filter.value1}
                    onChange={(event) => {
                      console.log(event.target);
                      handleFilterFieldsChange(filter.id, "value1", event);
                    }}
                  >
                    {deliveryTime.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filter.column === "Order Status" && (
                <FormControl sx={{ m: 1, minWidth: 177 }}>
                  <InputLabel>{t("fieldsLabel.orderStatus")}</InputLabel>
                  <Select
                    label={t("fieldsLabel.orderStatus")}
                    labelId="columns-select-label"
                    id="columns-select"
                    value={filter.value1}
                    onChange={(event) => {
                      console.log(event.target);
                      handleFilterFieldsChange(filter.id, "value1", event);
                    }}
                  >
                    {orderStatus.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {t(`${status.label}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {(filter.column === "Phone Number" || filter.column === "") && (
                <TextField
                  id="value-input"
                  label={t("fieldsLabel.value")}
                  variant="outlined"
                  value={filter.value1}
                  onChange={(event) =>
                    handleFilterFieldsChange(filter.id, "value1", event)
                  }
                />
              )}
            </Box>
          </Box>
        </MenuItem>
      ))}
    </>
  );
};
