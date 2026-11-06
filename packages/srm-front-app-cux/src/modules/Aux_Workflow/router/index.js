let route = [

  {
    path: "/Aux_workflowList",
    name: "Aux_workflowList",
    component: (resolve) => require([ "../views/Aux_workflowList" ], resolve),
  },
  {
    path: "/Aux_workflowDetail",
    name: "Aux_workflowDetail",
    component: (resolve) => require([ "../views/Aux_workflowDetail" ], resolve),
  }
];

export default route;