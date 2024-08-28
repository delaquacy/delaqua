import { useForm } from "react-hook-form";
import {
  DocumentReference,
  FieldValue,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import { Box, Button, FormHelperText } from "@mui/material";
import { useScreenSize, useToast } from "@/app/hooks";
import { useTranslation } from "react-i18next";

import Link from "next/link";
import { db } from "@/app/lib/config";
import { ControllerInputField } from "@/app/components/shared";
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

const DEFAULT_VALUES = {
  firstAndLast: "",
  postalIndex: "",
  deliveryAddress: "",
  geolocation: "",
  addressDetails: "",
  comments: "",
  createdAt: serverTimestamp(),
  archived: false,
  numberOfBottles: "0",
};

export const AddNewAddress = ({
  onBack,
  onAdd,
  userId,
  disableBack,
}: {
  onBack: () => void;
  onAdd: (address: FormValues) => void;
  userId: string;
  disableBack: boolean;
}) => {
  const { isSmallScreen } = useScreenSize();
  const { t } = useTranslation("form");
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(validationSchema as any),
  });

  const createNewUserAddress = async (
    addressObject: FormValues,
    userId: string
  ): Promise<string> => {
    const docRef: DocumentReference = await addDoc(
      collection(db, `users/${userId}/addresses`),
      addressObject
    );
    return docRef.id;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const id = await createNewUserAddress(data, userId);
      showSuccessToast(`Add new address successfully`);
      onAdd({ ...data, id });
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };
  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
                <Box
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "12px",
                    lineHeight: 1.66,
                    marginInline: "14px",
                    marginTop: "3px",
                  }}
                >
                  {errors.geolocation && (
                    <FormHelperText
                      sx={{
                        color: "#d32f2f",
                      }}
                    >
                      {errors.geolocation.message}
                    </FormHelperText>
                  )}
                  {t("follow_the_link")}{" "}
                  <Link
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                    target="_blank"
                    href="https://www.google.com/maps"
                  >
                    {t("google_maps")}
                  </Link>
                  {t("and_choose")}
                </Box>
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
              <Box
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "12px",
                  lineHeight: 1.66,
                  marginInline: "14px",
                  marginTop: "3px",
                }}
              >
                {errors.addressDetails && (
                  <FormHelperText
                    sx={{
                      color: "#d32f2f",
                    }}
                  >
                    {errors.addressDetails.message}
                  </FormHelperText>
                )}
                {t("address_placeholder")}
              </Box>
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
