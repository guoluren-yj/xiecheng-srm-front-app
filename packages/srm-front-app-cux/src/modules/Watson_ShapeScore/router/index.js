let route = [
  {
    path: "/Watson_ShapeScore",
    name: "Watson_ShapeScore",
    meta:{
      appName:"样Q评分-屈臣氏"
    },
    component: (resolve) => require([ "../views/Watson_ShapeScore.vue" ], resolve),
  },
];

export default route;
