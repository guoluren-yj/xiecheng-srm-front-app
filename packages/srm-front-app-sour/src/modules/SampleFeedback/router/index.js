let route = [
  {
    path: "/SampleFeedbackList",
    name: "SampleFeedbackList",
    meta: {
      appName: "送样申请反馈"
    },
    component: (resolve) => require([ "../views/SampleFeedbackList" ], resolve),
  },
  {
    path: "/SampleFeedbackDetail",
    name: "SampleFeedbackDetail",
    meta: {
      appName: "送样申请反馈"
    },
    component: (resolve) => require([ "../views/SampleFeedbackDetail" ], resolve),
  }
];

export default route;
