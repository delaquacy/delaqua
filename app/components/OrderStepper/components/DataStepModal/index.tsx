import { Modal } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { CloseButton, TypoWithPadding, Wrapper } from "./styled";

interface DataStepModalProps {
  open: boolean;
  onClose: () => void;
}

export const DataStepModal = ({ open, onClose }: DataStepModalProps) => {
  const { t } = useTranslation("form");
  const separator = "😔.";

  const [title, subtitle] = t("maxNumOrders").split(separator);

  return (
    <Modal open={open} onClose={onClose}>
      <Wrapper>
        <CloseButton onClick={onClose}>
          <GridCloseIcon />
        </CloseButton>
        <TypoWithPadding variant="h6">{`${title} ${separator}`}</TypoWithPadding>

        <TypoWithPadding>{subtitle}</TypoWithPadding>
      </Wrapper>
    </Modal>
  );
};
