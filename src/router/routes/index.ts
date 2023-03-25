const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      title: '分类',
    },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/index.vue'),
    meta: {
      title: '购物车',
      keepAlive:false
    },
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/mine/index.vue'),
    meta: {
      title: '我的',
      keepAlive:false
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      keepAlive:false
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
      keepAlive:false
    },
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    component: () => import('@/views/resetPwd/index.vue'),
    meta: {
      title: '重置密码',
      keepAlive:false
    },
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/views/order/list.vue'),
    meta: {
      title: '订单列表',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/order/detail',
    name: 'OrderDetail',
    component: () => import('@/views/order/detail.vue'),
    meta: {
      title: '订单详情',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/order/submit',
    name: 'OrderSubmit',
    component: () => import('@/views/order/submit.vue'),
    meta: {
      title: '提交订单',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/order/payResult',
    name: 'OrderPayResult',
    component: () => import('@/views/order/payResult.vue'),
    meta: {
      title: '支付结果',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/refund',
    name: 'refund',
    component: () => import('@/views/refund/index.vue'),
    meta: {
      title: '退款/售后',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/refund/apply',
    name: 'refundApply',
    component: () => import('@/views/refund/apply.vue'),
    meta: {
      title: '申请售后',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/views/coupon/index.vue'),
    meta: {
      title: '我的优惠券',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/integral',
    name: 'integral',
    component: () => import('@/views/integral/index.vue'),
    meta: {
      title: '积分中心',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/integral/rule',
    name: 'integralRule',
    component: () => import('@/views/integral/rule.vue'),
    meta: {
      title: '积分规则',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/integral/scoreLog',
    name: 'integralScoreLog',
    component: () => import('@/views/integral/scoreLog.vue'),
    meta: {
      title: '积分明细',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/integral/exchange',
    name: 'integralExchange',
    component: () => import('@/views/integral/exchange.vue'),
    meta: {
      title: '积分兑换',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/views/wallet/index.vue'),
    meta: {
      title: '我的钱包（资产）',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/wallet/cashLog',
    name: 'walletCashLog',
    component: () => import('@/views/wallet/cashLog.vue'),
    meta: {
      title: '资金记录',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/address/index.vue'),
    meta: {
      title: '收货地址',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/address/edit',
    name: 'addressEdit',
    component: () => import('@/views/address/edit.vue'),
    meta: {
      title: '编辑收货地址',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/good/detail',
    name: 'GoodDetail',
    component: () => import('@/views/good/detail.vue'),
    meta: {
      title: '商品详情',
      keepAlive:false
    },
  },
  {
    path: '/good/reputation',
    name: 'GoodReputation',
    component: () => import('@/views/good/reputation.vue'),
    meta: {
      title: '全部评价',
      keepAlive:false
    },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: '设置',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: '编辑资料',
      needLogin: true,
      keepAlive:false
    },
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('@/views/theme/index.vue'),
    meta: {
      title: '主题风格',
    },
  },
  // Test
  {
    path: '/test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: '测试',
    },
  },
  // exception
  {
    path: '/reload',
    component: () => import('@/views/exception/reload.vue'),
    meta: {
      title: '加载异常',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404.vue'),
    meta: {
      title: '找不到页面',
    },
  },
  // 404 Not found
  { path: '/:path(.*)*', redirect: '/404' },
];

export default routes;
