let route = [
  {
    path: "/EvaluateArchivesFillList",
    name: "EvaluateArchivesFillList",
    meta: {
      appName: "考评档案填制",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/EvaluateArchivesFillList.vue" ], resolve),
  },
  {
    path: "/EvaluateArchivesFillDetail",
    name: "EvaluateArchivesFillDetail",
    meta: {
      appName: "考评档案填制详情页",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/EvaluateArchivesFillDetail.vue" ], resolve),
  },
];

export default route;
