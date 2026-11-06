let route = [
  { path: "/ReverseList",
    name: "ReverseList",
    meta:{
      appName:"冲销",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ReverseList" ], resolve)
  },
  { path: "/ReverseDetail",
    name: "ReverseDetail",
    meta:{
      appName:"冲销",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ReverseDetail" ], resolve)
  }
];

export default route;