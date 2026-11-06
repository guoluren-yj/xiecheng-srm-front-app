
let route = [
  {
    path: "/FindBusinessList",
    name: "FindBusinessList",
    meta:{
      appName:"寻商问品",
    },
    component: (resolve) => require([ "../views/FindBusinessList" ], resolve),
  },
  {
    path: "/FindBusinessSearch",
    name: "FindBusinessSearch",
    meta:{
      appName:"寻商问品",
    },
    component: (resolve) => require([ "../views/FindBusinessSearch" ], resolve),
  },
  {
    path: "/FindBusinessDetail",
    name: "FindBusinessDetail",
    meta:{
      appName:"寻商问品",
    },
    component: (resolve) => require([ "../views/FindBusinessDetail" ], resolve),
  }
];

export default route;
