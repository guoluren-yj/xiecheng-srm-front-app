let route = [
  {
    path: "/Hygy_SuppliersAdmissionApprovalList",
    name: "Hygy_SuppliersAdmissionApprovalList",
    meta: {
      appName:"供应商准入申请单审批"
    },
    component: (resolve) => require([ "../views/Hygy_SuppliersAdmissionApprovalList" ], resolve),
  }, {
    path: "/Hygy_SuppliersAdmissionApprovalDetail",
    name: "Hygy_SuppliersAdmissionApprovalDetail",
    meta: {
      appName:"供应商准入申请单审批"
    },
    component: (resolve) => require([ "../views/Hygy_SuppliersAdmissionApprovalDetail" ], resolve),
  },
  {
    path: "/Hygy_SuppliersTemporaryApprovalList",
    name: "Hygy_SuppliersTemporaryApprovalList",
    meta: {
      appName:"供应商临时审批"
    },
    component: (resolve) => require([ "../views/Hygy_SuppliersAdmissionApprovalList" ], resolve),
  }
];

export default route;
