import { BIG_BOTTLE_PRICE } from "@/app/constants/bigBottlePrise";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { Box, FormHelperText, Tooltip, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OrderCardCounter } from "../OrderCardCounter";
import {
  ExternalCountWrapper,
  InternalCountWrapper,
  Title,
  Wrapper,
} from "./styled";
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
  setValue: any;
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
  setValue,
}: BigOrderCardProps) => {
  const { t } = useTranslation("form");

  const currentBottlesNum = watch(nameBottle);
  const currentBottlesReturn = watch(`${nameReturn}`) || 0;
  const isMoreThanOneBigBottle = +currentBottlesNum > 1;
  const isTenOrMoreBigBottle = +currentBottlesNum >= 10;

  const rentPrice = Math.max(
    +priceRent * (+currentBottlesNum - +(currentBottlesReturn || 0)),
    0
  );

  useEffect(() => {
    setValue(
      nameRent,
      `${Math.max(+currentBottlesNum - +currentBottlesReturn, 0)}`
    );
  }, [currentBottlesNum, currentBottlesReturn]);

  return (
    <Wrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent={"space-between"}
        gap="5px"
        position={"relative"}
      >
        <img
          alt={imageAlt}
          src={`/${imageSrc}`}
          style={{
            alignSelf: "center",
            objectFit: "contain",
            width: "120px",
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
              <OrderCardCounter
                count={field.value}
                onAdd={() => field.onChange(+field.value + 1)}
                onRemove={() => {
                  field.onChange(Math.max(+field.value - 1, 0));
                }}
              />{" "}
              <Tooltip
                title={t(
                  `${
                    isFirstOrder && !isMoreThanOneBigBottle
                      ? "119CostFirst"
                      : isTenOrMoreBigBottle
                      ? "119TenCost"
                      : "119Cost"
                  }`
                )}
                enterTouchDelay={1}
              >
                <Typography textAlign="center" color="gray">
                  {`${
                    (isFirstOrder && !isMoreThanOneBigBottle
                      ? +BIG_BOTTLE_PRICE.FIRST_AND_ONE
                      : isTenOrMoreBigBottle
                      ? +BIG_BOTTLE_PRICE.TEN_OR_MORE
                      : +BIG_BOTTLE_PRICE.DEFAULT) * Number(currentBottlesNum)
                  } €`}
                </Typography>
              </Tooltip>
            </InternalCountWrapper>
          )}
        />

        <Controller
          control={control}
          name={nameReturn}
          render={({ field }) => (
            <InternalCountWrapper>
              <Title>{t("number_of_bottles_to_return")}</Title>

              <OrderCardCounter
                count={field.value}
                onAdd={() => field.onChange(+field.value + 1)}
                onRemove={() => {
                  field.onChange(Math.max(+field.value - 1, 0));
                }}
              />
            </InternalCountWrapper>
          )}
        />

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
                  {`${rentPrice} €`}
                </Typography>
              </Tooltip>
            </InternalCountWrapper>
          )}
        />
      </ExternalCountWrapper>
    </Wrapper>
  );
};
