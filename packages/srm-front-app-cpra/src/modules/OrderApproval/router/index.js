// import OrderApprovalList from '../views/OrderApprovalList'
// import OrderApprovalDetail from '../views/OrderApprovalDetail'

let route = [
  {
    path: "/OrderApprovalList",
    name: "OrderApprovalList",
    meta:{
      appName:"订单审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/OrderApprovalList" ], resolve),
  },
  {
    path: "/OrderApprovalDetail",
    name: "OrderApprovalDetail",
    meta:{
      appName:"订单审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/OrderApprovalDetail" ], resolve),
  },
];

export default route;
