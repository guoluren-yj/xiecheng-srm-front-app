let route = [
  {
    path: "/MaterialCertificationDetail",
    name: "MaterialCertificationDetail",
    meta: {
      appName: "采购方物料认证工作台",
      // isPurchase: true,
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
