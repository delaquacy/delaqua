import { HelpOutlineOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { OrderCardCounter } from "../OrderCardCounter";
import { CardWrapper, DescriptionBox } from "./styled";

interface OrderCardProps {
  imageSrc?: string;
  imageAlt: string;
  size: string;
  available: boolean;
  description: string;
  price: string;
  code: string;
  count: string;
  minOrder?: string;
  onAdd: any;
  onRemove: any;
  sx?: any;
}

const DISPENSER_DELIVERY_CODE = 104;

export const OrderCard = ({
  imageSrc,
  imageAlt,
  size,
  available,
  description,
  price,
  code,
  count,
  minOrder,
  onAdd,
  onRemove,
  sx,
}: OrderCardProps) => {
  const { t } = useTranslation("form");

  return (
    <Tooltip
      placement="top"
      title={
        +code === DISPENSER_DELIVERY_CODE && available
          ? t("104Tooltip")
          : available
          ? ""
          : t("outOfStock")
      }
      enterTouchDelay={1}
    >
      <CardWrapper sx={sx}>
        {imageSrc && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={"center"}
          >
            <Image
              src={`/${imageSrc}`}
              alt={imageAlt}
              priority
              width={+size}
              height={+size}
              style={{
                alignSelf: "center",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        <DescriptionBox>
          {+code === DISPENSER_DELIVERY_CODE ? (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap="5px"
            >
              <Typography textAlign="center" fontWeight="bold" fontSize="14px">
                {t(`${code}`)}
              </Typography>
              <Tooltip title={t("104Tooltip")} enterTouchDelay={1}>
                <HelpOutlineOutlined
                  color="primary"
                  sx={{
                    width: "15px",
                  }}
                />
              </Tooltip>
            </Box>
          ) : (
            <Typography textAlign="center" fontWeight="bold" fontSize="14px">
              {t(`${code}`)}
            </Typography>
          )}

          <Typography textAlign="center">{description}</Typography>
          <OrderCardCounter
            count={count}
            onAdd={onAdd}
            onRemove={onRemove}
            disabled={!available}
          />

          <Tooltip title={`${price} € / 1`} enterTouchDelay={1}>
            <Typography textAlign="center" color="gray" fontSize="12px">
              {`${+price * +count} €`}
            </Typography>
          </Tooltip>
        </DescriptionBox>

        {/* {minOrder && <MinOrderBox>{t(minOrder)}</MinOrderBox>} */}
      </CardWrapper>
    </Tooltip>
  );
};
