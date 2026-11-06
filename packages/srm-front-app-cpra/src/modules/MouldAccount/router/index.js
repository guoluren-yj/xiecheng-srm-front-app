let route = [
    {
      path: "/MouldAccount",
      name: "MouldAccount",
      meta: {
        appName: "模具台账审批",
        isPurchase: true,
      },
      component: (resolve) => require([ "../views/List.vue" ], resolve),
    },
    {
      path: "/MouldAccountDetail",
      name: "MouldAccountDetail",
      meta: {
        appName: "模具台账审批详情",
        isPurchase: true,
      },
      component: (resolve) => require([ "../views/Detail.vue" ], resolve),
    }
  ];
  
  export default route;