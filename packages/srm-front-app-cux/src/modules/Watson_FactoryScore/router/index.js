let route = [
  {
    path: "/Watson_FactoryScore",
    name: "Watson_FactoryScore",
    meta:{
      appName:"厂Q评分-屈臣氏"
    },
    component: (resolve) => require([ "../views/Watson_FactoryScore.vue" ], resolve),
  },
];

export default route;
