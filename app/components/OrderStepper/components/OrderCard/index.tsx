import { Box, Card, FormHelperText, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";
import { CardWrapper, DescriptionBox, Marker } from "./styled";
import { OrderCardCounter } from "../OrderCardCounter";

interface OrderCardProps {
  imageSrc: string;
  imageAlt: string;
  size: string;
  description: string;
  price: string;
  code: string;
  count: string;
  minOrder?: string;
  onAdd: any;
  onRemove: any;
  sx?: any;
}

export const OrderCard = ({
  imageSrc,
  imageAlt,
  size,
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
  const { isSmallScreen } = useScreenSize();

  return (
    <Tooltip title={+code === 104 ? "Contact to us in Telegram" : ""}>
      <CardWrapper sx={sx}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent={"center"}
          gap="5px"
        >
          {minOrder && <FormHelperText>{t(minOrder)}</FormHelperText>}
          <Image
            src={
              `/${imageSrc}` ||
              "https://storage.googleapis.com/image_del_aq/Remove-background-project.png"
            }
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

        <DescriptionBox>
          <Typography textAlign="center" fontWeight="bold" fontSize="14px">
            {t(`${code}`)}
          </Typography>
          <Typography textAlign="center">{description}</Typography>
          <Typography textAlign="center" color="gray" fontSize="12px">
            {`${price} €`}
          </Typography>
          <OrderCardCounter count={count} onAdd={onAdd} onRemove={onRemove} />
        </DescriptionBox>
      </CardWrapper>
    </Tooltip>
  );
};
