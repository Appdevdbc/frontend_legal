import { isLoggedIn } from "./../session.js";

export default [
  {
    path: "/spk",
    redirect: "/spk/proses",
    component: () => import("./../layouts/MainLayout.vue"),
    children: [
      {
        path: "proses",
        component: () => import("./../pages/SPK/Proses.vue"),
      },
      {
        path: "close",
        component: () => import("./../pages/SPK/Close.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      if (!isLoggedIn()) {
        next({ path: "/login" });
      } else {
        next();
      }
    },
  },
]
