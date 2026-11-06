let route = [
  {
    path: "/MonitorList",
    name: "MonitorList",
    meta:{
      appName:"全量监控企业管理",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MonitorList" ], resolve),
  },
];

export default route;
