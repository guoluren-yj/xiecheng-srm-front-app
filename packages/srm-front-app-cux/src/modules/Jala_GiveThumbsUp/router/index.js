let route = [
  {
    path: "/SupplierGiveThumbsUp",
    name: "SupplierGiveThumbsUp",
    meta:{
      appName:"供应商点赞"
    },
    component: (resolve) => require([ "../views/SupplierGiveThumbsUp" ], resolve),
  },
  {
    path: "/SupplierGiveThumbsLikeLaunch",
    name: "SupplierGiveThumbsLikeLaunch",
    meta:{
      appName:"点赞发起"
    },
    component: (resolve) => require([ "../views/SupplierGiveThumbsLikeLaunch" ], resolve),
  },
  {
    path: "/SupplierGiveThumbsRanking",
    name: "SupplierGiveThumbsRanking",
    meta:{
      appName:"点赞排行榜"
    },
    component: (resolve) => require([ "../views/SupplierGiveThumbsRanking" ], resolve),
  },
  {
    path: "/SupplierGiveThumbsRecord",
    name: "SupplierGiveThumbsRecord",
    meta:{
      appName:"点赞记录"
    },
    component: (resolve) => require([ "../views/SupplierGiveThumbsRecord" ], resolve),
  },
];

export default route;

