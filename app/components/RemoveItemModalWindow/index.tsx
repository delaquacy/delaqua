import { useScreenSize } from "@/app/hooks";
import { Cancel, DeleteOutline } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { SharedButton } from "../shared";
import { ModalWrapper } from "../shared/styled/ModalWrapper";
import { ModalWrapperBox, RowBox } from "./styled";

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
        <ModalWrapper>
          <ModalWrapperBox>
            <Typography
              variant="h6"
              component="h2"
              textAlign="center"
              fontWeight="bold"
            >
              Are you sure you want to remove this item from firebase?
            </Typography>
            <Typography
              component="h3"
              variant="h6"
              sx={{ mt: 2 }}
              textAlign="center"
            >
              {itemDetails}
            </Typography>

            <RowBox>
              <SharedButton
                onClick={() => onRemove(itemId)}
                size={isSmallScreen ? "small" : "medium"}
                variantType="error"
                text="Remove"
                icon={
                  <DeleteOutline
                    fontSize="small"
                    sx={{
                      marginRight: 1,
                    }}
                  />
                }
                fontSize="14px"
                sx={{
                  alignSelf: "center",
                  width: "50%",
                }}
              />

              <SharedButton
                onClick={() => setOpen(false)}
                size={isSmallScreen ? "small" : "medium"}
                text="Cancel"
                fontSize="14px"
                icon={
                  <Cancel
                    fontSize="small"
                    sx={{
                      marginRight: 1,
                    }}
                  />
                }
                sx={{
                  alignSelf: "center",
                  width: "50%",
                }}
                variantType="warning"
              />
            </RowBox>
          </ModalWrapperBox>
        </ModalWrapper>
      </Modal>
    </div>
  );
}
