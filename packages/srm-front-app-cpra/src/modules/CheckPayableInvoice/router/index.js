// import CheckPayableInvoiceList from '../views/CheckPayableInvoiceList'
// import CheckPayableInvoiceDetail from '../views/CheckPayableInvoiceDetail'

let route = [
  {
    path: "/CheckPayableInvoiceList",
    name: "CheckPayableInvoiceList",
    meta:{
      appName:"审核应付发票",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/CheckPayableInvoiceList" ], resolve),
  },
  {
    path: "/CheckPayableInvoiceDetail",
    name: "CheckPayableInvoiceDetail",
    meta:{
      appName:"审核应付发票",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/CheckPayableInvoiceDetail" ], resolve),
  },
];

export default route;
