import { Box, FormHelperText, Tooltip, Typography } from "@mui/material";
import { ExternalCountWrapper, InternalCountWrapper, Wrapper } from "./styled";
import Image from "next/image";
import { OrderCardCounter } from "../OrderCardCounter";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
interface BigOrderCardProps {
  imageSrc: string;
  imageAlt: string;
  isFirstOrder?: boolean;
  description: string;
  priceBottle: string;
  priceRent: string;
  codeBottle: string;
  codeRent: string;
  nameReturn: string;
  sx?: any;
  control: any;
  nameBottle: string;
  nameRent: string;
  watch: any;
}

export const BigOrderCard = ({
  imageSrc,
  imageAlt,
  isFirstOrder,
  description,
  priceBottle,
  priceRent,
  codeBottle,
  codeRent,
  nameReturn,
  control,
  nameBottle,
  nameRent,
  watch,
}: BigOrderCardProps) => {
  const { t } = useTranslation("form");
  const { userOrder } = useOrderDetailsContext();

  const currentBottlesNum = watch(nameBottle);
  const currentBottlesReturn = watch(`${nameReturn}`) || 0;
  const maxNumBottlesReturn = userOrder.deliveryAddress.numberOfBottles;

  return (
    <Wrapper>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
        gap="5px"
      >
        <Image
          src={
            `/${imageSrc}` ||
            "https://storage.googleapis.com/image_del_aq/Remove-background-project.png"
          }
          alt={imageAlt}
          priority
          width={200}
          height={300}
          style={{
            flex: 1,
            alignSelf: "center",
            objectFit: "contain",
          }}
        />
        <FormHelperText>
          {isFirstOrder ? t("minimumOrderSmall") : t("minimumOrderBig")}
        </FormHelperText>
      </Box>

      <ExternalCountWrapper>
        <Controller
          control={control}
          name={nameBottle}
          render={({ field }) => (
            <InternalCountWrapper>
              <Typography textAlign="center" fontWeight="bold">
                {t(`${codeBottle}`)}
              </Typography>

              <Typography textAlign="center">{description}</Typography>
              <Tooltip
                title={t(`${isFirstOrder ? "119CostFirst" : "119Cost"}`)}
              >
                <Typography textAlign="center" color="gray">
                  {`${
                    (isFirstOrder ? +priceBottle + 1 : +priceBottle) *
                    +currentBottlesNum
                  } €`}
                </Typography>
              </Tooltip>

              <Box width={"50%"} alignSelf="center">
                <OrderCardCounter
                  count={field.value}
                  onAdd={() => field.onChange(+field.value + 1)}
                  onRemove={() => {
                    field.onChange(Math.max(+field.value - 1, 0));
                  }}
                />
              </Box>
            </InternalCountWrapper>
          )}
        />
        {!isFirstOrder && (
          <Controller
            control={control}
            name={nameReturn}
            render={({ field }) => (
              <InternalCountWrapper>
                <Typography textAlign="center" fontWeight="bold">
                  {t("number_of_bottles_to_return")}
                </Typography>

                <Box width={"50%"} alignSelf="center">
                  <OrderCardCounter
                    count={field.value}
                    tooltipMessage={
                      +field.value === +maxNumBottlesReturn ? t("maxVal") : ""
                    }
                    onAdd={() =>
                      field.onChange(
                        Math.min(+field.value + 1, +maxNumBottlesReturn)
                      )
                    }
                    onRemove={() => {
                      field.onChange(Math.max(+field.value - 1, 0));
                    }}
                  />
                </Box>
              </InternalCountWrapper>
            )}
          />
        )}
        <Controller
          control={control}
          name={nameRent}
          render={({ field }) => (
            <InternalCountWrapper>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent={"center"}
                gap="5px"
              >
                <Typography textAlign="center" fontWeight="bold">
                  {t(`${codeRent}`)}
                </Typography>
                <Tooltip title={t("120Tooltip")}>
                  <HelpOutlineOutlined
                    color="primary"
                    sx={{
                      width: "15px",
                    }}
                  />
                </Tooltip>
              </Box>

              <Typography textAlign="center">{description}</Typography>
              <Tooltip title={t("120Cost")}>
                <Typography textAlign="center" color="gray">
                  {`${Math.max(
                    +priceRent * (+currentBottlesNum - +currentBottlesReturn),
                    0
                  )} €`}
                </Typography>
              </Tooltip>
            </InternalCountWrapper>
          )}
        />
      </ExternalCountWrapper>
    </Wrapper>
  );
};
