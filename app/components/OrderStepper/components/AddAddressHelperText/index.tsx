import { Box, FormHelperText } from "@mui/material";
import Link from "next/link";
import { FieldError } from "react-hook-form";

interface AddAddressHelperTextProps {
  error?: FieldError;
  errorPlaceholder: string;
  errorLink?: string;
  errorLinkText?: string;
  errorAfterLinkText?: string;
}

export const AddAddressHelperText = ({
  error,
  errorPlaceholder,
  errorLink,
  errorLinkText,
  errorAfterLinkText,
}: AddAddressHelperTextProps) => {
  return (
    <Box
      sx={{
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: "12px",
        lineHeight: 1.66,
        marginInline: "14px",
        marginTop: "3px",
      }}
    >
      {error && (
        <FormHelperText
          sx={{
            color: "#d32f2f",
          }}
        >
          {error.message}
        </FormHelperText>
      )}
      {errorPlaceholder}
      {errorLink && (
        <>
          <Link
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
            }}
            target="_blank"
            href={errorLink || "/"}
          >
            {errorLinkText}
          </Link>
          {errorAfterLinkText}
        </>
      )}
    </Box>
  );
};
