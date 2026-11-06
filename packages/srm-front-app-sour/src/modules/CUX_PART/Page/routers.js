let route = [
  {
    path: "/DeboSupplierBiddingDetail",
    name: "DeboSupplierBiddingDetail",
    meta: {
      appName: "供应商报价",
      tenantNum: "SRM-DEBO",
      coverPath: "/SupplierBiddingDetail",
    },
    component: (resolve) => require([ "./DeboSupplierBiddingDetail.vue" ], resolve),
  },
];

export default route;