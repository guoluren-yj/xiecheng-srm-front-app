
let route = [
  {
    path: "/PurEvaluationList",
    name: "PurEvaluationList",
    meta:{
      appName:"评估工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PurEvaluationList" ], resolve),
  },
  {
    path: "/PurEvaluationManageDetail",
    name: "PurEvaluationManageDetail",
    meta:{
      appName:"评估工作台-管理详情页",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PurEvaluationManageDetail" ], resolve),
  },
  {
    path: "/PurEvaluationManageCreate",
    name: "PurEvaluationManageCreate",
    meta:{
      appName:"评估工作台-管理创建页面",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PurEvaluationManageCreate" ], resolve),
  },
  {
    path: "/PurEvaluationScoreDetail",
    name: "PurEvaluationScoreDetail",
    meta:{
      appName:"评估工作台-评分详情页",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/PurEvaluationScoreDetail" ], resolve),
  },
  {
    path: "/IndicatorMaintain",
    name: "IndicatorMaintain",
    meta:{
      appName:"评估工作台-评分详情页-下级指标",
    },
    component: (resolve) => require([ "../component/IndicatorMaintain.vue" ], resolve),
  },
];

export default route;
