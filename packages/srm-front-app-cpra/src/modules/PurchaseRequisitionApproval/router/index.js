let route = [
  {
    path: "/PurchaseRequisitionApprovalList",
    name: "PurchaseRequisitionApprovalList",
    meta: {
      appName: "采购申请审批",
    },
    component: (resolve) => require([ "../views/PurchaseRequisitionApprovalList" ], resolve),
  },
  {
    path: "/PurchaseRequisitionApprovalDetail",
    name: "PurchaseRequisitionApprovalDetail",
    meta: {
      appName: "采购申请审批",
    },
    component: (resolve) => require([ "../views/PurchaseRequisitionApprovalDetail" ], resolve),
  }
];

export default route;
