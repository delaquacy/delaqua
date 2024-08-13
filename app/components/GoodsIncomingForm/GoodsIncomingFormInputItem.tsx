import { Box, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FormValues } from ".";
import { useScreenSize } from "@/app/hooks";

interface GoodsIncomingFormItemProps {
  name: any;
  control: Control<any>;
  type: string;
  label: string;
  error: boolean;
  helperText: string;
  sx?: any;
}

export const GoodsIncomingFormInputItem = ({
  name,
  control,
  type,
  label,
  error,
  helperText,
  sx = {},
}: GoodsIncomingFormItemProps) => {
  const { isSmallScreen } = useScreenSize();

  return (
    <Box display="flex" flexDirection="column" sx={{ ...sx }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="info"
            type={type}
            label={label}
            size={isSmallScreen ? "small" : "medium"}
            variant="outlined"
            error={error}
            helperText={helperText}
          />
        )}
      />
      {!helperText && (
        <Box
          sx={{
            height: "23px",
          }}
        ></Box>
      )}
    </Box>
  );
};
