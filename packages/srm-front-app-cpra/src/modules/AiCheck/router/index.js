/* eslint-disable array-bracket-spacing */
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/AiCheck",
    name: "AiCheck",
    meta: {
      appName: "智能审核",
      isPurchase: true,
    },
    component: (resolve) => require(["../views/AiCheck"], resolve),
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "AiCheck") {
    route.push({
      path: `/${fileName}`,
      name: fileName,
      meta: {
        appName: "智能审核",
        isPurchase: true,
      },
      component: (resolve) => require([`../views/${fileName}`], resolve),
    });
  }
});

export default route;
