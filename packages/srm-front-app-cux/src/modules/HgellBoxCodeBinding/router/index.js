let route = [
  // 箱码绑定
  {
    path: "/BoxCodeBinding",
    name: "BoxCodeBinding",
    meta: {
      appName: "箱码绑定",
    },
    component: (resolve) => require([ "../views/BoxCodeBinding" ], resolve),
  },
];

export default route;