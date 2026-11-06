
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/ListBidding",
    name: "ListBidding",
    meta:{
      appName:"投标工作台",
    },
    component: (resolve) => require([ "../views/ListBidding" ], resolve)
  },
  {
    path: "/ListApply",
    name: "ListApply",
    meta:{
      appName:"供应商回复",
    },
    component: (resolve) => require([ "../views/ListApply" ], resolve)
  },
  {
    path: "/BiddingHallSupplier",
    name: "BiddingHallSupplier",
    meta:{
      appName:"供应商回复",
    },
    component: (resolve) => require([ "../views/Bidding" ], resolve)
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName === "DetailBidding") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"招标工作台",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
  if (fileName === "QuotationBidding") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"招标工作台",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
  if (fileName === "QueryBidding") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"招标工作台",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }

  if (fileName === "DetailApply") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"供应商回复",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
  if (fileName === "QuotationApply") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"供应商回复",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
  if (fileName === "QueryQuotation") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"供应商回复",
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
  // if (fileName === "BiddingHallSupplier") {
  //   route.push({
  //     path: `/${fileName}`,
  //     name: fileName,
  //     meta:{
  //       appName:"供应商回复",
  //     },
  //     component: (resolve) => require([ `../views/${fileName}` ], resolve),
  //   });
  // }
});

export default route;