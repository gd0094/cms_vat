import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

 /*  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
 */
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", icon: "el-icon-s-home", affix: true },
      },
    ],
  },
  // {
  //   path: "/clothes",
  //   component: Layout,
  //   redirect: "/clothes",
  //   name: "Clothes",
  //   meta: { title: "服装管理", icon: "el-icon-goods" },
  //   children: [
  //     {
  //       path: "message",
  //       name: "message",
  //       component: () => import("@/views/clothes/message/index"),
  //       meta: { title: "录入", icon: "el-icon-edit",name:'message'},
  //     },
  //     {
  //       path: "category",
  //       name: "category",
  //       component: () => import("@/views/clothes/category/index"),
  //       meta: { title: "类别", icon: "el-icon-files" },
  //     },
  //     {
  //       path: "style",
  //       name: "style",
  //       component: () => import("@/views/clothes/style/index"),
  //       meta: { title: "款式", icon: "el-icon-s-custom" },
  //     },
  //     {
  //       path: "inventory",
  //       name: "Inventory",
  //       component: () => import("@/views/clothes/inventory/index"),
  //       meta: { title: "库存", icon: "el-icon-box" },
  //     },
  //   ],
  // },
  // {
  //   path: "/sale",
  //   component: Layout,
  //   redirect: "/sale",
  //   name: "Sale",
  //   meta: { title: "销售管理", icon: "el-icon-shopping-cart-2" },
  //   children: [
  //     // {
  //     //   path: "panel",
  //     //   name: "panel",
  //     //   component: () => import("@/views/sale/panel"),
  //     //   meta: { title: "面板", icon: "el-icon-s-order" },
  //     // },
      
  //     {
  //       path: "sale",
  //       name: "sale",
  //       component: () => import("@/views/sale/sale"),
  //       meta: { title: "销售", icon: "el-icon-goods" },
  //     },
  //     {
  //       path: "record",
  //       name: "Record",
  //       component: () => import("@/views/sale/record"),
  //       meta: { title: "记录", icon: "el-icon-notebook-2" },
  //     },
  //     {
  //       path: "payment",
  //       name: "payment",
  //       component: () => import("@/views/sale/payment"),
  //       meta: { title: "支付", icon: "el-icon-shopping-cart-full" },
  //     },
  //     {
  //       path: "member",
  //       name: "member",
  //       component: () => import("@/views/sale/member"),
  //       meta: { title: "会员", icon: "el-icon-s-check" },
  //     },
  //   ],
  // },
  // {
  //   path: "/report",
  //   component: Layout,
  //   redirect: "/report",
  //   name: "Report",
  //   meta: { title: "报表管理", icon: "el-icon-pie-chart" },
  //   children: [
  //     {
  //       path: "dashboard",
  //       name: "dashboard",
  //       component: () => import("@/views/report/dashboard/index"),
  //       meta: { title: "数据统计", icon: "el-icon-s-marketing" },
  //     },

  //   ]
  // },
  // {
  //   path: "/im",
  //   component: Layout,
  //   redirect: "/im",
  //   name: "Im",
  //   meta: { title: "即时通讯", icon: "el-icon-pie-chart" },
  //   children: [
  //     {
  //       path: "im",
  //       name: "im",
  //       component: () => import("@/views/im/im/index"),
  //       meta: { title: "即时通讯", icon: "el-icon-phone-outline" },
  //     },

  //   ]
  // },
  // {
  //   path: "/system",
  //   component: Layout,
  //   redirect: "/system/user",
  //   name: "System",
  //   meta: { title: "系统管理", icon: "el-icon-setting" },
  //   children: [
  //     {
  //       path: "user",
  //       name: "User",
  //       component: () => import("@/views/system/user/index"),
  //       meta: { title: "用户", icon: "el-icon-user" },
  //     },
  //     {
  //       path: "role",
  //       name: "Role",
  //       component: () => import("@/views/system/role/index"),
  //       meta: { title: "角色", icon: "el-icon-lock" },
  //     },
  //     {
  //       path: "menu",
  //       name: "Menu",
  //       component: () => import("@/views/system/menu/index"),
  //       meta: { title: "菜单", icon: "el-icon-menu" },
  //     },
  //     {
  //       path: "oss",
  //       name: "oss",
  //       component: () => import("@/views/system/oss/wall"),
  //       meta: { title: "对象存储", icon: "el-icon-picture" },
  //     },
  //   ],
  // },
  // {
  //   path: "/monitor",
  //   component: Layout,
  //   redirect: "/monitor/druid",
  //   name: "Monitor",
  //   meta: { title: "系统监控", icon: "el-icon-view" },
  //   children: [
  //     {
  //       path: "druid",
  //       name: "Druid",
  //       component: () => import("@/views/monitor/sql/index"),
  //       meta: { title: "SQL监控", icon: "el-icon-menu" },
  //     },
  //     {
  //       path: "cache",
  //       name: "Cache",
  //       component: () => import("@/views/monitor/cache/index"),
  //       meta: { title: "缓存监控", icon: "el-icon-menu" },
  //     },
  //   ],
  // },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;

