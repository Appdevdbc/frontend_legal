import { createRouter, createWebHashHistory } from "vue-router";
import { role } from "./../utils";
import { isLoggedIn } from "./../session.js";

import master from './master';
import dms from './wjs';
import collection from './collectionList';
import spk from './spk';
import report from './report';
import transaction from './transaction';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...master,//Master general
    ...collection,//List Collection
    ...dms,//DMS routes
    ...spk,//SPK routes
    ...report,//Report routes
    ...transaction,//Transaction routes
    {
      path: "/",
      redirect: (to) => {
        // Check if user is logged in (flag session, bukan token)
        if (isLoggedIn()) {
          return "/master/dashboard";
        } else {
          return "/login";
        }
      }
    },
    {
      path: "/dashboard",
      redirect: "/master/dashboard"
    },
    {
      path: "/login",
      component: () => import("./../layouts/MainLogin.vue"),
    },
    {
      path: "/404",
      component: () => import("./../pages/Error404.vue"),
    },
    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("./../pages/Error404.vue"),
    },
  ],
});


router.beforeEach(async (to, from, next) => {
  window.scrollTo(0, 0);

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description);
    }
  }

  next();
});

export default router;


