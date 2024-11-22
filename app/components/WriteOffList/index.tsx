import { WRITE_OFF_HEAD } from "@/app/constants/WriteOffHead";
import { useWriteOffGoodsContext } from "@/app/contexts/WriteOffGoodContext";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const WriteOffList = () => {
  const { writeOffItems } = useWriteOffGoodsContext();
  return (
    <Box>
      <Table
        size="small"
        sx={{
          padding: "20px",
        }}
      >
        <TableHead>
          <TableRow>
            {WRITE_OFF_HEAD.map((good, index) => (
              <TableCell
                key={index}
                scope="row"
                padding="none"
                variant="head"
                align="center"
                sx={{
                  fontWeight: "bold",
                  borderRight:
                    index < WRITE_OFF_HEAD.length - 1
                      ? "1px solid #ddd"
                      : "none",
                }}
              >
                {good.value}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {writeOffItems.map((writeOffItem, writeOffItemIndex) => {
            const items = writeOffItem.items;
            return items.map((item, index) => (
              <TableRow key={`${writeOffItemIndex}-${index}`}>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.id}
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.name}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.count}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {writeOffItem.createdAt}
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </Box>
  );
};
