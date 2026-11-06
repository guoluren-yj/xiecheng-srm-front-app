let route = [
  // 基准价确认列表
  {
    path: "/aks_ConfirmBasicPriceList",
    name: "aks_ConfirmBasicPriceList",
    meta:{
      appName:"基准价确认"
    },
    component: (resolve) => require([ "../views/aks_ConfirmBasicPriceList" ], resolve),
  },
  // 确认基准价
  {
    path: "/aks_ConfirmBasicPrice",
    name: "aks_ConfirmBasicPrice",
    meta:{
      appName:"基准价确认"
    },
    component: (resolve) => require([ "../views/aks_ConfirmBasicPrice" ], resolve),
  },
  // RFX单据详情
  {
    path:  "/aks_RfxReportDetail",
    name: "aks_RfxReportDetail",
    meta:{
      appName:"基准价确认"
    },
    component: (resolve) => require([ "../views/RfxHall" ], resolve),
  }
];

export default route;