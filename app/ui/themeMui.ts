"use client";
import { createTheme } from "@mui/material";
import { theme as t } from "./theme";

export const theme = createTheme({
  typography: {
    fontFamily: "Play, latin",
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            outline: `2px solid ${t.colors.black}`,
            border: "none",
            color: t.colors.black,
            "&:hover": {
              backgroundColor: t.colors.black,
              color: t.colors.mainColor,
              border: "none",
              outline: `2px solid ${t.colors.black}`,
            },
          },
        },
        {
          props: { variant: "contained" },
          style: {
            fontFamily: "Play, latin",
          },
        },
      ],
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          marginTop: "0px",
        },
      },
    },
  },
});
