import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { title } from '@/settings'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "dashboard",
    meta: {
      title: '仪表盘'
    },
    children: [{
      path: "dashboard",
      component: () => import("@/views/dashboard/info"),
      name: "Dashboard",
      meta: {
        title: "主页",
        icon: "el-icon-menu",
        noCache: true,
        affix: true
      }
    }]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '主页', icon: 'dashboard' }
  //   }]
  // },  
  //   {
  //     path: '/goodsManagement',
  //     component: Layout,
  //     redirect: '/goodsManagement/goods',
  //     name: 'goodsManagement',
  //     meta: { title: '文章管理', icon: 'el-icon-s-help' },
  //     children: [
  //       {
  //         path: 'goods',
  //         name: 'goods',
  //         component: () => import('@/views/articleManagement/blog'),
  //         meta: { title: '博客管理', icon: 'table' }
  //       },
  //       {
  //         path: 'category',
  //         name: 'category',
  //         component: () => import('@/views/articleManagement/category'),
  //         meta: { title: '分类管理', icon: 'tree' }
  //       },
  //       {
  //         path: 'articlelabel',
  //         name: 'articlelabel',
  //         component: () => import('@/views/articleManagement/articleLabel'),
  //         meta: { title: '标签管理', icon: 'tree' }
  //       },
  //       {
  //         path: 'recommend',
  //         name: 'recommend',
  //         component: () => import('@/views/articleManagement/recommend'),
  //         meta: { title: '推荐管理', icon: 'tree' }
  //       },
  //     ]
  //   },
  //  {
  //   path: '/logManagement',
  //   component: Layout,
  //   redirect: '/logManagement/index',
  //   name: 'logManagement',
  //   meta: { title: '日志管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'loginlog',
  //       name: 'loginlog',
  //       component: () => import('@/views/logManagement/loginlog'),
  //       meta: { title: '登录日志', icon: 'table' }
  //     },
  //     {
  //       path: 'actionlog',
  //       name: 'actionlog',
  //       component: () => import('@/views/logManagement/actionlog'),
  //       meta: { title: '操作日志', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path:'/userManagement',
  //   component:Layout,
  //   redirect: '/userManagement/index',
  //   name:'userManagement',
  //   meta:{title:'用户管理', icon: 'el-icon-s-help'},
  //   children:[
  //     {
  //       path: 'adminuser',
  //       name: 'adminuser',
  //       component: () => import('@/views/userManagement/adminUser'),
  //       meta: { title: '管理员管理', icon: 'table' }
  //     },
  //     {
  //       path: 'rourist',
  //       name: 'rourist',
  //       component: () => import('@/views/userManagement/touRist'),
  //       meta: { title: '游客管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/menuManagement',
  //   component: Layout,
  //   redirect: '/menuManagement/index',
  //   name: 'menuManagement',
  //   meta: { title: '权限管理', icon: 'el-icon-s-help' },
  //   children:[
  //     {
  //       path: 'menus',
  //       name: 'menus',
  //       component: () => import('@/views/menuManagement/index'),
  //       meta: { title: '菜单管理', icon: 'table' }
  //     },
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/menuManagement/user'),
  //       meta: { title: '角色管理', icon: 'table' }
  //     },
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', hidden: true }
]

function treeRoutes(list) {
  var treeData = [];
  var map = {};
  list.forEach(function (item) {
    map[item.id] = item;
  })
  list.forEach(function (item) {
    var parent = map[item.parentId];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      treeData.push(item);
    }
  })
  return treeData;
}

console.log(constantRoutes, 'constantRoutes');

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
