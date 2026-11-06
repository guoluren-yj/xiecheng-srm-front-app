let route = [
  {
    path: "/XBPackingMaterialManage",
    name: "XBPackingMaterialManage",
    meta:{
      appName:"包材管理"
    },
    component: (resolve) => require([ "../views/XBPackingMaterialManage.vue" ], resolve),
  },
  {
    path: "/XBPackingMaterialsDetail",
    name: "XBPackingMaterialsDetail",
    meta:{
      appName:"包材管理"
    },
    component: (resolve) => require([ "../views/XBPackingMaterialsDetail.vue" ], resolve),
  },
];

export default route;
