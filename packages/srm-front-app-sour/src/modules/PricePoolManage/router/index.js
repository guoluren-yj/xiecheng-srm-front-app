
let route = [
  {
    path: "/PricePoolManageList",
    name: "PricePoolManageList",
    meta:{
      appName:"价格库配置管理",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PricePoolManageList" ], resolve),
  },
  {
    path: "/PricePoolManageDetail",
    name: "PricePoolManageDetail",
    meta:{
      appName:"价格库配置管理详情页",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PricePoolManageDetail" ], resolve),
  },
];

export default route;
