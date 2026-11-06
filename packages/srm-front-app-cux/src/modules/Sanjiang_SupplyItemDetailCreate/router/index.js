let route = [
  {
    path: "/SJSupplyItemDetailCreate",
    name: "SJSupplyItemDetailCreate",
    meta:{
      appName:"供货单明细创建"
    },
    component: (resolve) => require([ "../views/SJSupplyItemDetailCreate.vue" ], resolve),
  },
  {
    path: "/SJSupplyItemDetailEdit",
    name: "SJSupplyItemDetailEdit",
    meta:{
      appName:"供货单明细创建"
    },
    component: (resolve) => require([ "../views/SJSupplyItemDetailEdit.vue" ], resolve),
  },
];

export default route;
