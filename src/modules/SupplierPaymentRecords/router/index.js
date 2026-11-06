let route = [
  {
    path: "/SupplierPaymentRecordList",
    name: "SupplierPaymentRecordList",
    meta: {
      appName: "供应商缴费记录"
    },
    component: (resolve) => require([ "../views/SupplierPaymentRecordList" ], resolve),
  },
  // {
  //   path: "/Payment",
  //   name: "Payment",
  //   meta: {
  //     appName: "支付台",
  //   },
  //   component: (resolve) => require([ "../../Payment/views/Payment" ], resolve),
  // },
  // {
  //   path: "/ThirdPayWeb",
  //   name: "ThirdPayWeb",
  //   meta: {
  //     appName: "支付台",
  //   },
  //   component: (resolve) => require([ "../../Payment/views/ThirdPayWeb" ], resolve),
  // },
  // {
  //   path: "/PaymentResult",
  //   name: "PaymentResult",
  //   meta: {
  //     appName: "支付台",
  //   },
  //   component: (resolve) => require([ "../../Payment/views/PaymentResult" ], resolve),
  // },
  // {
  //   path: "/PaymentUrlCopy",
  //   name: "PaymentUrlCopy",
  //   meta: {
  //     appName: "支付台",
  //   },
  //   component: (resolve) => require([ "../../Payment/views/PaymentUrlCopy" ], resolve),
  // }
];

export default route;
