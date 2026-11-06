let route = [
  {
    path: "/StatementReviewList",
    name: "StatementReviewList",
    meta: {
      appName: "采购方对账单工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/StatementReviewList" ], resolve),
  },
  {
    path: "/StatementReviewDetail",
    name: "StatementReviewDetail",
    meta: {
      appName: "采购方对账单工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/StatementReviewDetail" ], resolve),
  },
  {
    path: "/StatementReviewBySupplierList",
    name: "StatementReviewBySupplierList",
    meta: {
      appName: "销售方对账单工作台",
    },
    component: (resolve) => require([ "../views/StatementReviewBySupplierList" ], resolve),
  },
  {
    path: "/StatementReviewBySupplierDetail",
    name: "StatementReviewBySupplierDetail",
    meta: {
      appName: "销售方对账单工作台",
    },
    component: (resolve) => require([ "../views/StatementReviewBySupplierDetail" ], resolve),
  },
];

export default route;
