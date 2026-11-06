let route = [
  // 质检分配
  {
    path: "/ExpertReplyList",
    name: "ExpertReplyList",
    meta: {
      appName: "专家回复",
    },
    component: (resolve) => require([ "../views/ExpertReplyList.vue" ], resolve),
  },
  {
    path: "/ExpertReplyDetail",
    name: "ExpertReplyDetail",
    meta: {
      appName: "专家回复明细",
    },
    component: (resolve) => require([ "../views/ExpertReplyDetail.vue" ], resolve),
  },
];

export default route;