import { Controller, useForm } from "react-hook-form";
import { validationSchema } from "./validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { GoodsIncomingFormInputItem } from "../GoodsIncomingForm/GoodsIncomingFormInputItem";
import { CheckCircleOutline } from "@mui/icons-material";
import { useScreenSize, useToast } from "@/app/hooks";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/config";
import dayjs from "dayjs";
import SelectItem from "../GoodsIncomingForm/Select";

interface Goods {
  itemCode: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: string;
  unitPrice: string;
  buyPrice: string;
  buyPriceVAT: string;
  netBuyWorth: string;
  netSaleWorth: string;
  sellPrice: string;
  sellPriceVAT: string;
  taxRate: string;
  picture: string;
  description: string;
  category: "water" | "supplies";
}

export const AddNewGoodForm = () => {
  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast, showErrorToast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Goods>({
    defaultValues: {
      lastInvoiceDate: "",
      lastInvoiceNumber: "",
      name: "",
      quantity: "",
      unitPrice: "",
      buyPrice: "",
      buyPriceVAT: "",
      itemCode: "",
      netBuyWorth: "",
      netSaleWorth: "",
      sellPrice: "",
      sellPriceVAT: "",
      taxRate: "",
      picture: "",
      category: "water",
    },
    resolver: yupResolver(validationSchema as any),
  });

  const onSubmit = async (data: Goods) => {
    console.log("Errors: ", errors); // Додайте цей рядок
    try {
      await setDoc(doc(db, `goods`, data.itemCode), data);
      await setDoc(doc(db, `goodsInventory`, data.itemCode), {
        lastInvoiceDate: dayjs().format("DD-MM-YYYY"),
        lastInvoiceNumber: "",
        name: data.name,
        quantity: data.quantity,
      });
      reset();
      showSuccessToast("Form successfully submitted");
    } catch (error) {
      showErrorToast("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      marginBlock="20px"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap="10px"
    >
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        gap="10px"
        flexWrap="wrap"
      >
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"itemCode"}
            control={control}
            type="number"
            label="Enter good code"
            error={!!errors.itemCode}
            helperText={errors.itemCode?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"name"}
            control={control}
            type="string"
            label="Enter good name "
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
        </Box>
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"quantity"}
            control={control}
            type="number"
            label="Enter quantity "
            error={!!errors.quantity}
            helperText={errors.quantity?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"unitPrice"}
            control={control}
            type="number"
            label="Enter Unit Price "
            error={!!errors.unitPrice}
            helperText={errors.unitPrice?.message as string}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        gap="10px"
        flexWrap="wrap"
      >
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"buyPrice"}
            control={control}
            type="number"
            label="Enter Buy Price"
            error={!!errors.buyPrice}
            helperText={errors.buyPrice?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"buyPriceVAT"}
            control={control}
            type="number"
            label="Enter Buy Price VAT "
            error={!!errors.buyPriceVAT}
            helperText={errors.buyPriceVAT?.message as string}
          />
        </Box>
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"netBuyWorth"}
            control={control}
            type="number"
            label="Enter Net Buy Worth "
            error={!!errors.netBuyWorth}
            helperText={errors.netBuyWorth?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"netSaleWorth"}
            control={control}
            type="number"
            label="Enter Net Sale Worth"
            error={!!errors.netSaleWorth}
            helperText={errors.netSaleWorth?.message as string}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        gap="10px"
        flexWrap="wrap"
      >
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"sellPrice"}
            control={control}
            type="number"
            label="Enter Sell Price"
            error={!!errors.sellPrice}
            helperText={errors.sellPrice?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"sellPriceVAT"}
            control={control}
            type="number"
            label="Enter Sell Price VAT "
            error={!!errors.sellPriceVAT}
            helperText={errors.sellPriceVAT?.message as string}
          />
        </Box>
        <Box display="flex" flexDirection="row" gap="10px" sx={{ flex: 1 }}>
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"taxRate"}
            control={control}
            type="number"
            label="Enter Tax Rate "
            error={!!errors.taxRate}
            helperText={errors.taxRate?.message as string}
          />
          <GoodsIncomingFormInputItem
            sx={{ flex: 1 }}
            name={"picture"}
            control={control}
            type="string"
            label="Enter Picture Link"
            error={!!errors.picture}
            helperText={errors.picture?.message as string}
          />
        </Box>
      </Box>

      <Controller
        name={`category`}
        control={control}
        render={({ field: controllerField }) => (
          <SelectItem
            value={controllerField.value}
            id="category"
            onChange={(value) => {
              controllerField.onChange(value);
            }}
            label="Select category"
            values={["water", "supplies"].map((good) => ({
              value: good,
              label: good,
            }))}
          />
        )}
      />

      <GoodsIncomingFormInputItem
        name={"description"}
        control={control}
        type="string"
        label="Enter description"
        error={!!errors.description}
        helperText={errors.description?.message as string}
        multiline
      />
      <Button
        type="submit"
        variant="contained"
        size={isSmallScreen ? "small" : "medium"}
        sx={{
          width: isSmallScreen ? "100%" : "200px",
          textTransform: "capitalize",
          background: "#478547",
          ":hover": {
            background: "#356435",
          },
        }}
      >
        <CheckCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
        Submit
      </Button>
    </Box>
  );
};
