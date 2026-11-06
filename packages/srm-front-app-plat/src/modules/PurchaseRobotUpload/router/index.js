let route = [
  {
    path: "/purchaseRobotUpload",
    name: "purchaseRobotUpload",
    meta: {
      appName: "采购助手文件上传"
    },
    component: (resolve) => require([ "../views/upload" ], resolve),
  },
];
export default route;
