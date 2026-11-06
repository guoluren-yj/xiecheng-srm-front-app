let route = [
  // 供应商/专家提前参与
  {
    path: "/SupplierParticipatio",
    name: "SupplierParticipatio",
    meta: {
      appName: "供应商/专家提前参与",
    },
    component: (resolve) => require([ "../views/SupplierParticipatio" ], resolve),
  },
  {
    path: "/SupplierParticipatioDetail",
    name: "SupplierParticipatioDetail",
    meta: {
      appName: "供应商/专家提前参与明细",
    },
    component: (resolve) => require([ "../views/SupplierParticipatioDetail" ], resolve),
  },
];

export default route;