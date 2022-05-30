import Vue from 'vue'
import Router from 'vue-router'
import {
  UserLayout,
  BasicLayout,
  RouteView,
  PageView
} from '@/layouts'

Vue.use(Router)

const asyncRoutes = [ // dashboard
  {
    path: '/dashboard/workplace',
    name: 'Workplace',
    // redirect: '/dashboard/workplace',
    component: () => import('@/views/dashboard/Workplace'),
    hidden: true,
    meta: {
      title: '工作台'
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/user/Account'),
    meta: {
      title: '账号中心'
    },
    redirect: '/account/base',
    children: [{
      path: '/account/base',
      name: 'AccountBase',
      component: () => import('@/views/user/Account/BaseSetting'),
      meta: {
        title: '基本设置'
      }
    }, {
      path: '/account/security',
      name: 'AccountSecurity',
      component: () => import('@/views/user/Account/Security'),
      meta: {
        title: '安全设置'
      }
    }]
  }, {
    path: '/permissionManage',
    name: 'permissionManage',
    component: PageView,
    meta: {
      title: '权限管理'
    },
    redirect: '/permissionManage/personList',
    children: [{
      path: '/permissionManage/personList',
      name: 'personList',
      component: () => import('@/views/permissionManage/personList'),
      meta: {
        title: '人员列表'
      }
    },
    {
      path: '/permissionManage/roleManage',
      name: 'roleManage',
      component: () => import('@/views/permissionManage/roleManage'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/permissionManage/operaLog',
      name: 'operaLog',
      component: () => import('@/views/permissionManage/operaLog'),
      meta: {
        title: '操作日志'
      }
    },
    {
      path: '/permissionManage/permissMenu',
      name: 'permissMenu',
      component: () => import('@/views/permissionManage/permissMenu'),
      meta: {
        title: '权限菜单'
      }
    }
    ]
  }, {
    path: '/permissionManage',
    name: 'permissionManage',
    component: PageView,
    meta: {
      title: '权限管理'
    },
    redirect: '/permissionManage/personList',
    children: [{
      path: '/permissionManage/personList',
      name: 'personList',
      component: () => import('@/views/permissionManage/personList'),
      meta: {
        title: '人员列表'
      }
    },
    {
      path: '/permissionManage/roleManage',
      name: 'roleManage',
      component: () => import('@/views/permissionManage/roleManage'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/permissionManage/operaLog',
      name: 'operaLog',
      component: () => import('@/views/permissionManage/operaLog'),
      meta: {
        title: '操作日志'
      }
    },
    {
      path: '/permissionManage/permissMenu',
      name: 'permissMenu',
      component: () => import('@/views/permissionManage/permissMenu'),
      meta: {
        title: '权限菜单'
      }
    }
    ]
  }, {
    path: '/houses',
    name: 'houses',
    component: RouteView,
    redirect: '/houses/index',
    meta: {
      title: '楼盘管理'
    },
    hideChildrenInMenu: true,
    children: [{
      path: '/houses/index',
      name: 'housesIndex',
      component: () => import('@/views/houses/index'),
      meta: {
        title: '楼盘管理',
        hidden: true,
        keepAlive: true
      }
    },
    {
      path: '/houses/index1',
      name: 'housesIndex1',
      redirect: '/houses/index',
      component: RouteView,
      meta: {
        title: '楼盘',
        hidden: true
      },
      children: [{
        path: '/houses/edit',
        name: 'housesEdit',
        component: () => import('@/views/houses/edit'),
        meta: {
          title: '楼盘编辑',
          selectedKey: '/houses',
          hidden: true
        }
      },
      {
        path: '/houses/detail',
        name: 'housesDetail',
        component: () => import('@/views/houses/detail'),
        meta: {
          title: '楼盘详情',
          selectedKey: '/houses',
          hidden: true
        }
      }
      ]
    }
    ]
  }, {
    path: '/appointment/index',
    name: 'appointmentIndex',
    component: () => import('@/views/appointment/index'),
    meta: {
      title: '预约选房',
      hidden: true,
      keepAlive: true
    },
    hideChildrenInMenu: true
  }, {
    path: '/appointment',
    name: 'appointment',
    component: RouteView,
    redirect: '/appointment/index',
    meta: {
      title: '预约选房'
    },
    hideChildrenInMenu: true,
    children: [{
      path: '/appointment/index',
      name: 'appointmentIndex',
      component: () => import('@/views/appointment/index'),
      meta: {
        title: '预约选房',
        hidden: true,
        keepAlive: true
      }
    }]
  }, {
    path: '/client',
    name: 'client',
    component: RouteView,
    redirect: '/client/index',
    meta: {
      title: '客户管理'
    },
    hideChildrenInMenu: true,
    children: [{
      path: '/client/index',
      name: 'clientIndex',
      component: () => import('@/views/client/index'),
      meta: {
        title: '客户管理',
        hidden: true,
        keepAlive: true
      }
    },
    {
      path: '/client/detail',
      name: 'clientDetail',
      component: () => import('@/views/client/detail'),
      meta: {
        title: '客户详情',
        hidden: true,
        keepAlive: true
      }
    }
    ]
  },
  {
    path: '/basicSetting',
    name: 'basicSetting',
    component: RouteView,
    meta: {
      title: '基础设置'
    },
    redirect: '/basicSetting/wx',
    children: [{
      path: '/basicSetting/wx',
      name: 'basicSettingWx',
      component: () => import('@/views/basicSetting/wx'),
      meta: {
        title: '小程序设置'
      }
    },
    {
      path: '/basicSetting/agreement',
      name: 'basicSettingAgreement',
      component: () => import('@/views/basicSetting/agreement'),
      meta: {
        title: '协议条款'
      }
    },
    {
      path: '/basicSetting/agreement1',
      name: 'basicSettingAgreement1',
      redirect: '/basicSetting/agreement',
      component: RouteView,
      meta: {
        title: '协议条款'
      },
      children: [{
        path: '/basicSetting/agreementEdit',
        name: 'basicSettingAgreementEdit',
        component: () => import('@/views/basicSetting/agreementEdit'),
        meta: {
          title: '编辑协议条款',
          selectedKey: '/basicSetting/agreement',
          hidden: true
        }
      }]
    },
    {
      path: '/basicSetting/web',
      name: 'basicSettingWeb',
      component: () => import('@/views/basicSetting/web'),
      meta: {
        title: '后台设置'
      }
    }
    ]
  }
]

export {
  asyncRoutes
}

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRoutes = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: '/user/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  }]
},

{
  name: 'index',
  path: '',
  component: BasicLayout,
  redirect: '/dashboard/workplace',
  meta: {
    title: '首页'
  },
  children: asyncRoutes
},

{
  path: '/403',
  name: '403',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
},

{
  path: '/404',
  name: '404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}
]

// 找不到路由则显示404
const errorRoute = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]

export default new Router({
  mode: process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true' ? 'history' : 'hash',
  routes: constantRoutes.concat(errorRoute),
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
