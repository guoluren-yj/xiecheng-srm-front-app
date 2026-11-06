let route = [ {
  path: "/ReceiptExecutionList",
  name: "ReceiptExecutionList",
  meta:{
    appName:"收货执行",
    isPurchase:true
  },
  component: (resolve) => require([ "../views/ReceiptExecutionList" ], resolve)
},
{
  path: "/ReceiptExecLineDetail",
  name: "ReceiptExecLineDetail",
  meta:{
    appName:"收货执行",
    isPurchase:true
  },
  component: (resolve) => require([ "../views/ReceiptExecLineDetail" ], resolve)
},
{
  path: "/ReceiptExecWaitDetail",
  name: "ReceiptExecWaitDetail",
  meta:{
    appName:"收货执行",
    isPurchase:true
  },
  component: (resolve) => require([ "../views/ReceiptExecWaitDetail" ], resolve)
},
{
  path: "/ReceiptExecDoingDetail",
  name: "ReceiptExecDoingDetail",
  meta:{
    appName:"收货执行",
    isPurchase:true
  },
  component: (resolve) => require([ "../views/ReceiptExecDoingDetail" ], resolve)
},
{
  path: "/DoingLineDetail",
  name: "DoingLineDetail",
  meta:{
    appName:"收货执行",
    isPurchase:true
  },
  component: (resolve) => require([ "../views/DoingLineDetail" ], resolve)
}, ];

export default route;