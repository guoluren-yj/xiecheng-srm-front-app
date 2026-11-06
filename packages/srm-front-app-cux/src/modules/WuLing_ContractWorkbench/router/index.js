let route = [
  {
    path: "/WuLing_ContractWorkbench/List",
    name: "WuLing_ContractWorkbench",
    meta: {
      appName: "合同工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/WuLing_ContractWorkbench/Detail",
    name: "WuLing_ContractWorkbench_Detail",
    meta: {
      appName: "合同工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
