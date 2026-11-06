// import InvoiceInspection from '../views/InvoiceInspection'
// import InvoiceSuccessList from '../views/InvoiceSuccessList'
// import InvoiceExceptionList from '../views/InvoiceExceptionList'
// import ManualEntry from '../views/ManualEntry'
// import OcrRecognition from '../views/OcrRecognition'
// import InvoiceSuccessDetail from '../views/InvoiceSuccessDetail'
// import InvoiceExceptionDetail from '../views/InvoiceExceptionDetail'
// import EditableDetail from '../views/EditableDetail'

let route = [
  {
    path: "/InvoiceInspection",
    name: "InvoiceInspection",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceInspection" ], resolve),
  },
  {
    path: "/InvoiceSuccessList",
    name: "InvoiceSuccessList",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceSuccessList" ], resolve),
  },
  {
    path: "/InvoiceExceptionList",
    name: "InvoiceExceptionList",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceExceptionList" ], resolve),
  },
  {
    path: "/OcrRecognition",
    name: "OcrRecognition",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/OcrRecognition" ], resolve),
  },
  {
    path: "/ManualEntry",
    name: "ManualEntry",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ManualEntry" ], resolve),
  },
  {
    path: "/InvoiceSuccessDetail",
    name: "InvoiceSuccessDetail",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceSuccessDetail" ], resolve),
  },
  {
    path: "/InvoiceExceptionDetail",
    name: "InvoiceExceptionDetail",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvoiceExceptionDetail" ], resolve),
  },
  {
    path: "/EditableDetail",
    name: "EditableDetail",
    meta: {
      appName: "发票查验",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/EditableDetail" ], resolve),
  }
];

export default route;
