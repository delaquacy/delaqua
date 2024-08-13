import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";

interface SelectItemProps {
  value: string;
  id: string;
  onChange: (id: string, value: string, field: string) => void;
  label: string;
  values: { value: string; label?: string }[] | string[];
}

const SelectItem = ({
  value,
  id,
  onChange,
  label,
  values,
}: SelectItemProps) => {
  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(id, event.target.value as string, "itemName");
  };

  return (
    <FormControl sx={{ minWidth: 177, flex: 2 }}>
      <InputLabel size={isSmallScreen ? "small" : "normal"}>
        {t(label)}
      </InputLabel>

      <Select
        label={t(label)}
        size={isSmallScreen ? "small" : "medium"}
        value={value}
        onChange={handleChange}
        sx={selectStyle(isSmallScreen)}
      >
        {values.map((option) => (
          <MenuItem
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
            sx={menuItemStyle(isSmallScreen)}
          >
            {typeof option === "string"
              ? option
              : option.label
              ? t(option.label)
              : option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const selectStyle = (isSmallScreen: boolean) => ({
  fontSize: isSmallScreen ? "12px" : "",
  "& .MuiSelect-select": {
    padding: isSmallScreen ? "13px 14px" : "18px 14px",
  },
});

const menuItemStyle = (isSmallScreen: boolean) => ({
  fontSize: isSmallScreen ? "11px" : "",
  minHeight: isSmallScreen ? "40px" : "",
});

export default SelectItem;
