let route = [
    {
        path: '/sj_MyPaymentList',
        name: 'sj_MyPaymentList',
        meta:{
            appName:"货款确认"
        },
        component: resolve => require(['../views/sj_MyPaymentList'], resolve),
    }
]

export default route