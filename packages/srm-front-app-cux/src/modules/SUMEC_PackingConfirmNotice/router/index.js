let route = [
  {
    path:"/PackingConfirmNoticeList",
    name:"PackingConfirmNoticeList",
    meta:{
      appName:"装箱/柜通知确认"
    },
    component:(resolve) => require([ "../views/PackingConfirmNoticeList" ], resolve),
  },
  {
    path:"/PackingConfirmNoticeDetail",
    name:"PackingConfirmNoticeDetail",
    meta:{
      appName:"装箱/柜通知确认"
    },
    component:(resolve) => require([ "../views/PackingConfirmNoticeDetail" ], resolve),
  },
];

export default route;
