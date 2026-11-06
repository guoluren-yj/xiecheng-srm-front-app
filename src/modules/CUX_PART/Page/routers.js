let route = [
  {
    path: "/ZhenyunApprovalList",
    name: "ZhenyunApprovalList",
    meta: {
      appName: "甄云租户-待办事项",
      tenantNum: "SRM-ZHENYUN",
      // coverPath: "/ApprovalList",
    },
    component: (resolve) => require([ "./ZhenyunApprovalList.vue" ], resolve),
  },
  {
    path: "/ZhenyunApprovalDetail",
    name: "ZhenyunApprovalDetail",
    meta: {
      appName: "甄云租户-待办事项",
      tenantNum: "SRM-ZHENYUN",
      // coverPath: "/ApprovalDetail",
    },
    component: (resolve) => require([ "./ZhenyunApprovalDetail.vue" ], resolve),
  }
];

export default route;
