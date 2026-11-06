let route = [
  {
    path: "/SiteInvestigationReportManage",
    name: "SiteInvestigationReportManage",
    meta:{
      appName: "现场考察报告",
    },
    component: (resolve) => require([ "../views/SiteInvestigationReportManage" ], resolve),
  },
  {
    path: "/SiteInvestigationReportDetailMaintain",
    name: "SiteInvestigationReportDetailMaintain",
    meta:{
      appName: "现场考察报告",
    },
    component: (resolve) => require([ "../views/SiteInvestigationReportDetailMaintain" ], resolve),
  },
  {
    path: "/SiteInvestiogationScoreInfoChildren",
    name: "SiteInvestiogationScoreInfoChildren",
    meta:{
      appName: "现场考察报告",
    },
    component: (resolve) => require([ "../views/SiteInvestiogationScoreInfoChildren" ], resolve),
  },
  {
    path: "/SiteInvestigationReportCreate",
    name: "SiteInvestigationReportCreate",
    meta:{
      appName: "现场考察报告",
    },
    component: (resolve) => require([ "../views/SiteInvestigationReportCreate" ], resolve),
  },
  {
    path: "/SiteInvestigationReportFilled",
    name: "SiteInvestigationReportFilled",
    meta:{
      appName: "现场考察报告",
    },
    component: (resolve) => require([ "../views/SiteInvestigationReportFilled" ], resolve),
  }
];

export default route;
