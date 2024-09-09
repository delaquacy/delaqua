import { useScreenSize } from "@/app/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { FieldValue } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ControllerInputField } from "@/app/components/shared";
import { AddAddressHelperText } from "../AddAddressHelperText";
import { ADDRESS_DEFAULT_VALUES } from "../AddressStep";
import { addAddressValidationSchema } from "./addAddressValidationSchema";
import { ButtonsWrapper, FieldWrapper, FormWrapper } from "./styled";

interface FormValues {
  id?: string;
  firstAndLast: string;
  addressDetails: string;
  deliveryAddress: string;
  geolocation: string;
  postalIndex: string;
  comments: string;
  createdAt: FieldValue;
  archived: boolean;
  numberOfBottles: string;
}

export const AddNewAddress = ({
  onBack,
  onAdd,
  disableBack,
}: {
  onBack: () => void;
  onAdd: (address: FormValues) => void;
  disableBack: boolean;
}) => {
  const { isSmallScreen } = useScreenSize();
  const { t } = useTranslation("form");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: ADDRESS_DEFAULT_VALUES,
    resolver: yupResolver(addAddressValidationSchema as any),
  });

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onAdd)}>
      <Box>
        <FieldWrapper is_small_screen={isSmallScreen.toString()}>
          <ControllerInputField
            name={"firstAndLast"}
            type="string"
            control={control}
            label={`${t("first_and_last")} *`}
            error={!!errors.firstAndLast}
            helperText={errors.firstAndLast?.message as string}
            sx={{
              flex: 1,
            }}
          />

          <ControllerInputField
            name={"postalIndex"}
            type="number"
            control={control}
            label={`${t("post_index")} *`}
            error={!!errors.postalIndex}
            helperText={errors.postalIndex?.message as string}
            sx={{
              flex: 1,
            }}
          />
          <ControllerInputField
            name={"deliveryAddress"}
            type="string"
            control={control}
            label={`${t("delivery_address")} *`}
            error={!!errors.deliveryAddress}
            helperText={errors.deliveryAddress?.message as string}
            sx={{
              flex: 1,
            }}
          />
        </FieldWrapper>

        <FieldWrapper is_small_screen={isSmallScreen.toString()}>
          <Box
            sx={{
              flex: 1,
            }}
          >
            <ControllerInputField
              name={"geolocation"}
              type="string"
              control={control}
              label={`${t("geolocation_link")} *`}
              error={!!errors.geolocation}
              helperText={
                <AddAddressHelperText
                  error={errors.geolocation}
                  errorPlaceholder={t("follow_the_link")}
                  errorLink="https://www.google.com/maps"
                  errorLinkText={t("google_maps")}
                  errorAfterLinkText={t("and_choose")}
                />
              }
            />
          </Box>

          <ControllerInputField
            name={"addressDetails"}
            type="string"
            control={control}
            label={`${t("address_details")} *`}
            error={!!errors.addressDetails}
            sx={{
              flex: 1,
            }}
            helperText={
              <AddAddressHelperText
                error={errors.addressDetails}
                errorPlaceholder={t("address_placeholder")}
              />
            }
          />
          <ControllerInputField
            name={"comments"}
            type="string"
            control={control}
            label={`${t("comments")}`}
            error={false}
            helperText={t("comments_placeholder")}
            multiline
            sx={{
              flex: 1,
            }}
          />
        </FieldWrapper>
      </Box>

      <ButtonsWrapper>
        <Button
          color="inherit"
          sx={{ mr: 1, border: "1px solid lightgray" }}
          onClick={onBack}
          disabled={disableBack}
        >
          {t("cancel")}
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />

        <Button
          type="submit"
          sx={{ border: "1px solid lightgray" }}
          color="primary"
        >
          {t("add")}
        </Button>
      </ButtonsWrapper>
    </FormWrapper>
  );
};
