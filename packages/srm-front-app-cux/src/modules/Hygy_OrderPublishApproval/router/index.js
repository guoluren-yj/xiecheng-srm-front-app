

const files = require.context("../views",true,/^\.\/\w*.vue$/);
let route = [
  {
    path: "/Hygy_OrderPublishApprovalList",
    name: "Hygy_OrderPublishApprovalList",
    meta:{
      appName:"订单发布审批"
    },
    component: (resolve) => require([ "../views/Hygy_OrderPublishApprovalList" ], resolve),
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");

  if (fileName !== "Hygy_OrderPublishApprovalList") {
    route.push({
      path: `/${fileName}`,
      meta:{
        appName:"订单发布审批"
      },
      name: fileName,
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});


export default route;

