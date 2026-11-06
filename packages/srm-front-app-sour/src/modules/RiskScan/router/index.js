/* eslint-disable array-bracket-spacing */
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/RiskScan",
    name: "RiskScan",
    meta: {
      appName: "风险扫描",
      isPurchase: true,
    },
    component: (resolve) => require(["../views/RiskScan"], resolve),
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "RiskScan") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta: {
        appName: "风险扫描",
        isPurchase: true,
      },
      component: (resolve) => require([`../views/${fileName}`], resolve),
    });
  }
});

export default route;
