import { theme } from "@/app/ui/themeMui";
import { Box, FormHelperText, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
});

export const HelperText = styled(FormHelperText)({
  color: "#d32f2f",
  textAlign: "center",
  fontWeight: 600,
  fontSize: "14px",
});

export const PhoneInputGroupWrapper = styled(Box)<{
  user_phone_length: number;
}>(({ theme, user_phone_length }) => ({
  display: "flex",
  gap: "20px",
  flexDirection: "column",

  "& .PhoneInputCountry": {
    display: user_phone_length > 2 ? "block" : "none",
  },

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));
export const PhoneInputWrapper = styled(Box)(({ theme }) => ({
  alignSelf: "center",

  "& .PhoneInput": {
    justifyContent: "center",
    alignItems: "center",
  },
  "& .PhoneInputCountry": {
    transform: "translateY(-50%)",
  },

  [theme.breakpoints.up("sm")]: {
    alignSelf: "unset",
  },
}));

export const ButtonBox = styled(Box)({
  display: "flex",
  gap: "20px",
  height: "56px",
  alignSelf: "center",

  [theme.breakpoints.up("sm")]: {
    alignSelf: "flex-end",
  },
});
export const ErrorBox = styled(Box)({
  width: "330px",
});
