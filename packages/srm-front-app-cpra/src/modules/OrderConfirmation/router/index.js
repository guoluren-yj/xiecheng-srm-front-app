// import OrderConfirmationList from '../views/OrderConfirmationList'
// import OrderConfirmationDetail from '../views/OrderConfirmationDetail'

let route = [
    {
        path: "/OrderConfirmationList",
        name: "OrderConfirmationList",
        meta:{
            appName:"订单确认"
        },
        component: (resolve) => require([ "../views/OrderConfirmationList" ], resolve),
    },
    {
        path: "/OrderConfirmationDetail",
        name: "OrderConfirmationDetail",
        meta:{
            appName:"订单确认"
        },
        component: (resolve) => require([ "../views/OrderConfirmationDetail" ], resolve),
    },
];

export default route;
