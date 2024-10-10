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

  return (
    <Modal open={open} onClose={onClose}>
      <Wrapper>
        <CloseButton onClick={onClose}>
          <GridCloseIcon />
        </CloseButton>
        <TypoWithPadding variant="h6">{t("maxNumOrdersTitle")}</TypoWithPadding>

        <TypoWithPadding>{t("maxNumOrdersSubtitle")}</TypoWithPadding>
      </Wrapper>
    </Modal>
  );
};
