import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'home-4-line',
      affix: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页',
          icon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/table',
    alwaysShow: true,
    meta: {
      title: '合同管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin', 'ROLE_sale_admin', 'ROLE_sale_person'],
    },
    children: [
      {
        path: 'table',
        name: 'ContractTable',
        component: () => import('@/views/contract/table'),
        meta: {
          title: '合同列表',
          icon: 'table-2',
        },
      },
      {
        path: 'add',
        name: 'ContractAdd',
        component: () => import('@/views/contract/add'),
        meta: {
          title: '合同添加',
          icon: 'remixicon-line',
        },
      },
    ],
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/table',
    // alwaysShow: true,
    meta: {
      title: '客户管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin', 'ROLE_sale_admin'],
    },
    children: [
      {
        path: 'table',
        name: 'CustomerTable',
        component: () => import('@/views/customer/table'),
        meta: {
          title: '客户列表',
          icon: 'table-2',
          roles: ['ROLE_super_admin', 'ROLE_sale_admin'],
        },
      },
      {
        path: 'icon',
        name: 'CustomerAdd',
        component: () => import('@/views/customer/add'),
        meta: {
          title: '客户添加',
          icon: 'remixicon-line',
          roles: ['ROLE_super_admin', 'ROLE_sale_admin'],
        },
      },
    ],
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/table',
    alwaysShow: true,
    meta: {
      title: '商品管理',
      icon: 'apps-line',
      roles: [
        'ROLE_super_admin',
        'ROLE_sale_admin',
        'ROLE_store_admin',
        'ROLE_sale_person',
      ],
    },
    children: [
      {
        path: 'table',
        name: 'GoodsTable',
        component: () => import('@/views/goods/table'),
        meta: {
          title: '商品列表',
          icon: 'table-2',
        },
      },
      {
        path: 'add',
        name: 'GoodsAdd',
        component: () => import('@/views/goods/add'),
        meta: {
          title: '商品添加',
          icon: 'remixicon-line',
        },
      },
    ],
  },
  {
    path: '/goodsin',
    component: Layout,
    redirect: '/goodsin/table',
    alwaysShow: true,
    meta: {
      title: '进货管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin', 'ROLE_sale_admin', 'ROLE_store_admin'],
    },
    children: [
      {
        path: 'table',
        name: 'GoodsInTable',
        component: () => import('@/views/goodsin/table'),
        meta: {
          title: '进货单列表',
          icon: 'table-2',
        },
      },
    ],
  },
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/table',
    alwaysShow: true,
    meta: {
      title: '采购清单管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin', 'ROLE_sale_admin', 'ROLE_sale_person'],
    },
    children: [
      {
        path: 'table',
        name: 'PurchaseTable',
        component: () => import('@/views/purchase/table'),
        meta: {
          title: '采购清单列表',
          icon: 'table-2',
        },
      },
    ],
  },
  {
    path: '/salesperson',
    component: Layout,
    redirect: '/salesperson/table',
    alwaysShow: true,
    meta: {
      title: '销售人员管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin', 'ROLE_sale_admin'],
    },
    children: [
      {
        path: 'table',
        name: 'SalespersonTable',
        component: () => import('@/views/salesperson/table'),
        meta: {
          title: '销售人员列表',
          icon: 'table-2',
        },
      },
      {
        path: 'add',
        name: 'SalespersonAdd',
        component: () => import('@/views/salesperson/add'),
        meta: {
          title: '销售人员添加',
          icon: 'table-2',
        },
      },
    ],
  },
  {
    path: '/role',
    component: Layout,
    // hidden: true,
    alwaysShow: true,
    meta: {
      title: '角色管理',
      icon: 'apps-line',
      roles: ['ROLE_super_admin'],
    },
    children: [
      {
        path: '',
        component: () => import('@/views/role'),
        name: 'Role',
        meta: { title: '角色控制', icon: 'user', noCache: true },
      },
    ],
  },
  // {
  //   path: '/vab',
  //   component: Layout,
  //   redirect: '/vab/table',
  //   alwaysShow: true,
  //   meta: {
  //     title: '组件',
  //     icon: 'apps-line',
  //   },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/vab/table'),
  //       meta: {
  //         title: '表格',
  //         icon: 'table-2',
  //       },
  //     },
  //     {
  //       path: 'icon',
  //       name: 'Icon',
  //       component: () => import('@/views/vab/icon'),
  //       meta: {
  //         title: '图标',
  //         icon: 'remixicon-line',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/test',
  //   meta: {
  //     title: '动态路由测试',
  //     icon: 'test-tube-line',
  //   },
  //   children: [
  //     {
  //       path: 'test',
  //       name: 'Test',
  //       component: () => import('@/views/test'),
  //       meta: {
  //         title: '动态路由测试',
  //         icon: 'test-tube-line',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/ContractDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index/:contractId',
        component: () => import('@/views/contract/detail'),
        name: 'ContractDetail',
        meta: { title: '合同详情', icon: 'user', noCache: true },
      },
    ],
  },
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/profile'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true },
      },
    ],
  },
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    meta: {
      title: '错误页',
      icon: 'error-warning-line',
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/403'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/*',
    redirect: '/404',
    hidden: true,
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
