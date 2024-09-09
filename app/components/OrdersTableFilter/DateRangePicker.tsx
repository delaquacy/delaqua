import { useScreenSize } from "@/app/hooks";
import { FilterItem } from "@/app/types";
import { SelectChangeEvent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

interface DateRangePickerProps {
  filter: FilterItem;
  onChange: (
    id: string,
    filterProp: string,
    event:
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | null,
    val?: string
  ) => void;
}

export const DateRangePicker = ({ filter, onChange }: DateRangePickerProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  return (
    <>
      <DatePicker
        label={t("fieldsLabel.from")}
        format="DD-MM-YYYY"
        value={filter.value1 || null}
        sx={datePickerStyle(isSmallScreen)}
        onChange={(newVal) =>
          onChange(filter.id, "value1", null, newVal as string)
        }
      />

      <DatePicker
        label={t("fieldsLabel.to")}
        format="DD-MM-YYYY"
        value={filter.value2 || null}
        sx={datePickerStyle(isSmallScreen)}
        onChange={(newVal) =>
          onChange(filter.id, "value2", null, newVal as string)
        }
      />
    </>
  );
};

export const datePickerStyle = (
  isSmallScreen: boolean,
  widthFull?: boolean
) => ({
  width: isSmallScreen ? (widthFull ? "100%" : "112px !important") : "231px",
  minWidth: isSmallScreen ? "90px !important" : "231px",
  "& .MuiFormLabel-root": {
    fontSize: isSmallScreen ? "10px" : "",
    transform: isSmallScreen ? "translate(14px, 9px) scale(1) !important" : "",
  },
  "& .MuiInputLabel-shrink": {
    fontSize: isSmallScreen ? "10px" : "",
    transform: isSmallScreen
      ? "translate(14px, -6px) scale(0.75) !important"
      : "",
  },
});
