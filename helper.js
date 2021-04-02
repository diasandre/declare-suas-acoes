export const normalizeObject = ({ id, quantity, price, totalPrice }) => {
  return {
    id,
    quantity,
    price,
    totalPrice,
  };
};

export const normalizeObjectWhenBuy = (agg, item) => {
  return {
    id: item.id,
    quantity: agg.quantity + item.quantity,
    price: (agg.price + item.price) / 2,
    totalPrice: agg.totalPrice + item.totalPrice,
  };
};

export const normalizeObjectWhenSell = (agg, item) => {
  return {
    id: item.id,
    quantity: agg.quantity - item.quantity,
    price: agg.price,
    totalPrice: agg.totalPrice - item.totalPrice,
  };
};

export const formatPrice = (value) =>
  Number(value.replace(".", "").replace(",", "."));
