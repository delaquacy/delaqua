import { Goods, OrdersData } from "../types";

export const generateInvoiceTableRows = (order: OrdersData, goods: Goods[]) => {
  const calculation = {
    net5Sum: 0,
    net19Sum: 0,
    vat5: 0,
    vat19: 0,
    netVal: 0,
    vatVal: 0,
  };

  const bodyRows = order.items?.map((item) => {
    const good = goods.find((good) => +good.itemCode === +item.itemCode);

    if (good && +good.taxRate === 5) {
      calculation.net5Sum += +item.count * +good?.netSaleWorth;
      calculation.vat5 += +item.count * +good.sellPriceVAT;
      calculation.vatVal += +item.count * +good.sellPriceVAT;
    }

    if (good && +good.taxRate === 19) {
      calculation.net19Sum += +item.count * +good?.netSaleWorth;
      calculation.vat19 += +item.count * +good.sellPriceVAT;
      calculation.vatVal += +item.count * +good.sellPriceVAT;
    }

    calculation.netVal += (good && +item.count * +good?.netSaleWorth) || 0;

    return (
      good && [
        item.itemCode,
        item.name,
        `${item.count}`,
        `€${(+item.sellPrice).toFixed(2)}`,
        `${good?.taxRate}%`,
        `€${(+good?.netSaleWorth).toFixed(2)}`,
        `€${(+item?.sum).toFixed(2)}`,
      ]
    );
  });

  return { bodyRows, calculation };
};
