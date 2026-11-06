let route = [
  {
    path: "/SumeidaOrderProgressList",
    name: "SumeidaOrderProgressList",
    meta:{
      appName:"订单执行进度"
    },
    component: (resolve) => require([ "../views/Sumeida_OrderProgressList.vue" ], resolve),
  },
  {
    path: "/SumeidaOrderProgressDetail",
    name: "Sumeida_OrderProgressDetail.vue",
    meta:{
      appName:"订单执行进度"
    },
    component: (resolve) => require([ "../views/Sumeida_OrderProgressDetail.vue" ], resolve),
  },
];

export default route;
