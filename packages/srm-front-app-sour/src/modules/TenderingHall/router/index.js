// import TenderingHallList from '../views/TenderingHallList'
// import BiddingBillsDetail from '../../../common/BidDetail/BiddingBillsDetail'

let route = [
  {
    path: "/TenderingHallList",
    name: "TenderingHallList",
    meta:{
      appName:"招标大厅",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/TenderingHallList" ], resolve),
  },
  {
    path: "/BiddingBillsDetailA",
    name: "BiddingBillsDetailA",
    meta:{
      appName:"招标大厅",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/BiddingBillsDetail" ], resolve),
  },
];

export default route;
