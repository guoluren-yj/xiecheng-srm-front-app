let route = [
  {
    path: "/purchaseRobotUpload",
    name: "purchaseRobotUpload",
    meta: {
      appName: "采购助手文件上传"
    },
    component: (resolve) => require([ "../views/upload" ], resolve),
  },
  {
    path: "/purchaseRobotImport",
    name: "purchaseRobotImport",
    meta: {
      appName: "采购助手文件上传"
    },
    component: (resolve) => require([ "../views/import" ], resolve),
  },
];
export default route;
