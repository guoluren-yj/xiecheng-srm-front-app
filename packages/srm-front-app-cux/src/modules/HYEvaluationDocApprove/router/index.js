let route = [ {
  path: "/EvaluationDocApproveList",
  name: "EvaluationDocApproveList",
  meta: {
    appName: "绩效综合评估"
  },
  component: (resolve) => require([ "../views/EvaluationDocApproveList" ], resolve),
}, {
  path: "/EvaluationDocApproveDetail",
  name: "EvaluationDocApproveDetail",
  meta: {
    appName: "绩效综合评估"
  },
  component: (resolve) => require([ "../views/EvaluationDocApproveDetail" ], resolve),
}, ];


export default route;

