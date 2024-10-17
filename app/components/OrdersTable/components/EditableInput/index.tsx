import { TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface EditableInputProps {
  fieldName: string;
  control: Control<any>;
  type?: string;
  onCountChange: () => void;
}

const EditableInput = ({
  fieldName,
  control,
  type = "text",
  onCountChange,
}: EditableInputProps) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          size="small"
          type={type}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              field.onChange("");
              return;
            }

            const numberValue = parseInt(value, 10);
            const finalValue =
              isNaN(numberValue) || numberValue < 0 ? 0 : numberValue;

            field.onChange(finalValue);
            onCountChange();
          }}
          InputProps={{
            inputProps: {
              style: {
                MozAppearance: "textfield",
              },
              sx: {
                "&::-webkit-inner-spin-button": {
                  marginRight: "-10px",
                },
                "&::-webkit-outer-spin-button": {
                  marginRight: "-10px",
                },
              },
            },
          }}
          sx={{
            width: "60px",
          }}
        />
      )}
    />
  );
};

export default EditableInput;
