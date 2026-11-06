let route = [
  {
    path: "/CompView",
    name: "CompView",
    meta: {
      appName: "通用组件展示", // 适用：外部系统直接跳转本系统打开工作流表单组件，但本身不使用我们工作流引擎场景，但不局限于此场景
      isPurchase:true
    },
    component: (resolve) => require([ "../views/CompView" ], resolve),
  },
];

export default route;
