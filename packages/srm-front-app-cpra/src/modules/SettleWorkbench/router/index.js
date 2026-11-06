let route = [
  {
    path: "/PurchaseSettleList",
    name: "PurchaseSettleList",
    meta: {
      appName: "采购方结算单工作台", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/PurchaseSettleList" ], resolve),
  },
  {
    path: "/PurchaseSettleDetail",
    name: "PurchaseSettleDetail",
    meta: {
      appName: "采购方结算单工作台", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/PurchaseSettleDetail" ], resolve),
  },
  {
    path: "/SupplySettleList",
    name: "SupplySettleList",
    meta: {
      appName: "销售方结算单工作台", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
    },
    component: (resolve) => require([ "../views/SupplySettleList" ], resolve),
  },
  {
    path: "/SupplySettleDetail",
    name: "SupplySettleDetail",
    meta: {
      appName: "销售方结算单工作台", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
    },
    component: (resolve) => require([ "../views/SupplySettleDetail" ], resolve),
  },
  {
    path: "/PurchasePrePaymentDetail",
    name: "PurchasePrePaymentDetail",
    meta:{
      appName:"采购方预付款详情", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/PurchasePrePaymentDetail" ], resolve),
  },
  {
    path: "/SupplyPrePaymentDetail",
    name: "SupplyPrePaymentDetail",
    meta:{
      appName:"销售方预付款详情", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
    },
    component: (resolve) => require([ "../views/SupplyPrePaymentDetail" ], resolve),
  },
];
export default route;