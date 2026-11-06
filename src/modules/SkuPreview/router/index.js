let route = [
  {
    path: "/skuPreview",
    name: "SkuPreview",
    meta:{
      appName: "商品预览-公共",
    },
    component: (resolve) => require([ "../views/SkuPreview.vue" ], resolve),
  },
];

export default route;
