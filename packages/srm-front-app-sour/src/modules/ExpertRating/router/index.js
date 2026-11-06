// import ExpertRating from '../views/ExpertRating'
// import ReRatingDetail from '../views/ReRatingDetail'
// import ExpertRatingList from '../views/ExpertRatingList'
// import ExpertRatingDetail from '../views/ExpertRatingDetail'
// import ExpertManageDetail from '../views/ExpertManageDetail'
// import InquiryBillsDetail from '../views/InquiryBillsDetail'
// import BiddingBillsDetail from '../../../common/BidDetail/BiddingBillsDetail'
let route = [
  {
    path: "/ExpertRatingList",
    name: "ExpertRatingList",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ExpertRatingList" ], resolve),
  },
  {
    path: "/ExpertRatingDetail",
    name: "ExpertRatingDetail",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ExpertRatingDetail" ], resolve),
  },
  {
    path: "/ExpertManageDetail",
    name: "ExpertManageDetail",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ExpertManageDetail" ], resolve),
  },
  {
    path: "/ExpertManageDetails",
    name: "ExpertManageDetails",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ExpertManageDetails" ], resolve),
  },
  {
    path: "/InquiryBillsDetail",
    name: "InquiryBillsDetail",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InquiryBillsDetail" ], resolve),
  },
  {
    path: "/BiddingBillsDetail",
    name: "BiddingBillsDetail",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BiddingBillsDetail" ], resolve),
  },
  {
    path: "/ExpertRating",
    name: "ExpertRating",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ExpertRating" ], resolve),
  },
  {
    path: "/ReRatingDetail",
    name: "ReRatingDetail",
    meta:{
      appName:"专家评分",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ReRatingDetail" ], resolve),
  },
];

export default route;
