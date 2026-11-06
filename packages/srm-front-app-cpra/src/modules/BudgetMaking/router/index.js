let route = [
  {
    path: "/BudgetList",
    name: "BudgetList",
    meta:{
      appName:"预算调拨",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BudgetList" ], resolve),
  },
  {
    path: "/BudgetDetail",
    name: "BudgetDetail",
    meta:{
      appName:"预算调拨",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BudgetDetail" ], resolve),
  },
];

export default route;
