let route = [
  // 质检分配
  {
    path: "/LNGQualificationList",
    name: "LNGQualificationList",
    meta: {
      appName: "资质查询",
    },
    component: (resolve) => require([ "../views/LNGQualificationList" ], resolve),
  },
];

export default route;