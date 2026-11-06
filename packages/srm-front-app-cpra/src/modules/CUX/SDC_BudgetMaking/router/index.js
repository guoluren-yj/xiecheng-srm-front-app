let route = [
  {
    path: "/SDCBudgetList",
    name: "SDCBudgetList",
    meta:{
      appName:"预算编制",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SDCBudgetList" ], resolve),
  },
  {
    path: "/SDCBudgetDetail",
    name: "SDCBudgetDetail",
    meta:{
      appName:"预算编制",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SDCBudgetDetail" ], resolve),
  },
];

export default route;
