export const formatCurrency = (val: number) =>
  new Intl.NumberFormat("ru-RU", { 
    style: "currency", 
    currency: "RUB", 
    maximumFractionDigits: 0 
  }).format(val)