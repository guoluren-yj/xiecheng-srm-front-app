let route = [
  {
    path: "/EasyPreparePurchasingApproveList",
    name: "EasyPreparePurchasingApproveList",
    meta:{
      appName:"非商城采购申请"
    },
    component: (resolve) => require([ "../views/EasyPreparePurchasingApproveList" ], resolve),
  },
  {
    path: "/EasyPreparePurchasingApproveDetail",
    name: "EasyPreparePurchasingApproveDetail",
    meta:{
      appName:"非商城采购申请"
    },
    component: (resolve) => require([ "../views/EasyPreparePurchasingApproveDetail" ], resolve),
  },
];

export default route;
