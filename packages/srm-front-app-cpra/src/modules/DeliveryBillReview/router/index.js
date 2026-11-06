
const files = require.context("../views", true, /^\.\/\w*.vue$/);

let route = [
  {
    path: "/DeliveryBillReviewList",
    name: "DeliveryBillReviewList",
    meta:{
      appName:"送货单复审",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryBillReviewList" ], resolve),
  },
];

files.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".vue", "");
  if (fileName !== "DeliveryBillReviewList") {
    route.push({
      path: `/${fileName}`,
      meta:{
        appName:"送货单复审",
        isPurchase:true
      },
      name: fileName,
      component: (resolve) => require([ `../views/${fileName}` ], resolve),
    });
  }
});

export default route;

// let route = [
//     {
//         path: '/DeliveryBillReviewList',
//         name: 'DeliveryBillReviewList',
//         component: resolve => require(['../views/DeliveryBillReviewList'], resolve),
//     },
//     {
//         path: '/DeliveryBillReviewDetail',
//         name: 'DeliveryBillReviewDetail',
//         component: resolve => require(['../views/DeliveryBillReviewDetail'], resolve),
//     },
// ]
// export default route
