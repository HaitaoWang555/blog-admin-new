import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRouterMap
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  { path: '/login', component: () => import(/* webpackChunkName: "login" */'@/views/login/index'), hidden: true },
  { path: '/404', component: () => import(/* webpackChunkName: "404" */'@/views/404'), hidden: true },
  { path: '/icon', component: () => import(/* webpackChunkName: "svg" */'@/views/svg-icons/index'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */'@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/cms',
    component: Layout,
    redirect: '/cms/list',
    name: 'content',
    meta: { title: '内容', icon: 'cms-article' },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "article-list" */'@/views/cms/article/list'),
        name: 'list',
        meta: { itle: '文章列表', icon: 'cms-list' }
      },
      {
        path: 'create',
        component: () => import(/* webpackChunkName: "article-create" */'@/views/cms/article/create'),
        name: 'create',
        meta: { title: '创建文章', icon: 'cms-create' }
      },
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import(/* webpackChunkName: "/article-edit" */'@/views/cms/article/edit'),
        meta: { title: '编辑文章', noCache: true },
        hidden: true
      },
      {
        path: 'metas',
        component: () => import(/* webpackChunkName: "metas" */'@/views/cms/metas/index'),
        name: 'metas',
        meta: { itle: '标签与分类', icon: 'cms-list' }
      },
      {
        path: 'poetry',
        component: () => import(/* webpackChunkName: "poetry" */'@/views/cms/poetry/index'),
        name: 'poetry',
        meta: { itle: '诗词列表', icon: 'cms-list' }
      },
      {
        path: 'note',
        component: () => import(/* webpackChunkName: "note" */'@/views/cms/note/index'),
        name: 'note',
        meta: { itle: '笔记列表', icon: 'cms-list' }
      },
      {
        path: 'comment',
        component: () => import(/* webpackChunkName: "comment" */'@/views/cms/comment/index'),
        name: 'comment',
        meta: { itle: '评论列表', icon: 'cms-list' }
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '权限', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin-index" */'@/views/ums/admin/index'),
        meta: { title: '用户列表', icon: 'ums-admin' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role-index" */'@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import(/* webpackChunkName: "role-allocMenu" */'@/views/ums/role/allocMenu'),
        meta: { title: '分配菜单' },
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import(/* webpackChunkName: "role-allocResource" */'@/views/ums/role/allocResource'),
        meta: { title: '分配资源' },
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu-index" */'@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' }
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import(/* webpackChunkName: "menu-add" */'@/views/ums/menu/add'),
        meta: { title: '添加菜单' },
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import(/* webpackChunkName: "menu-update" */'@/views/ums/menu/update'),
        meta: { title: '修改菜单' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: "resource-index" */'@/views/ums/resource/index'),
        meta: { title: '资源列表', icon: 'ums-resource' }
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import(/* webpackChunkName: "resource-categoryList" */'@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
