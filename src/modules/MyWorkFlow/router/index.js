// import MyWorkFlowList from '../views/MyWorkFlowList'
// import MyWorkDetail from '../views/MyWorkDetail'

let route = [
  {
    path: "/MyWorkFlowList",
    name: "MyWorkFlowList",
    meta:{
      appName:"我的工作流",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyWorkFlowList" ], resolve),
  },
  {
    path: "/MyWorkDetail",
    name: "MyWorkDetail",
    meta:{
      appName:"我的工作流",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyWorkDetail" ], resolve),
  },
];

export default route;
