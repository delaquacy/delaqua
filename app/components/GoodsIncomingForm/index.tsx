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
import {
  Controller,
  FieldError,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import { t } from "i18next";

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
  total: string;
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
  items?: {
    id: string;
    itemName: string;
    quantity: string;
    total: string;
  }[];
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
      items: [{ id: "1", itemName: "", quantity: "", total: "" }],
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
        width={isSmallScreen ? "100%" : "50%"}
      >
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap="10px"
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Box display="flex" flexDirection="column">
                <DatePicker
                  {...field}
                  label="Invoice date"
                  format="DD-MM-YYYY"
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
          <Controller
            name="invoiceNumber"
            control={control}
            render={({ field }) => (
              <Box display="flex" flexDirection="column">
                <TextField
                  {...field}
                  id="invoice-number"
                  error={!!errors.invoiceNumber}
                  helperText={errors.invoiceNumber?.message as string}
                  color="info"
                  label="Enter Invoice number"
                  size={isSmallScreen ? "small" : "medium"}
                  variant="outlined"
                />
                {!errors.invoiceNumber?.message && (
                  <Box
                    sx={{
                      height: "23px",
                    }}
                  ></Box>
                )}
              </Box>
            )}
          />
        </Box>

        {fields.map((field, index) => (
          <Box display="flex" alignItems="start" gap="10px" key={field.id}>
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
            <Controller
              name={`items.${index}.quantity`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  color="info"
                  type="number"
                  label="Enter quantity"
                  size={isSmallScreen ? "small" : "medium"}
                  variant="outlined"
                  error={!!errors.items?.[index]?.quantity}
                  helperText={errors.items?.[index]?.quantity?.message}
                />
              )}
            />
            <Box display="flex" flexDirection="column">
              <Controller
                name={`items.${index}.total`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    color="info"
                    type="number"
                    label="Enter total"
                    size={isSmallScreen ? "small" : "medium"}
                    variant="outlined"
                    error={!!errors.items?.[index]?.total}
                    helperText={errors.items?.[index]?.total?.message as string}
                  />
                )}
              />
              {!errors?.items?.[index]?.quantity?.message &&
                !errors.items?.[index]?.total?.message && (
                  <Box
                    sx={{
                      height: "23px",
                    }}
                  ></Box>
                )}
            </Box>

            <Tooltip
              title={t("removeFilter")}
              onClick={() => remove(index)}
              sx={{
                transform: "translateY(12px)",
                width: isSmallScreen ? "20px" : "30px",
                height: isSmallScreen ? "20px" : "30px",
                cursor: "pointer",
                color: "gray",
              }}
            >
              <Delete fontSize={isSmallScreen ? "small" : "medium"} />
            </Tooltip>
          </Box>
        ))}

        <Box display="flex" flexDirection="column">
          <Controller
            name="total"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="total"
                color="info"
                label="Total invoice sum"
                size="small"
                variant="outlined"
                error={!!errors.total}
                helperText={errors.total?.message as string}
              />
            )}
          />
          {!errors.total?.message && (
            <Box
              sx={{
                height: "23px",
              }}
            ></Box>
          )}
        </Box>

        <Box display="flex" flexDirection="row" gap="20px">
          <Button
            variant="contained"
            onClick={() => {
              console.log("before append", `${fields.length + 1}`);
              append({
                id: `${fields.length + 1}`,
                itemName: "",
                quantity: "",
                total: "",
              });
            }}
            size={isSmallScreen ? "small" : "medium"}
            sx={{
              flex: 1,
              textTransform: "capitalize",
              fontSize: isSmallScreen ? "10px" : "12px",
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
              fontSize: isSmallScreen ? "10px" : "12px",
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
