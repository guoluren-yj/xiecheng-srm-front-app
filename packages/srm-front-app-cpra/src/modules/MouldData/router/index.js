let route = [
    {
      path: "/MouldData",
      name: "MouldData",
      meta: {
        appName: "模具主数据审批",
        isPurchase: true,
      },
      component: (resolve) => require([ "../views/List.vue" ], resolve),
    },
    {
      path: "/MouldDataDetail",
      name: "MouldDataDetail",
      meta: {
        appName: "模具主数据审批详情",
        isPurchase: true,
      },
      component: (resolve) => require([ "../views/Detail.vue" ], resolve),
    }
  ];
  
  export default route;