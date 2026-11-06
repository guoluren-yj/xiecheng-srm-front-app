// import DeliveryList from '../views/DeliveryList'
// import DeliveryDetail from '../views/DeliveryDetail'
// import CreateDeliveryDetail from '../views/CreateDeliveryDetail'

let route = [
	{
		path: '/jjy_DeliveryList',
		name: 'jjy_DeliveryList',
		meta:{
			appName:"久久丫送货单创建"
		},
		component: resolve => require(['../views/jjy_DeliveryList'], resolve),
	},
	{
		path: '/jjy_DeliveryDetail',
		name: 'jjy_DeliveryDetail',
		meta:{
			appName:"久久丫送货单创建"
		},
		component: resolve => require(['../views/jjy_DeliveryDetail'], resolve),
	},
	{
		path: '/jjy_CreateDeliveryDetail',
		name: 'jjy_CreateDeliveryDetail',
		meta:{
			appName:"久久丫送货单创建"
		},
		component: resolve => require(['../views/jjy_CreateDeliveryDetail'], resolve),
	},
]

export default route
