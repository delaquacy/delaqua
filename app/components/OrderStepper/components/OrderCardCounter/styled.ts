import { theme } from "@/app/ui/themeMui";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "130px",
  alignSelf: "center",
  [theme.breakpoints.down(350)]: {
    flexDirection: "column",
  },
});

export const RemoveIcon = styled(RemoveCircle)(
  ({ disabled }: { disabled?: boolean }) => ({
    color: disabled ? "gray" : "#E48683",
    transition: "all 0.1s",

    ":hover": {
      color: "#D9534F",
    },
  })
);

export const Count = styled(Box)({
  border: "1px solid lightgray",
  borderRadius: "10px",
  paddingBlock: "5px",
  paddingInline: "20px",
});

export const AddIcon = styled(AddCircle)(
  ({ disabled }: { disabled?: boolean }) => ({
    color: disabled ? "gray" : "#7AADD9",
    transition: "all 0.1s",
    ":hover": {
      color: "#428bca",
    },
  })
);
