import { TableCell, styled } from "@mui/material";

// Define props for the styled component
interface StyledTableCellProps {
  head_cell_id: string;
}

export const StyledTableCell = styled(TableCell)<StyledTableCellProps>(
  ({ head_cell_id }) => {
    return {
      minWidth: head_cell_id === "paymentStatus" ? "130px" : "100px",
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
          ? "74px"
          : head_cell_id === "phoneNumber"
          ? "174px"
          : head_cell_id === "firstAndLast"
          ? "301px"
          : "",
      width:
        head_cell_id === "comments" ||
        head_cell_id === "addressDetails" ||
        head_cell_id === "deliveryAddress" ||
        head_cell_id === "firstAndLast"
          ? "180px"
          : head_cell_id === "phoneNumber"
          ? "136px"
          : "80px",
    };
  }
);
