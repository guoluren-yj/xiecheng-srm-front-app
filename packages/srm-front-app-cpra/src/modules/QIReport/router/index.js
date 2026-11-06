let route = [
  {
    path: "/QIReportCreationList",
    name: "QIReportCreationList",
    meta: {
      appName: "质量整改创建", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportCreationList" ], resolve),
  },
  {
    path: "/QIReportCreationCreate",
    name: "QIReportCreationCreate",
    meta: {
      appName: "质量整改创建", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportCreationCreate" ], resolve),
  },
  {
    path: "/QIReportCreationDetail",
    name: "QIReportCreationDetail",
    meta: {
      appName: "质量整改创建", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportCreationDetail" ], resolve),
  },
  {
    path: "/QIReportInitiatedList",
    name: "QIReportInitiatedList",
    meta: {
      appName: "我发起的质量整改", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportInitiatedList" ], resolve),
  },
  {
    path: "/QIReportInitiatedDetail",
    name: "QIReportInitiatedDetail",
    meta: {
      appName: "我发起的质量整改", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportInitiatedDetail" ], resolve),
  },
  {
    path: "/QIReportAuditList",
    name: "QIReportAuditList",
    meta: {
      appName: "质量整改反馈审核", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportAuditList" ], resolve),
  },
  {
    path: "/QIReportAuditDetail",
    name: "QIReportAuditDetail",
    meta: {
      appName: "质量整改反馈审核", // 标记子应用名称，同一个功能下描述相同，用于监控平台识别报错功能
      isPurchase: true, // 是否采购方功能，用于菜单越权控制
    },
    component: (resolve) => require([ "../views/QIReportAuditDetail" ], resolve),
  },
];
export default route;