import { useScreenSize } from "@/app/hooks";
import { FilterItem } from "@/app/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

interface SelectFilterProps {
  filter: FilterItem;
  filterProp: string;

  onChange: (
    id: string,
    filterProp: string,
    event:
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | null,
    val?: string
  ) => void;
  label: string;
  values: { value: string; label?: string }[] | string[];
}

const SelectFilter = ({
  filter,
  onChange,
  label,
  values,
  filterProp,
}: SelectFilterProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  return (
    <FormControl sx={{ m: 1, minWidth: 177 }}>
      <InputLabel size={isSmallScreen ? "small" : "normal"}>
        {t(label)}
      </InputLabel>

      <Select
        label={t(label)}
        size={isSmallScreen ? "small" : "medium"}
        value={filter[filterProp as keyof FilterItem]}
        sx={selectStyle(isSmallScreen)}
        onChange={(event) => onChange(filter.id, filterProp, event)}
      >
        {values.map((value) => (
          <MenuItem
            key={typeof value === "string" ? value : value.value}
            value={typeof value === "string" ? value : value.value}
            sx={menuItemStyle(isSmallScreen)}
          >
            {typeof value === "string"
              ? value
              : value.label
              ? t(value.label)
              : value.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const selectStyle = (isSmallScreen: boolean) => ({
  fontSize: isSmallScreen ? "10px" : "",
  width: isSmallScreen ? "200px !important" : "231px",
});

const menuItemStyle = (isSmallScreen: boolean) => ({
  fontSize: isSmallScreen ? "11px" : "",
  minHeight: isSmallScreen ? "40px" : "",
});

export default SelectFilter;
