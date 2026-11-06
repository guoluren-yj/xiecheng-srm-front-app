let route = [
  {
    path: "/SiteInvestigateReportList",
    name: "SiteInvestigateReportList",
    meta:{
      appName:"现场考察",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SiteInvestigateReportList" ], resolve),
  },
  {
    path: "/SiteInvestigateReportDetail",
    name: "SiteInvestigateReportDetail",
    meta:{
      appName:"现场考察",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SiteInvestigateReportDetail" ], resolve),
  },
  {
    path: "/SiteInvestigateReportDetailB",
    name: "SiteInvestigateReportDetailB",
    meta:{
      appName:"现场考察",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SiteInvestigateReportDetailB" ], resolve),
  },
];

export default route;
