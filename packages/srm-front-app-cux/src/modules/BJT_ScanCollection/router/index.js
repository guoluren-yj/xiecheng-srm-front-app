// import ScanDetail from '../views/ScanDetail'

let route = [
  {
    path: "/ScanDetail",
    name: "ScanDetail",
    meta:{
      appName:"扫码收货"
    },
    component: (resolve) => require([ "../views/ScanDetail" ], resolve),
  },
];

export default route;
