//定义子应用路由页面
let route = [
  {
    path: "/OrderWorkbenchList",
    name: "OrderWorkbenchList",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/OrderWorkbenchDetail/UnderApproval",
    name: "underApprovalDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) => require([ "../views/Detail/UnderApproval" ], resolve),
  },
  {
    path: "/OrderWorkbenchDetail/ToBeReleased",
    name: "toBeReleasedDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) => require([ "../views/Detail/ToBeReleased" ], resolve),
  },
  {
    path: "/OrderWorkbenchDetail/FeedbackUnderReview",
    name: "feedbackUnderReviewDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) =>
      require([ "../views/Detail/FeedbackUnderReview" ], resolve),
  },
  {
    path: "/OrderWorkbenchDetail/All",
    name: "allDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    component: (resolve) => require([ "../views/Detail/All" ], resolve),
  },
  {
    path: "/OrderWorkbenchDetail/WulingSign",
    name: "wulingSignDetail",
    meta: {
      appName: "采购方订单工作台",
    },
    // component: (resolve) => require([ "../../CUX_PART/Page/OrderWorkbench/Detail" ], resolve)
    component: (resolve) =>
      require([ "../views/Detail/ScuxSingWuLingDetail" ], resolve),
  },
];

export default route;
