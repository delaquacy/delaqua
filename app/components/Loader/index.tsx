import { Box, CircularProgress, Typography } from "@mui/material";

export const Loader = ({ text }: { text?: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        width: "100%",
        justifyContent: "top",
        marginTop: "30px",
        alignItems: "center",
      }}
    >
      {text && <Typography align="center">{text}</Typography>}
      <CircularProgress size={100} thickness={2} />
    </Box>
  );
};
