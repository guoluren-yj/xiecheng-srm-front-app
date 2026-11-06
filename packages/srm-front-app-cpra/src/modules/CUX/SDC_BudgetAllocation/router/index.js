let route = [
  {
    path: "/BudgetAdjustList",
    name: "BudgetAdjustList",
    meta:{
      appName:"预算调拨",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BudgetAdjustList" ], resolve),
  },
  {
    path: "/BudgetAdjustDetail",
    name: "BudgetAdjustDetail",
    meta:{
      appName:"预算调拨",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BudgetAdjustDetail" ], resolve),
  },
];

export default route;
