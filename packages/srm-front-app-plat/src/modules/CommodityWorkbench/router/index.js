let route = [
  {
    path: "/CommodityWorkbenchPurchaserList",
    name: "CommodityWorkbenchPurchaserList",
    meta:{
      appName: "商品工作台（采）",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/PurchaserList.vue" ], resolve),
  },
  {
    path: "/CommodityWorkbenchPurchaserDetail",
    name: "CommodityWorkbenchPurchaserDetail",
    meta:{
      appName: "商品工作台（采）",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/PurchaserDetail.vue" ], resolve),
  },
];

export default route;
