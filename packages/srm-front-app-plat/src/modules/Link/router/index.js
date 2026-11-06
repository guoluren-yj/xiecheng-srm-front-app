let route = [
  {
    path: "/Link",
    name: "Link",
    meta: {
      appName: "外链页面",
    },
    component: (resolve) => require([ "../views/Link" ], resolve),
  },
];

export default route;
