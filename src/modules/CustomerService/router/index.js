let route = [
	{
		path: '/CustomerService',
		name: 'CustomerService',
		meta:{
			appName:"智能客服"
		},
		component: resolve => require(['../views/CustomerService'], resolve),
	},
]

export default route
