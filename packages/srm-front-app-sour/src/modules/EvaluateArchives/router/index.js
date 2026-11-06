let route = [
  {
    path: "/EvaluateArchivesList",
    name: "EvaluateArchivesList",
    meta: {
      appName: "考评档案管理",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/EvaluateArchivesList.vue" ], resolve),
  },
  {
    path: "/EvaluateArchivesManageDetail",
    name: "EvaluateArchivesManageDetail",
    meta: {
      appName: "考评档案管理详情页",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/EvaluateArchivesManageDetail.vue" ], resolve),
  },
];

export default route;
