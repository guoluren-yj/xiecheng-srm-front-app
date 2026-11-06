let route = [
  {
    path: "/Watson_StoreScore",
    name: "Watson_StoreScore",
    meta:{
      appName:"店Q评分-屈臣氏"
    },
    component: (resolve) => require([ "../views/Watson_StoreScore.vue" ], resolve),
  },
];

export default route;
