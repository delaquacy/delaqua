import { Box, FormHelperText, Tooltip, Typography } from "@mui/material";
import {
  ExternalCountWrapper,
  InternalCountWrapper,
  Title,
  Wrapper,
} from "./styled";
import { OrderCardCounter } from "../OrderCardCounter";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
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
  const { isSmallScreen } = useScreenSize();
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
        position={"relative"}
      >
        <img
          alt={imageAlt}
          src={
            `/${imageSrc}` ||
            "https://storage.googleapis.com/image_del_aq/Remove-background-project.png"
          }
          style={{
            alignSelf: "center",
            objectFit: "contain",
            width: "80%",
            maxWidth: "200px",
            aspectRatio: 7 / 11,
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
              <Title>{t(`${codeBottle}`)}</Title>

              <Typography textAlign="center">{description}</Typography>
              <Tooltip
                title={t(`${isFirstOrder ? "119CostFirst" : "119Cost"}`)}
                enterTouchDelay={1}
              >
                <Typography textAlign="center" color="gray">
                  {`${
                    (isFirstOrder ? +priceBottle + 1 : +priceBottle) *
                    +currentBottlesNum
                  } €`}
                </Typography>
              </Tooltip>

              <Box width={"131px"} alignSelf="center">
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
                <Title>{t("number_of_bottles_to_return")}</Title>

                <Box width={"131px"} alignSelf="center">
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
                <Title>{t(`${codeRent}`)}</Title>
                <Tooltip title={t("120Tooltip")} enterTouchDelay={1}>
                  <HelpOutlineOutlined
                    color="primary"
                    sx={{
                      width: "15px",
                    }}
                  />
                </Tooltip>
              </Box>

              <Typography textAlign="center">{description}</Typography>
              <Tooltip title={t("120Cost")} enterTouchDelay={1}>
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
