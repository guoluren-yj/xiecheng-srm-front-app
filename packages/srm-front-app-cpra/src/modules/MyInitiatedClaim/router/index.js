let route = [
  {
    path: "/MyInitiatedClaimList",
    name: "MyInitiatedClaimList",
    meta: {
      appName: "我发起的索赔单", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/MyInitiatedClaimList" ], resolve),
  },
  {
    path: "/MyInitiatedClaimDetail",
    name: "MyInitiatedClaimDetail",
    meta: {
      appName: "我发起的索赔单详情", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/MyInitiatedClaimDetail" ], resolve),
  },
];
export default route;