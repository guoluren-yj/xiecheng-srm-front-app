
let route = [
  {
    path: "/ContractDetail",
    name: "ContractDetail",
    meta: {
      appName: "协议工作台",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/ContractDetail" ], resolve),
  },
];

export default route;