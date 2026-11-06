let route = [
  {
    path: "/AiAssistant",
    name: "AiAssistant",
    meta: {
      appName: "AI 助理",
    },
    component: (resolve) => require(["../views/AiAssistant"], resolve),
  },
];

export default route;
