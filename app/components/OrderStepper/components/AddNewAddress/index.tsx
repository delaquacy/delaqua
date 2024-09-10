import { useScreenSize } from "@/app/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FieldValue } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ControllerInputField } from "@/app/components/shared";
import { AddAddressHelperText } from "../AddAddressHelperText";
import { ADDRESS_DEFAULT_VALUES } from "../AddressStep";
import { addAddressValidationSchema } from "./addAddressValidationSchema";
import { ButtonsWrapper, FieldWrapper, FormWrapper } from "./styled";

interface FormValues {
  id?: string;
  firstAndLast: string;
  phoneNumber: string;
  addressDetails: string;
  deliveryAddress: string;
  geolocation: string;
  postalIndex: string;
  comments: string;
  createdAt: FieldValue;
  archived: boolean;
  numberOfBottles: string;
  addressType?: string;
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
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: ADDRESS_DEFAULT_VALUES,
    resolver: yupResolver(addAddressValidationSchema as any),
  });

  const addressType = watch("addressType");
  const homeAddress = addressType === "Home";

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onAdd)}>
      <Box>
        <Controller
          control={control}
          name="addressType"
          render={({ field }) => (
            <RadioGroup
              row
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              sx={{
                gap: "10px",
                paddingInline: "2px",
                borderBlock: "1px solid lightgray",
                width: "fit-content",
                marginBottom: "10px",
              }}
            >
              <FormControlLabel
                value="Home"
                control={<Radio />}
                label={t("home")}
              />
              <FormControlLabel
                value="Business"
                control={<Radio />}
                label={t("business")}
              />
            </RadioGroup>
          )}
        />
        <FieldWrapper is_small_screen={isSmallScreen.toString()}>
          <ControllerInputField
            name={"firstAndLast"}
            type="string"
            control={control}
            label={`${homeAddress ? t("first_and_last") : t("companyName")} *`}
            error={!!errors.firstAndLast}
            helperText={errors.firstAndLast?.message as string}
            sx={{
              flex: 1,
            }}
          />

          <ControllerInputField
            name={"phoneNumber"}
            type="string"
            control={control}
            label={`${homeAddress ? t("phoneNumber") : t("contactPerson")} *`}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message as string}
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
        </FieldWrapper>
        <FieldWrapper is_small_screen={isSmallScreen.toString()}>
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
        </FieldWrapper>
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
