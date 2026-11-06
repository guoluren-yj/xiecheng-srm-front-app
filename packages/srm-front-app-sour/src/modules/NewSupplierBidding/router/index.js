
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/NewSupplierBidding",
    name: "NewSupplierBidding",
    meta:{
      appName:"投标工作台",
    },
    component: (resolve) => require([ "../views/NewSupplierBidding" ], resolve)
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "NewSupplierBidding") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"招标工作台",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});

export default route;