let route = [
  {
    path: "/PurchaseRobot",
    name: "PurchaseRobot",
    meta: {
      appName: "问答助手",
    },
    component: (resolve) => require(["../views/PurchaseRobot"], resolve),
  },
];

export default route;
