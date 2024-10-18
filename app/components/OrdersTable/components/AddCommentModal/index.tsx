import { SharedButton } from "@/app/components/shared";
import { ModalWrapper } from "@/app/components/shared/styled/ModalWrapper";
import { useToast } from "@/app/hooks";
import { addCommentToOrders } from "@/app/utils/addCommentToOrders";
import { Box, Modal, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}

export const AddCommentModal = ({
  open,
  selected,
  onClose,
  setSelected,
}: AddCommentModalProps) => {
  const [comment, setComment] = useState("");
  const { showSuccessToast } = useToast();

  const handleAddComment = async () => {
    await addCommentToOrders(selected, comment);
    showSuccessToast("Comment successfully added");
    onClose();
    setSelected([]);
    setComment("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalWrapper>
        Add Comment
        <TextField
          multiline
          rows={3}
          label="Enter your comment to order ..."
          color="info"
          variant="outlined"
          value={comment}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setComment(event.target.value);
          }}
          sx={{
            width: "100%",
          }}
        />
        <Box display="flex" width="100%" justifyContent="space-evenly">
          <SharedButton
            onClick={handleAddComment}
            disabled={!comment}
            text=" Apply"
            variantType="success"
          />

          <SharedButton onClick={onClose} text=" Cancel" variantType="error" />
        </Box>
      </ModalWrapper>
    </Modal>
  );
};
