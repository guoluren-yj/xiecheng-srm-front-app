let route = [
  {
    path: "/WuLing_CommodityWorkbench/List",
    name: "WuLing_CommodityWorkbenchList",
    meta:{
      appName: "商品工作台（采）",
      isPurchase: true
    },
    // @ts-ignore
    component: (resolve) => require([ "../views/WorkbenchList.vue" ], resolve),
  },
  {
    path: "/WuLing_CommodityWorkbench/detail",
    name: "ReceiveSkuDetail",
    // @ts-ignore
    component: (resolve) => require([ "../views/SkuDetail.vue" ], resolve),
  },
  {
    path: "/WuLing_CommodityWorkbench/upload",
    name: "UploadImage",
    // @ts-ignore
    component: (resolve) => require([ "../views/ImageMaintain.vue" ], resolve),
  },
];

export default route;
