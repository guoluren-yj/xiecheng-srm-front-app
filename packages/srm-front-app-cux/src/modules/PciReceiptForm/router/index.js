let route = [
  {
    path: "/PciReceiptForm",
    name: "PciReceiptForm",
    meta: {
      appName: "收货执行",
    },
    component: (resolve) => require([ "../views/PciReceiptForm.vue" ], resolve),
  },
  {
    path: "/PciReceiptFormDetail",
    name: "PciReceiptFormDetail",
    meta: {
      appName: "收货执行详情",
    },
    component: (resolve) => require([ "../views/PciReceiptFormDetail.vue" ], resolve),
  },

];

export default route;