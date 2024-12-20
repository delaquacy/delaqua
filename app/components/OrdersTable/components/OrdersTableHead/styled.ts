import { TableCell, styled } from "@mui/material";

// Define props for the styled component
interface StyledTableCellProps {
  head_cell_id: string;
}

export const StyledTableCell = styled(TableCell)<StyledTableCellProps>(
  ({ head_cell_id }) => {
    return {
      zIndex:
        head_cell_id === "index" ||
        head_cell_id === "phoneNumber" ||
        head_cell_id === "firstAndLast"
          ? 3
          : 0,
      overflow: "hidden",
      borderRight:
        head_cell_id === "firstAndLast"
          ? "solid 1px rgba(38, 40, 82, 0.1)"
          : "",
      left:
        head_cell_id === "index"
          ? "73.5px"
          : head_cell_id === "phoneNumber"
          ? "154px"
          : head_cell_id === "firstAndLast"
          ? "290px"
          : "",
      width:
        head_cell_id === "comments" ||
        head_cell_id === "deliveryAddress" ||
        head_cell_id === "firstAndLast"
          ? "180px"
          : head_cell_id === "phoneNumber"
          ? "136px"
          : "80px",
      minWidth:
        head_cell_id === "comments" ||
        head_cell_id === "deliveryAddress" ||
        head_cell_id === "firstAndLast"
          ? "180px"
          : head_cell_id === "phoneNumber"
          ? "136px"
          : head_cell_id === "paymentStatus"
          ? "130px"
          : "80px",
    };
  }
);
