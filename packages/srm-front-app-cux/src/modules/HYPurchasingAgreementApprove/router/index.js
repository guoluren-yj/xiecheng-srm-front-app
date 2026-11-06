const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [ {
  path: "/PurchasingAgreementApproveList",
  name: "PurchasingAgreementApproveList",
  meta: {
    appName: "华友协议审批"
  },
  component: (resolve) => require([ "../views/PurchasingAgreementApproveList" ], resolve),
}, {
  path: "/AgreementTerminationApproveList",
  name: "AgreementTerminationApproveList",
  meta: {
    appName: "华友协议审批"
  },
  component: (resolve) => require([ "../views/AgreementTerminationApproveList" ], resolve),
} ];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "PurchasingAgreementApproveList" && fileName !== "AgreementTerminationApproveList") {
    route.push({
      path: `/${fileName}`,
      meta: {
        appName: "华友协议审批"
      },
      name: fileName,
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});


export default route;