"use client";
import { ModalWrapper } from "@/app/components/shared/styled/ModalWrapper";
import { useScreenSize } from "@/app/hooks";
import { Address } from "@/app/types";
import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldWrapper } from "../../../OrderStepper/components/AddNewAddress/styled";
import { ControllerInputField, SharedButton } from "../../../shared";
import { FlexRow } from "../../styled";

interface EditAddressModalProps {
  open: boolean;
  control: any;
  editFields?: Address;
  reset: any;
  onClose: () => void;
  getItemIndex: (id: string) => number;
}

export const EditAddressModal = ({
  open,
  editFields,
  control,
  reset,
  onClose,
}: EditAddressModalProps) => {
  const { isSmallScreen } = useScreenSize();
  const { t } = useTranslation("form");

  const [originalValues, setOriginalValues] = useState<Address>();

  useEffect(() => {
    if (editFields) {
      setOriginalValues(editFields);
    }
  }, [editFields]);

  console.log(editFields, "editFields");
  const isHomeAddress =
    !editFields?.addressType || editFields?.addressType === "Home";

  return (
    <Modal open={open} onClose={onClose}>
      <ModalWrapper>
        Edit Address
        <Box width={"100%"}>
          <FieldWrapper is_small_screen={isSmallScreen.toString()}>
            <ControllerInputField
              name={"deliveryAddressObj.postalIndex"}
              type="number"
              control={control}
              label={`${t("post_index")} *`}
              error={false}
              helperText={""}
              sx={{
                flex: 1,
              }}
            />
            {!isHomeAddress && (
              <ControllerInputField
                name={"deliveryAddressObj.VAT_Num"}
                type="string"
                control={control}
                label={`${t("VATNum")}`}
                error={false}
                helperText={""}
                multiline
                sx={{
                  flex: 1,
                }}
              />
            )}
          </FieldWrapper>
          <FieldWrapper is_small_screen={isSmallScreen.toString()}>
            <ControllerInputField
              name={"deliveryAddressObj.deliveryAddress"}
              type="string"
              control={control}
              label={`${t("delivery_address")} *`}
              error={false}
              helperText={""}
              sx={{
                flex: 1,
              }}
            />
          </FieldWrapper>
          <FieldWrapper is_small_screen={isSmallScreen.toString()}>
            <ControllerInputField
              name={"deliveryAddressObj.geolocation"}
              type="string"
              control={control}
              label={`${t("geolocation_link")} *`}
              error={false}
              helperText={""}
              sx={{
                flex: 1,
              }}
            />
          </FieldWrapper>
          <FieldWrapper is_small_screen={isSmallScreen.toString()}>
            <ControllerInputField
              name={"deliveryAddressObj.addressDetails"}
              type="string"
              control={control}
              label={`${t("address_details")} *`}
              error={false}
              helperText={""}
              sx={{
                flex: 1,
              }}
            />
          </FieldWrapper>
        </Box>
        <FlexRow>
          <SharedButton onClick={onClose} text="Apply" variantType="success" />
        </FlexRow>
      </ModalWrapper>
    </Modal>
  );
};
