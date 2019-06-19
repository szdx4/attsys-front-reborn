import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    hidden: true,
    roles: ['user', 'manager', 'master'],
    redirect: '/home'
  },
  {
    path: '/login',
    hidden: true,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/1',
    name: '控制台',
    icon: 'el-icon-s-platform',
    hidden: false,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/home',
        name: '主页',
        icon: 'el-icon-s-home',
        hidden: false,
        roles: ['user', 'manager', 'master'],
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/2',
    name: '部门',
    icon: 'el-icon-s-cooperation',
    hidden: false,
    roles: ['master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/department',
        name: '部门管理',
        icon: 'el-icon-s-order',
        hidden: false,
        roles: ['master'],
        component: () => import('@/views/Department')
      }
    ]
  },
  {
    path: '/3',
    name: '用户',
    icon: 'el-icon-user-solid',
    hidden: false,
    roles: ['master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/user',
        name: '用户管理',
        icon: 'el-icon-s-order',
        hidden: false,
        roles: ['master'],
        component: () => import('@/views/User')
      }
    ]
  }
]

function hasPermission (role, route) {
  if (route.roles) {
    return route.roles.includes(role)
  } else {
    return true
  }
}

export function filterRoutes (role, routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (!tmp.hidden && hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoutes(role, tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}

export function router () {
  return routes
}

const globalRouter = new Router({
  routes: routes
})

export default globalRouter
