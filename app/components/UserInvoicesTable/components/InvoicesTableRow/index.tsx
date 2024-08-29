import { USER_INVOICES_HEAD } from "@/app/constants/UserInvoicesTable";
import { ContentCopy } from "@mui/icons-material";
import { Button, Checkbox, TableCell, TableRow } from "@mui/material";

interface InvoiceTableRowProps {
  handleClick: (event: any, id: string) => void;
  row: any;
  isItemSelected: boolean;
  labelId: string;
  onCopy: (event: any) => void;
}

export const InvoiceTableRow = ({
  handleClick,
  row,
  isItemSelected,
  labelId,
  onCopy,
}: InvoiceTableRowProps) => {
  return (
    <TableRow
      // onClick={(event: any) => handleClick(event, row.id as string)}
      role="checkbox"
      aria-checked={isItemSelected}
      selected={isItemSelected}
      sx={{
        cursor: "pointer",
        transition: "all, 0.3s",
        "&.Mui-selected": {
          background: "#D1E3F6",
          "&:hover": {
            background: "#E8F1FA",
          },
        },
        ":hover": {
          background: !row.completed && !row.expire ? "#E8F1FA" : "",
        },
      }}
    >
      {/* <TableCell
        sx={{
          background: "inherit",
        }}
      >
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
        />
      </TableCell> */}
      {USER_INVOICES_HEAD.map(({ key }, index) => (
        <TableCell
          key={index}
          sx={{
            textAlign: "center",
            borderRight:
              index !== USER_INVOICES_HEAD.length - 1
                ? "solid 1px rgba(38, 40, 82, 0.1)"
                : "",
          }}
        >
          {row[key]}
        </TableCell>
      ))}
      <TableCell align="center">
        <Button onClick={onCopy}>
          <ContentCopy
            sx={{
              color: "#4788C7",
            }}
          />
        </Button>
      </TableCell>
    </TableRow>
  );
};
