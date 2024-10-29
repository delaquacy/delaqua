import { useScreenSize } from "@/app/hooks";
import { FilterItem } from "@/app/types";
import { datePickerStyle } from "@/app/utils";
import { SelectChangeEvent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

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
  notUseSmallScreen?: boolean;
}

export const DateRangePicker = ({
  filter,
  onChange,
  notUseSmallScreen,
}: DateRangePickerProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  return (
    <>
      <DatePicker
        label={t("fieldsLabel.from")}
        format="DD-MM-YYYY"
        value={filter.value1 || null}
        sx={notUseSmallScreen ? null : datePickerStyle(isSmallScreen)}
        onChange={(newVal) =>
          onChange(filter.id, "value1", null, newVal as string)
        }
      />

      <DatePicker
        label={t("fieldsLabel.to")}
        format="DD-MM-YYYY"
        value={filter.value2 || null}
        sx={notUseSmallScreen ? null : datePickerStyle(isSmallScreen)}
        onChange={(newVal) =>
          onChange(filter.id, "value2", null, newVal as string)
        }
      />
    </>
  );
};
