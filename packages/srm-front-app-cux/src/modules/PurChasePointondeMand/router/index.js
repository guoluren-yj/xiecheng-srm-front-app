let route = [
  {
    path: "/PurChaseMandPlaceList",
    name: "PurChaseMandPlaceList",
    authorized: true,
    meta: {
      appName: "广宣点位",
    },
    component: (resolve) => require([ "../views/PurChaseMandPlaceList" ], resolve),
  },
  {
    path: "/PurChasePointondeMandList",
    name: "PurChasePointondeMandList",
    authorized: true,
    meta: {
      appName: "点位管理(采)",
    },
    component: (resolve) => require([ "../views/PurChasePointondeMandList" ], resolve),
  },
  {
    path: "/proviceList",
    name: "proviceList",
    authorized: true,
    meta: {
      appName: "下辖省份",
    },
    component: (resolve) => require([ "../views/province" ], resolve),
  },
  {
    path: "/cityList",
    name: "cityList",
    authorized: true,
    meta: {
      appName: "下辖城市",
    },
    component: (resolve) => require([ "../views/city" ], resolve),
  },
  {
    path: "/PurChasePointondeMandDetails",
    name: "PurChasePointondeMandDetails",
    authorized: true,
    meta: {
      appName: "点位管理明细(采)",
    },
    component: (resolve) => require([ "../views/PurChasePointondeMandDetails" ], resolve),
  },
];

export default route;