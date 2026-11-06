let route = [
  {
    path: "/ScheduleSheetCreate",
    name: "ScheduleSheetCreate",
    meta: {
      appName: "计划排程创建",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ScheduleSheetCreate" ], resolve),
  },
  {
    path: "/ScheduleSheetConfirm",
    name: "ScheduleSheetConfirm",
    meta: {
      appName: "计划排程确认",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ScheduleSheetConfirm" ], resolve),
  },
  {
    path: "/ScheduleSheetConfirmBySupplier",
    name: "ScheduleSheetConfirmBySupplier",
    meta: {
      appName: "计划排程确认-供应商"
    },
    component: (resolve) => require([ "../views/ScheduleSheetConfirmBySupplier" ], resolve),
  },
  {
    path: "/ScheduleSheetCreateBySupplier",
    name: "ScheduleSheetCreateBySupplier",
    meta: {
      appName: "计划排程创建-供应商"
    },
    component: (resolve) => require([ "../views/ScheduleSheetCreateBySupplier" ], resolve),
  },
  {
    path: "/SchSheOrderApprovalDetail",
    name: "SchSheOrderApprovalDetail",
    meta: {
      appName: "订单审批详情"
    },
    component: (resolve) => require([ "../../OrderApproval/views/OrderApprovalDetail" ], resolve),
  },
];

export default route;
