let route = [
  {
    path: "/SupplierSubscriptionPaymentRecordList",
    name: "SupplierSubscriptionPaymentRecordList",
    meta: {
      appName: "供应商订阅缴费记录",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/SupplierSubscriptionPaymentRecordList" ], resolve),
  },
];

export default route;
