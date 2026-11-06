// import SupplierQuotationList from '../views/SupplierQuotationList'
// import PrequalificationDetail from '../views/PrequalificationDetail'
// import PrequalificationApprove from '../views/PrequalificationApprove'
// import SupplierBiddingDetail from '../views/SupplierBiddingDetail'
// import LadderQuotation from '../views/LadderQuotation'
// import SupplierBiddingMaterialInfo from '../views/SupplierBiddingMaterialInfo'


let route = [
  {
    path: "/SupplierQuotationList",
    name: "SupplierQuotationList",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/SupplierQuotationList" ], resolve),
  },
  {
    path: "/PrequalificationDetail",
    name: "PrequalificationDetail",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/PrequalificationDetail" ], resolve),
  },
  {
    path: "/PrequalificationApprove",
    name: "PrequalificationApprove",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/PrequalificationApprove" ], resolve),
  },
  {
    path: "/SupplierBiddingDetail",
    name: "SupplierBiddingDetail",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/SupplierBiddingDetail" ], resolve),
  }, 
  // 报价查询
  {
    path: "/SupplierQueryQuotationDetail",
    name: "SupplierQueryQuotationDetail",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/SupplierQueryQuotationDetail" ], resolve),
  },
  {
    path: "/PrequalificationApproveDetail",
    name: "PrequalificationApproveDetail",
    meta: {
      appName: "供应商报价"
    },
    component: (resolve) => require([ "../views/PrequalificationApproveDetail" ], resolve),
  },
];

export default route;
