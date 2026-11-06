let route = [
  {
    path: "/Hygy_SuppliersObsoleteApprovalList",
    name: "Hygy_SuppliersObsoleteApprovalList",
    meta: {
      appName:"供应商淘汰申请单"
    },
    component: (resolve) => require([ "../views/Hygy_SuppliersObsoleteApprovalList" ], resolve),
  }, {
    path: "/Hygy_SuppliersObsoleteApprovalDetail",
    name: "Hygy_SuppliersObsoleteApprovalDetail",
    meta: {
      appName:"供应商淘汰申请单"
    },
    component: (resolve) => require([ "../views/Hygy_SuppliersObsoleteApprovalDetail" ], resolve),
  },
];

export default route;