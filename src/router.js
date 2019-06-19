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
  },
  {
    path: '/4',
    name: '签到',
    icon: 'el-icon-check',
    hidden: false,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/sign',
        name: '人脸签到',
        icon: 'el-icon-success',
        hidden: false,
        roles: ['manager', 'master'],
        component: () => import('@/views/Sign')
      },
      {
        path: '/signlogs',
        name: '签到记录',
        icon: 'el-icon-tickets',
        hidden: true,
        roles: ['user', 'manager', 'master'],
        component: () => import('@/views/SignLogs')
      }
    ]
  },
  {
    path: '/5',
    name: '工时',
    icon: 'el-icon-time',
    hidden: false,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/hours',
        name: '工时记录',
        icon: 'el-icon-tickets',
        hidden: false,
        roles: ['user', 'manager', 'master'],
        component: () => import('@/views/Hours')
      }
    ]
  },
  {
    path: '/6',
    name: '排班',
    icon: 'el-icon-date',
    hidden: false,
    roles: ['user', 'manager', 'master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/myshift',
        name: '查看排班',
        icon: 'el-icon-files',
        hidden: false,
        roles: ['user'],
        component: () => import('@/views/MyShift')
      },
      {
        path: '/shifts',
        name: '排班列表',
        icon: 'el-icon-files',
        hidden: false,
        roles: ['manager', 'master'],
        component: () => import('@/views/Shift')
      }
    ]
  },
  {
    path: '/7',
    name: '加班',
    icon: 'el-icon-warning',
    hidden: false,
    roles: ['manager', 'master'],
    component: () => import('@/layout'),
    children: [
      {
        path: '/overtime',
        name: '加班申请列表',
        icon: 'el-icon-files',
        hidden: false,
        roles: ['manager', 'master'],
        component: () => import('@/views/Overtime')
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
