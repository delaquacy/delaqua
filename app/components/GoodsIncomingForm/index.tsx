import { Box, Button, FormHelperText, TextField, Tooltip } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import SelectItem from "./Select";
import { getStaticGoodsArray } from "@/app/utils/getStaticGoodsArray";
import { useScreenSize, useToast } from "@/app/hooks";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  AddCircleOutline,
  CheckCircleOutline,
  Delete,
} from "@mui/icons-material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/config";
import { addItemsQuantityToInventoryTable } from "@/app/utils/addItemsToInventoryTable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import { t } from "i18next";
import { GoodsIncomingFormInputItem } from "./GoodsIncomingFormInputItem";

interface Goods {
  id: string;
  itemCode: string;
  name: string;
  picture: string;
  netBuyWorth: string;
  netSaleWorth: string;
  sellPrice: string;
  sellPriceVAT: string;
  taxRate: string;
  buyPrice: string;
  buyPriceVAT: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  itemCode?: string;
  quantity: string;
  netBuyWorth: string;
  buyPriceVAT: string;
}
export interface GoodsValues {
  id?: string;
  date: any;
  formFillDate: string;
  items: InventoryItem[];
  invoiceNumber: string;
  total: string;
}

export interface FormValues {
  date: dayjs.Dayjs | null;
  items?: InventoryItem[];
  invoiceNumber: string;
  total: string;
}

export const GoodsIncomingForm = () => {
  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast, showErrorToast } = useToast();

  const [goods, setGoods] = useState<Goods[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: dayjs(),
      invoiceNumber: "",
      items: [
        {
          id: "1",
          itemName: "",
          quantity: "",
          netBuyWorth: "",
          buyPriceVAT: "",
        },
      ],
      total: "",
    },
    resolver: yupResolver(validationSchema as any),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const getGoods = async () => {
    try {
      const data = await getStaticGoodsArray();
      setGoods(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      formFillDate: dayjs().format("DD-MM-YYYY"),
      date: dayjs(data.date).format("DD-MM-YYYY"),
      items: data?.items?.map((item) => ({
        ...item,
        itemCode: goods.find(({ name }) => name === item.itemName)?.itemCode,
      })),
    };

    try {
      await addItemsQuantityToInventoryTable(formattedData as GoodsValues);

      await addDoc(collection(db, `goodsIncomingInvoices`), formattedData);
      reset();
      showSuccessToast("Form successfully submitted");
    } catch (error) {
      showErrorToast("Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    getGoods();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap="15px"
      >
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          width="100%"
          gap="10px"
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Box
                display="flex"
                flexDirection="column"
                sx={{
                  flex: 1,
                }}
              >
                <DatePicker
                  {...field}
                  label="Invoice date"
                  format="DD-MM-YYYY"
                  sx={{
                    flex: 1,
                  }}
                />
                <FormHelperText
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                  {errors.date?.message}
                </FormHelperText>
              </Box>
            )}
          />

          <Box
            sx={{
              flex: 1,
            }}
          >
            <GoodsIncomingFormInputItem
              name={"invoiceNumber"}
              control={control}
              type="string"
              label="Enter Invoice number"
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber?.message as string}
            />
          </Box>
        </Box>

        {fields.map((field, index) => (
          <Box
            display="flex"
            alignItems="start"
            gap="10px"
            key={field.id}
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Box display="flex" flexDirection="row" gap="15px" width="100%">
              <Controller
                name={`items.${index}.itemName`}
                control={control}
                render={({ field: controllerField }) => (
                  <SelectItem
                    value={controllerField.value}
                    id={field.id}
                    onChange={(id, value, field) => {
                      controllerField.onChange(value);
                    }}
                    label="Select item"
                    values={goods.map((good) => ({
                      value: good.name,
                      label: good.name,
                    }))}
                  />
                )}
              />
              <GoodsIncomingFormInputItem
                name={`items.${index}.quantity` as any}
                control={control}
                type="number"
                label="Enter quantity"
                error={!!errors.items?.[index]?.quantity}
                helperText={errors.items?.[index]?.quantity?.message as string}
                sx={{ flex: 1 }}
              />
            </Box>

            <Box display="flex" flexDirection="row" gap="15px" width="100%">
              <GoodsIncomingFormInputItem
                name={`items.${index}.netBuyWorth` as any}
                control={control}
                type="number"
                label="Enter Net Buy Worth"
                error={!!errors.items?.[index]?.netBuyWorth}
                helperText={
                  errors.items?.[index]?.netBuyWorth?.message as string
                }
                sx={{ flex: 1 }}
              />

              <GoodsIncomingFormInputItem
                name={`items.${index}.buyPriceVAT` as any}
                control={control}
                type="number"
                label="Enter Buy Price VAT"
                error={!!errors.items?.[index]?.buyPriceVAT}
                helperText={
                  errors.items?.[index]?.buyPriceVAT?.message as string
                }
                sx={{ flex: 1 }}
              />

              <Box
                sx={{
                  width: "30px",
                  height: "30px",
                }}
              >
                {fields.length > 1 && (
                  <Tooltip
                    title={"Remove Item"}
                    onClick={() => remove(index)}
                    sx={{
                      transform: isSmallScreen
                        ? "translateY(5px)"
                        : "translateY(12px)",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      color: "gray",
                    }}
                  >
                    <Delete fontSize={isSmallScreen ? "small" : "medium"} />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        <GoodsIncomingFormInputItem
          name={"total"}
          control={control}
          type="number"
          label="Total invoice sum"
          error={!!errors.total}
          helperText={errors.total?.message as string}
        />

        <Box display="flex" flexDirection="row" gap="20px">
          <Button
            variant="contained"
            onClick={() => {
              console.log("before append", `${fields.length + 1}`);
              append({
                id: `${fields.length + 1}`,
                itemName: "",
                quantity: "",
                netBuyWorth: "",
                buyPriceVAT: "",
              });
            }}
            size={isSmallScreen ? "small" : "medium"}
            sx={{
              flex: 1,
              textTransform: "capitalize",
            }}
          >
            <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
            Add new field
          </Button>

          <Button
            type="submit"
            variant="contained"
            size={isSmallScreen ? "small" : "medium"}
            sx={{
              flex: 1,
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
      </Box>
    </LocalizationProvider>
  );
};
