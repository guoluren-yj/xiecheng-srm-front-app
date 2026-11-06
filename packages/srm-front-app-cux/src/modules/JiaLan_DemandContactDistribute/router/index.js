let route = [
  {
    path: "/DemandContactDistributeList",
    name: "DemandContactDistributeList",
    meta:{
      appName:"需求联络单分配"
    },
    component: (resolve) => require([ "../views/DemandContactDistributeList" ], resolve),
  },
  {
    path: "/DemandContactDistributeDetail",
    name: "DemandContactDistributeDetail",
    meta:{
      appName:"需求联络单分配"
    },
    component: (resolve) => require([ "../views/DemandContactDistributeDetail" ], resolve),
  },
];


export default route;

