let route = [
  {
    path: "/QRCodeList",
    name: "QRCodeList",
    meta:{
      appName:"二维码查看"
    },
    component: (resolve) => require([ "../views/QRCodeList" ], resolve)
  },
  {
    path: "/ViewQRCode",
    name: "ViewQRCode",
    meta:{
      appName:"二维码查看"
    },
    component: (resolve) => require([ "../views/ViewQRCode" ], resolve)
  }
];

export default route;