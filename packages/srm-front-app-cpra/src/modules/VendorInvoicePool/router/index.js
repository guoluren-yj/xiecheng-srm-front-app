let route = [
  {
    path: "/VendorInvoicePool",
    name: "VendorInvoicePool",
    meta:{
      appName: "销售方发票池"
    },
    component: (resolve) => require([ "../views/VendorInvoicePool" ], resolve),
  },
  {
    path: "/VendorInvoiceInfo",
    name: "VendorInvoiceInfo",
    meta:{
      appName: "销售方发票池"
    },
    component: (resolve) => require([ "../views/InvoiceInfo" ], resolve),
  }
];

export default route;
