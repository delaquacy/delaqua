import { IconButton, Typography } from "@mui/material";
import { AddIcon, Count, RemoveIcon, Wrapper } from "./styled";

interface OrderCardCounterProps {
  count: string;
  onAdd: () => void;
  onRemove: () => void;
}

export const OrderCardCounter = ({
  count = "0",
  onAdd,
  onRemove,
}: OrderCardCounterProps) => (
  <Wrapper>
    <IconButton onClick={onRemove}>
      <RemoveIcon />
    </IconButton>

    <Count>
      <Typography fontWeight={+count > 0 ? "bold" : "medium"}>
        {count}
      </Typography>
    </Count>

    <IconButton onClick={onAdd}>
      <AddIcon />
    </IconButton>
  </Wrapper>
);
