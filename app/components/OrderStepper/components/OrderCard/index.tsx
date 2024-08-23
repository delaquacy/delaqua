import { Box, Card, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";
import { CardWrapper, DescriptionBox, Marker } from "./styled";
import { OrderCardCounter } from "../OrderCardCounter";

interface OrderCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  price: string;
  code: string;
  count: string;
  onAdd: any;
  onRemove: any;
}

export const OrderCard = ({
  imageSrc,
  imageAlt,
  title,
  description,
  price,
  code,
  count,
  onAdd,
  onRemove,
}: OrderCardProps) => {
  const { t } = useTranslation("form");
  const { isSmallScreen } = useScreenSize();

  return (
    <CardWrapper special_card={(`${code}` === "119").toString()}>
      {`${code}` === "119" && <Marker>Main product</Marker>}

      <Image
        src={
          `/${imageSrc}` ||
          "https://storage.googleapis.com/image_del_aq/Remove-background-project.png"
        }
        alt={imageAlt}
        priority
        width="100"
        height="80"
        style={{
          alignSelf: "center",
          objectFit: "contain",
        }}
      />

      <DescriptionBox>
        <Typography textAlign="center" fontSize="10px" color="gray">
          {`${t("productCode")}: ${code}`}
        </Typography>
        <Typography textAlign="center" fontWeight="bold">
          {t(`${code}`)}
        </Typography>
        <Typography textAlign="center">{description}</Typography>
        <Typography textAlign="center" color="gray">
          {`${price} €`}
        </Typography>
        <OrderCardCounter count={count} onAdd={onAdd} onRemove={onRemove} />
      </DescriptionBox>
    </CardWrapper>
  );
};
