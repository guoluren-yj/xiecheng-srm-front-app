
let route = [
  {
    path: "/EnterpriseInformConfirmList",
    name: "EnterpriseInformConfirmList",
    meta:{
      appName:"企业信息变更审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/EnterpriseInformConfirmList" ], resolve),
  },
  {
    path: "/EnterpriseInformConfirmPlatDetail",
    name: "EnterpriseInformConfirmPlatDetail",
    meta:{
      appName:"企业信息变更审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/EnterpriseInformConfirmPlatDetail" ], resolve),
  },
  {
    path: "/EnterpriseInformConfirmTenantDetail",
    name: "EnterpriseInformConfirmTenantDetail",
    meta:{
      appName:"企业信息变更审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/EnterpriseInformConfirmTenantDetail" ], resolve),
  },
];

export default route;
