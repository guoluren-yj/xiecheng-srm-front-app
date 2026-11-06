let route = [
  // 点位管理
  {
    path: "/PointondeMandList",
    name: "PointondeMandList",
    meta: {
      appName: "点位管理",
    },
    component: (resolve) => require([ "../views/PointondeMandList" ], resolve),
  },
  {
    path: "/PointondeMandDetails",
    name: "PointondeMandDetails",
    meta: {
      appName: "点位管理明细",
    },
    component: (resolve) => require([ "../views/PointondeMandDetails" ], resolve),
  },
];

export default route;