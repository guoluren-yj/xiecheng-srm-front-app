let route = [
  {
    path: "/CreateInvoiceList",
    name: "CreateInvoiceList",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/CreateInvoiceList" ], resolve),
  },
  {
    path: "/CreateInvoiceDetail",
    name: "CreateInvoiceDetail",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/CreateInvoiceDetail" ], resolve),
  },
  {
    path: "/ManualEntryB",
    name: "ManualEntryB",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/ManualEntryB" ], resolve),
  },
  {
    path: "/OcrRecognitionB",
    name: "OcrRecognitionB",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/OcrRecognitionB" ], resolve),
  },
  {
    path: "/EditableDetailB",
    name: "EditableDetailB",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/EditableDetailB" ], resolve),
  },
  {
    path: "/OrderLineDetail",
    name: "OrderLineDetail",
    meta:{
      appName:"创建应收发票"
    },
    component: (resolve) => require([ "../views/OrderLineDetail" ], resolve),
  },
];

export default route;
