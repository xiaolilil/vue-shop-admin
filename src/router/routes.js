
const routes = [
    // {
    //     path: '/',
    //     redirect: '/login',
    // },
{
    path: '/setup',
    name: 'setup',
    title: '测试',
    component: () =>
        import('../test/setup.vue'), //.vue不能省略
},

{
    path: '/login',
    name: 'Login',
    title: '登录',
    meta:{
        intercept: true
    },
    component: () => import('@/views/login.vue'), //.vue不能省略
},
{
    path: '/home',
    name: 'Home',
    meta: {title: '首页'},
    redirect: '/welcome',
    component: () =>
        import('@/views/Home/home.vue'), //.vue不能省略
    children: [
        {
            path: '/welcome',
            name:'Welcome',
            meta:{title:"欢迎"},
            component: () => import('@/views/Test/welcome.vue'),
        },
        {
            path: '/map',
            name:'Map',
            meta:{title:"地图"},
            component: () => import('@/views/Test/map.vue'),
        },
        {
            path: '/users',
            name:'User',
            meta:{title:"用户列表"},
            component: () => import('@/views/User/user.vue'),
        },
        {
            path: '/rights',
            name:'Rights',
            meta:{title:"权限列表"},
            component: () => import('@/views/Power/rights.vue'),
        },
        {
            path: '/roles',
            name:'Roles',
            meta:{title:"角色列表"},
            component: () => import('@/views/Power/roles.vue'),
        },
        {
            path: '/goods',
            name:'Goods',
            meta:{title:"商品列表"},
            component: () => import('@/views/Goods/goodsList.vue'),
        },
        {
            path: '/categories',
            name:'Categories',
            meta:{title:"商品列表"},
            component: () => import('@/views/Goods/category.vue'),
        },
        {
            path: '/params',
            name:'Params',
            meta:{title:"分类参数"},
            component: () => import('@/views/Goods/params.vue'),
        },
        {
            path: '/addgoods',
            name:'AddGoods',
            meta:{title:"添加商品"},
            component: () => import('@/views/Goods/addGoods.vue'),
        },
        {
            path: '/orders',
            name:'Order',
            meta:{title:"订单列表"},
            component: () => import('@/views/Order/order.vue'),
        },
        {
            path: '/reports',
            name:'Reports',
            meta:{title:"数据报表"},
            component: () => import('@/views/Reports/reports.vue'),
        },
    ]
},
]




export default routes