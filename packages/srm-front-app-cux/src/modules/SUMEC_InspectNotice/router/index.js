
let route = [
  {
    path:"/InspectNoticeList",
    name:"InspectNoticeList",
    meta:{
      appName:"验收通知单"
    },
    component:(resolve) => require([ "../views/InspectNoticeList" ], resolve),
  },
  {
    path:"/InspectNoticeDetail",
    name:"InspectNoticeDetail",
    meta:{
      appName:"验收通知单"
    },
    component:(resolve) => require([ "../views/InspectNoticeDetail" ], resolve),
  },
];

export default route;
