let route = [
  {
    path: "/DemandContactReleaseList",
    name: "DemandContactReleaseList",
    meta:{
      appName:"需求联络单发布"
    },
    component: (resolve) => require([ "../views/DemandContactReleaseList" ], resolve),
  },
  {
    path: "/DemandContactReleaseDetail",
    name: "DemandContactReleaseDetail",
    meta:{
      appName:"需求联络单发布"
    },
    component: (resolve) => require([ "../views/DemandContactReleaseDetail" ], resolve),
  },
];


export default route;

