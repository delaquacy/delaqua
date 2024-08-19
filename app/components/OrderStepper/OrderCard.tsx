import { Box, Card, Typography } from "@mui/material";
import Image from "next/image";
import { OrderCardCounter } from "./OrderCardCounter";
import { useTranslation } from "react-i18next";

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

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "center",
        cursor: "pointer",
        border: "1px solid lightgray",
        padding: "10px",
        transition: "all 0.2s",
        ":hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Image
        src={
          `/${imageSrc}` ||
          "https://storage.googleapis.com/image_del_aq/Remove-background-project.png"
        }
        alt={imageAlt}
        priority
        width="100"
        height="100"
        style={{
          alignSelf: "center",
          objectFit: "contain",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
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
      </Box>
    </Card>
  );
};
