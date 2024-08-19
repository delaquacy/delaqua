import { theme } from "@/app/ui/themeMui";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

interface OrderCardCounterProps {
  count: string;
  onAdd: () => void;
  onRemove: () => void;
}

export const OrderCardCounter = ({
  count = "0",
  onAdd,
  onRemove,
}: OrderCardCounterProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        [theme.breakpoints.down(350)]: {
          flexDirection: "column",
        },
      }}
    >
      <IconButton onClick={onRemove}>
        <RemoveCircle
          sx={{
            color: "#E48683",
            transition: "all 0.1s",
            ":hover": {
              color: "#D9534F",
            },
          }}
        />
      </IconButton>

      <Box
        sx={{
          border: "1px solid lightgray",
          borderRadius: "10px",
          paddingBlock: "5px",
          paddingInline: "20px",
        }}
      >
        <Typography fontWeight={+count > 0 ? "bold" : "medium"}>
          {count}
        </Typography>
      </Box>

      <IconButton onClick={onAdd}>
        <AddCircle
          sx={{
            color: "#7AADD9",
            transition: "all 0.1s",
            ":hover": {
              color: "#428bca",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};
