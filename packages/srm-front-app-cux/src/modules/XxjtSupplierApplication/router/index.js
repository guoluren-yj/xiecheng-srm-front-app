let route = [
  {
    path: "/XxjtSupplierApplication",
    name: "XxjtSupplierApplication",
    meta: {
      appName: "供应商标的管理详情",
    },
    component: (resolve) =>
      require([ "../XxjtSupplierApplicationApproval" ], resolve),
  },
];

export default route;
