let route = [
  {
    path: "/PurchaserInvoicePool",
    name: "PurchaserInvoicePool",
    meta:{
      appName: "采购方发票池",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PurchaserInvoicePool" ], resolve),
  },
  {
    path: "/InvoiceInfo",
    name: "InvoiceInfo",
    meta:{
      appName: "采购方发票池",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceInfo" ], resolve),
  }
];

export default route;
