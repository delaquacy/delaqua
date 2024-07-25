export const getSortedOrders = (orders: any[]) => {
  return orders.sort(
    (a: { createdAt: any }, b: { createdAt: any }) => a.createdAt - b.createdAt
  );
};
