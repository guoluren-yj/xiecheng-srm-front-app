let route = [
  // 质检分配
  {
    path: "/PCIQualityInspectionList",
    name: "PCIQualityInspectionList",
    meta: {
      appName: "质检分配",
    },
    component: (resolve) => require([ "../views/PCIQualityInspectionList" ], resolve),
  },
  {
    path: "/PCIQualityInspectionDetails",
    name: "PCIQualityInspectionDetails",
    meta: {
      appName: "质检分配明细",
    },
    component: (resolve) => require([ "../views/PCIQualityInspectionDetails" ], resolve),
  },

];

export default route;