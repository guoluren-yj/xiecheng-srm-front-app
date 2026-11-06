let route = [
  {
    path: "/XxjtBidApplication",
    name: "XxjtBidApplication",
    meta: {
      appName: "标的库管理",
    },
    component: (resolve) => require([ "../XxjtBidApplicationApproval" ], resolve),
  },
];

export default route;
