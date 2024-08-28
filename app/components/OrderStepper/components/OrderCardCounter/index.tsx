import { IconButton, Tooltip, Typography } from "@mui/material";
import { AddIcon, Count, RemoveIcon, Wrapper } from "./styled";

interface OrderCardCounterProps {
  count: string;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
  tooltipMessage?: string;
}

export const OrderCardCounter = ({
  count = "0",
  onAdd,
  onRemove,
  disabled,
  tooltipMessage,
}: OrderCardCounterProps) => (
  <Wrapper>
    <IconButton onClick={onRemove} disabled={disabled}>
      <RemoveIcon disabled={disabled} />
    </IconButton>

    <Count>
      <Typography fontWeight={+count > 0 ? "bold" : "medium"}>
        {count}
      </Typography>
    </Count>

    <Tooltip title={tooltipMessage || ""}>
      <IconButton onClick={onAdd} disabled={disabled}>
        <AddIcon disabled={disabled} />
      </IconButton>
    </Tooltip>
  </Wrapper>
);
