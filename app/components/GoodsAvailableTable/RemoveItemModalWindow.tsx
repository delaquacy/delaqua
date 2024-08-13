import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useScreenSize } from "@/app/hooks";
import { Cancel, DeleteOutline } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

export default function RemoveItemModalWindow({
  open,
  setOpen,
  itemDetails,
  itemId,
  onRemove,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRemove: (documentId: string) => void;
  itemDetails: string;
  itemId: string;
}) {
  const handleClose = () => setOpen(false);
  const { isSmallScreen } = useScreenSize();

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="15px"
          >
            <Typography
              variant="h6"
              component="h2"
              textAlign="center"
              fontWeight="bold"
            >
              Are you sure you want to remove this item?
            </Typography>
            <Typography
              component="h3"
              variant="h6"
              sx={{ mt: 2 }}
              textAlign="center"
            >
              {itemDetails}
            </Typography>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap="15px"
            >
              <Button
                variant="contained"
                onClick={() => onRemove(itemId)}
                size={isSmallScreen ? "small" : "medium"}
                sx={{
                  alignSelf: "center",
                  width: "50%",
                  textTransform: "capitalize",
                  background: "#B43636",
                  ":hover": { background: "#7D2525" },
                }}
              >
                <DeleteOutline
                  fontSize="small"
                  sx={{
                    marginRight: 1,
                  }}
                />
                Remove
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(false)}
                size={isSmallScreen ? "small" : "medium"}
                sx={{
                  alignSelf: "center",
                  width: "50%",
                  textTransform: "capitalize",
                  background: "#FFBF00",
                  ":hover": { background: "#E6AC00" },
                }}
              >
                <Cancel
                  fontSize="small"
                  sx={{
                    marginRight: 1,
                  }}
                />
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
