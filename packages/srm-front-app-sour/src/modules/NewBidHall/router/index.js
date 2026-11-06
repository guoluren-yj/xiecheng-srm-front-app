
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/NewBidHallList",
    name: "NewBidHallList",
    meta:{
      appName:"招标工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/NewBidHallList" ], resolve)
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "NewBidHallList") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"招标工作台",
        isPurchase:true
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});

export default route;