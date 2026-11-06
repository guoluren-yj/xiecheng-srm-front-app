
let route = [
  {
    path: "/WideAreaSourceList",
    name: "WideAreaSourceList",
    meta:{
      appName:"广域寻源",
    },
    component: (resolve) => require([ "../views/WideAreaSourceList" ], resolve),
  },
  {
    path: "/WideAreaSourceDetail",
    name: "WideAreaSourceDetail",
    meta:{
      appName:"广域寻源",
    },
    component: (resolve) => require([ "../views/WideAreaSourceDetail" ], resolve),
  }
];

export default route;
