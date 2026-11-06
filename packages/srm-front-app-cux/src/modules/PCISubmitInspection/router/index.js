let route = [
  // 质检分配
  {
    path: "/PCISubmitInspectionList",
    name: "PCISubmitInspectionList",
    meta: {
      appName: "送检质检",
    },
    component: (resolve) => require([ "../views/PCISubmitInspectionList" ], resolve),
  },
  {
    path: "/PCISubmitInspectionDetails",
    name: "PCISubmitInspectionDetails",
    meta: {
      appName: "质检明细",
    },
    component: (resolve) => require([ "../views/PCISubmitInspectionDetails" ], resolve),
  },

];

export default route;