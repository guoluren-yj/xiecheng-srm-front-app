let route = [
  {
    path: "/GEISHI_MyOrder/CreateDocumnet",
    name: "CreateDocumnet",
    meta: {
      appName: "引用申请转订单",
    },
    component: (resolve) => require([ "../views/CreateDocumnet" ], resolve),
  },
  {
    path: "/GEISHI_MyOrder/ToBeSubmittedDetail",
    name: "toBeSubmittedDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) => require([ "../views/ToBeSubmittedDetail" ], resolve),
  },
];

export default route;
