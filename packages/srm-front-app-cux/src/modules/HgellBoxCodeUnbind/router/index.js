let route = [
  // 箱码绑定
  {
    path: "/BoxCodeUnbind",
    name: "BoxCodeUnbind",
    meta: {
      appName: "箱码解绑",
    },
    component: (resolve) => require([ "../views/BoxCodeUnbind" ], resolve),
  },
];

export default route;