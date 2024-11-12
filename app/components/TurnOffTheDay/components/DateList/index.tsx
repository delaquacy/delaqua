import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, List, Tooltip, Typography } from "@mui/material";
import { StyledListContainer, StyledListItem } from "./styled";

interface DateListProps {
  dates: string[];
  tooltipMessage: string;
  onDelete: (date: string) => void;
}

export const DateList = ({
  dates,
  tooltipMessage,
  onDelete,
}: DateListProps) => {
  return (
    <StyledListContainer>
      {dates.length > 0 ? (
        <List>
          {dates.map((date) => (
            <StyledListItem key={date}>
              {date}
              <Tooltip title={tooltipMessage} arrow>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(date)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </StyledListItem>
          ))}
        </List>
      ) : (
        <Typography>No dates available.</Typography>
      )}
    </StyledListContainer>
  );
};
