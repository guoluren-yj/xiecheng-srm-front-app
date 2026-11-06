// import InvitationSummaryList from '../views/InvitationSummaryList'
// import InvitationSummaryDetail from '../views/InvitationSummaryDetail'
let route = [
  {
    path: "/InvitationSummaryList",
    name: "InvitationSummaryList",
    meta:{
      appName:"企业邀约汇总",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvitationSummaryList" ], resolve),
  },
  {
    path: "/InvitationSummaryDetail",
    name: "InvitationSummaryDetail",
    meta:{
      appName:"企业邀约汇总",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvitationSummaryDetail" ], resolve),
  }
];

export default route;
