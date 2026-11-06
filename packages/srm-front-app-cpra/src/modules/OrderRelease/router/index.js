let route = [
  {
    path: "/OrderReleaseList",
    name: "OrderReleaseList",
    meta:{
      appName:"订单发布"
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/OrderReleaseDetail",
    name: "OrderReleaseDetail",
    meta:{
      appName:"订单发布"
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
