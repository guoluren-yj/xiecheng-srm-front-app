let route = [
  {
    path: "/XXJTPlannedDistribute",
    name: "XXJTPlannedDistribute",
    meta: {
      appName: "计划分配",
    },
    component: (resolve) => require([ "../XXJTPlannedDistribute" ], resolve),
  },
  {
    path: "/XXJTPlannedDistributeDetails",
    name: "XXJTPlannedDistributeDetails",
    meta: {
      appName: "计划分配",
    },
    component: (resolve) => require([ "../XXJTPlannedDistributeDetails" ], resolve),
  },
];

export default route;
