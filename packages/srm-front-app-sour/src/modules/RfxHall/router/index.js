
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/RfxHallList",
    name: "RfxHallList",
    meta:{
      appName:"寻源大厅",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/RfxHallList" ], resolve)
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "RfxHallList") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta:{
        appName:"寻源大厅",
        isPurchase:true
      },
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});

export default route;