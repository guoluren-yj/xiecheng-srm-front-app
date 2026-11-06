let route = [
  {
    path: "/SubAccountSiteList",
    name: "SubAccountSiteList",
    meta: {
      appName: "子账户管理"
    },
    component: (resolve) => require([ "../views/SubAccountList" ], resolve),
  },
  {
    path: "/SubAccountSiteDetail",
    name: "SubAccountSiteDetail",
    meta: {
      appName: "子账户管理"
    },
    component: (resolve) => require([ "../views/SubAccountDetail" ], resolve),
  }
];

export default route;
