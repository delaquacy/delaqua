import { Box, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FormValues } from ".";
import { useScreenSize } from "@/app/hooks";
import { ReactNode } from "react";

interface GoodsIncomingFormItemProps {
  name: any;
  control: Control<any>;
  type: string;
  label: string;
  error: boolean;
  helperText: string | ReactNode;
  sx?: any;
  multiline?: boolean;
}

export const GoodsIncomingFormInputItem = ({
  name,
  control,
  type,
  label,
  error,
  helperText,
  multiline,
  sx = {},
}: GoodsIncomingFormItemProps) => {
  const { isSmallScreen } = useScreenSize();

  return (
    <Box display="flex" flexDirection="column" sx={{ ...sx }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              multiline={multiline}
              maxRows={3}
              color="info"
              type={type}
              label={label}
              size={isSmallScreen ? "small" : "medium"}
              variant="outlined"
              error={error}
              helperText={typeof helperText === "string" ? helperText : ""}
            />
            {typeof helperText !== "string" && helperText}
          </>
        )}
      />
      {!helperText && (
        <Box
          sx={{
            height: isSmallScreen ? "40px" : "23px",
          }}
        ></Box>
      )}
    </Box>
  );
};
