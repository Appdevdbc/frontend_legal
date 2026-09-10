import { isLoggedIn } from "./../session.js";

export default [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("./../layouts/MainLayout.vue"),
    children: [
      {
        path: "collection/user",
        component: () => import("./../pages/Master/IndexUser.vue"),
      },
      {
        path: "collection/menu",
        component: () => import("./../pages/Master/IndexRole.vue"),
      },
      {
        path: "collection/legal-master-data",
        component: () => import("./../pages/WJS/MasterData/Index.vue"),
      },
      {
        path: "collection/wjs-master-transactions",
        component: () => import("./../pages/WJS/MasterTransactions/Index.vue"),
      },
      {
        path: "collection/terima-spk",
        component: () => import("./../pages/WJS/TerimaSPK/Index.vue"),
      },
      {
        path: "collection/report-service-level",
        component: () => import("./../pages/Report/ServiceLevelCollection/Index.vue"),
      },
      {
        path: "collection/report-spk",
        component: () => import("./../pages/Report/SpkCollection/Index.vue"),
      },
      {
        path: "collection/report-lainnya",
        component: () => import("./../pages/Report/OtherReportCollection/Index.vue"),
      },
      {
        path: "collection-detail/:id/:parent/:parentName",
        component: () => import("./../pages/Master/CollectionDetail.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      if (!isLoggedIn()) {
        next({
          path: "/login",
        });
      } else {
        next();
      }
    },
  },
]

