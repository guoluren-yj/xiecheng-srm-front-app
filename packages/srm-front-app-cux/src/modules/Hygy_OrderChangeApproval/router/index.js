

const files = require.context("../views",true,/^\.\/\w*.vue$/);

let route = [
  {
    path: "/Hygy_OrderChangeApprovalList",
    name: "Hygy_OrderChangeApprovalList",
    meta:{
      appName:"订单变更审批"
    },
    component: (resolve) => require([ "../views/Hygy_OrderChangeApprovalList" ], resolve),
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");

  if (fileName !== "Hygy_OrderChangeApprovalList") {
    route.push({
      path: `/${fileName}`,
      meta:{
        appName:"订单变更审批"
      },
      name: fileName,
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});


export default route;

