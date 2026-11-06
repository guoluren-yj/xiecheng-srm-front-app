// import MyTodoList from '../views/MyTodoList'
// import MyTodoDetail from '../views/MyTodoDetail'

let route = [
  {
    path: "/MyTodoList",
    name: "MyTodoList",
    meta:{
      appName:"待办事项",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyTodoList" ], resolve),
  },
  {
    path: "/MyTodoDetail",
    name: "MyTodoDetail",
    meta:{
      appName:"待办事项",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyTodoDetail" ], resolve),
  },
  {
    path: "/MyTodoApproved",
    name: "MyTodoApproved",
    meta:{
      appName:"待办事项",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyTodoApproved" ], resolve),
  },
];

export default route;
