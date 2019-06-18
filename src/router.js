import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    hidden: true,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
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
    path: '/test',
    name: '测试',
    icon: 'el-icon-view',
    hidden: false,
    roles: ['haha'],
    component: () => import('@/layout'),
    children: []
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
