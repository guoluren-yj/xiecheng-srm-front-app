// import MyDeliveryList from '../views/MyDeliveryList'
// import MyDeliveryDetail from '../views/MyDeliveryDetail'


let route = [
    {
		path: '/jjy_MyDeliveryList',
		name: 'jjy_MyDeliveryList',
		meta:{
			appName:"久久丫我的送货单"
		},
		component: resolve => require(['../views/jjy_MyDeliveryList'], resolve),
    },
    {
		path: '/jjy_MyDeliveryDetail',
		name: 'jjy_MyDeliveryDetail',
		meta:{
			appName:"久久丫我的送货单"
		},
		component: resolve => require(['../views/jjy_MyDeliveryDetail'], resolve),
    },
]

export default route
