"use client";
import {
  DELIVERY_TIMES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/app/constants/TableFilterFieldsValues";
import { TableHeadCells } from "@/app/constants/TableHeadCells";
import { useScreenSize } from "@/app/hooks";
import { useToast } from "@/app/hooks/useToast";
import { FilterItem } from "@/app/types";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "./DateRangePicker";
import SelectFilter from "./SelectFilter";

interface OrdersTableFilterProps {
  filters: FilterItem[];
  onFilterChange: Dispatch<SetStateAction<FilterItem[]>>;
}

export const OrdersTableFilter = ({
  filters,
  onFilterChange,
}: OrdersTableFilterProps) => {
  const { t } = useTranslation("orderTable");
  const { showErrorToast } = useToast();
  const { isSmallScreen } = useScreenSize();

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

  return (
    <>
      {filters.map((filter) => (
        <MenuItem key={filter.id} sx={menuItemStyle(isSmallScreen)}>
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
                width: isSmallScreen ? "20px" : "50px",
                height: isSmallScreen ? "20px" : "50px",
              }}
            >
              <DeleteIcon
                fontSize={isSmallScreen ? "small" : "medium"}
                sx={{
                  color: filter.column === "" ? "gray" : "#990000",
                }}
              />
            </Tooltip>

            <SelectFilter
              filter={filter}
              filterProp={"column"}
              onChange={handleFilterFieldsChange}
              label="fieldsLabel.columns"
              values={filteredColumns as string[]}
            />

            {filter.column !== "Delivery Date" && (
              <Button
                variant="contained"
                size={isSmallScreen ? "small" : "medium"}
                sx={buttonStyle(isSmallScreen)}
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
                <DateRangePicker
                  filter={filter}
                  onChange={handleFilterFieldsChange}
                />
              )}

              {filter.column === "Payment Status" && (
                <SelectFilter
                  filter={filter}
                  filterProp={"value1"}
                  onChange={handleFilterFieldsChange}
                  label="fieldsLabel.paymentStatus"
                  values={PAYMENT_STATUSES}
                />
              )}

              {filter.column === "Delivery Time" && (
                <SelectFilter
                  filter={filter}
                  filterProp={"value1"}
                  onChange={handleFilterFieldsChange}
                  label="fieldsLabel.deliveryTime"
                  values={DELIVERY_TIMES}
                />
              )}

              {filter.column === "Order Status" && (
                <SelectFilter
                  filter={filter}
                  filterProp={"value1"}
                  onChange={handleFilterFieldsChange}
                  label="fieldsLabel.orderStatus"
                  values={ORDER_STATUSES}
                />
              )}

              {(filter.column === "Phone Number" ||
                filter.column === "Client ID" ||
                filter.column === "") && (
                <TextField
                  id="value-input"
                  label={t("fieldsLabel.value")}
                  sx={{
                    "& .MuiInputBase-root ": {
                      width: isSmallScreen ? "200px !important" : "231px",
                    },
                  }}
                  size={isSmallScreen ? "small" : "medium"}
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

const menuItemStyle = (isSmallScreen: boolean) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",

  "& .MuiSelect-select": {
    paddingRight: isSmallScreen ? "17px !important" : "",
    paddingLeft: isSmallScreen ? "10px !important" : "",
    fontSize: isSmallScreen ? "10px" : "",
  },

  "& .MuiFormLabel-root": {
    fontSize: isSmallScreen ? "10px" : "",
  },

  "& .MuiInputBase-root": {
    height: isSmallScreen ? "31px" : "56px",
    fontSize: isSmallScreen ? "10px" : "",
  },
});

const buttonStyle = (isSmallScreen: boolean) => ({
  boxShadow: "none",
  padding: isSmallScreen ? 0 : 1,
  background: "inherit",
  color: "#777777",
  height: isSmallScreen ? "31px" : "56px",
  border: "1px solid rgba(118, 118, 118, 0.5)",
  textTransform: "none",
  fontSize: isSmallScreen ? "10px" : "",
  marginInline: isSmallScreen ? 0 : "8px",
  display: isSmallScreen ? "block" : "flex",
  minWidth: isSmallScreen ? "35px" : "",
  width: isSmallScreen ? 40 : 231,
  ":hover": {
    background: "inherit",
    color: "inherit",
    boxShadow: "none",
  },
});
