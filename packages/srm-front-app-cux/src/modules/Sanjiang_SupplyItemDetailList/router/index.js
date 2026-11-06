let route = [
	{
		path: '/SJSupplyItemDetailList',
		name: 'SJSupplyItemDetailList',
		meta:{
			appName:"供货明细查询"
		},
		component: (resolve) => require([ '../views/SJSupplyItemDetailList' ], resolve),
	},
]

export default route
