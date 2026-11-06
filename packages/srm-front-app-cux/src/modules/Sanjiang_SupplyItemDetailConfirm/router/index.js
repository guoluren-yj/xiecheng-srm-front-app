let route = [
  {
    path: "/SJSupplyItemDetailConfirm",
    name: "SJSupplyItemDetailConfirm",
    meta:{
      appName:"供货明细确认"
    },
    component: (resolve) => require([ "../views/SJSupplyItemDetailConfirm.vue" ], resolve),
  },
  {
    path: "/SJSupplyItemDetailModify",
    name: "SJSupplyItemDetailModify",
    meta:{
      appName:"供货明细确认"
    },
    component: (resolve) => require([ "../views/SJSupplyItemDetailModify.vue" ], resolve),
  },
];

export default route;
