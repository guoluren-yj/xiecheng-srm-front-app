let route = [
  {
    path: "/MaterialFeedBackDetail",
    name: "MaterialFeedBackDetail",
    meta: {
      appName: "供应方物料反馈工作台",
      // isPurchase: true,
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
