let route = [
  {
    path: "/SinicService_Approval",
    name: "SinicService_Approval",
    meta: {
      appName: "新力物业-审批"
    },
    component: (resolve) => require([ "../views/SinicService_Approval" ], resolve),
  },
];

export default route;
