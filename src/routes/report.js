import { isLoggedIn } from "./../session.js";

export default [
  {
    path: "/report",
    component: () => import("./../layouts/MainLayout.vue"),
    children: [
      {
        path: "monitoring-spk",
        component: () => import("./../pages/Report/MonitoringSPK.vue"),
      },
      {
        path: "operator-mesin-hours",
        component: () => import("./../pages/Report/OperatorMesinHours.vue"),
      },
      {
        path: "sla/section",
        component: () => import("./../pages/Report/SlaSection.vue"),
      },
      {
        path: "sla/general/periode",
        component: () => import("./../pages/Report/SlaGeneralPeriode.vue"),
      },
      {
        path: "sla/general/ytd",
        component: () => import("./../pages/Report/SlaGeneralYTD.vue"),
      },
      {
        path: "sla/repair/periode",
        component: () => import("./../pages/Report/SlaRepairPeriode.vue"),
      },
      {
        path: "sla/repair/ytd",
        component: () => import("./../pages/Report/SlaRepairYTD.vue"),
      },
      {
        path: "spk/total",
        component: () => import("./../pages/Report/SpkTotal.vue"),
      },
      {
        path: "sla/gantt/chart",
        component: () => import("./../pages/Report/GanttChart.vue"),
      },
      {
        path: "overtime",
        component: () => import("./../pages/Report/Overtime.vue"),
      },
      {
        path: "tjkn",
        component: () => import("./../pages/Report/TJKNReport.vue"),
      },
      {
        path: "performance/employee",
        component: () => import("./../pages/Report/PerformanceEmployee.vue"),
      },
      {
        path: "spk/general",
        component: () => import("./../pages/Report/SpkGeneral.vue"),
      },
      {
        path: "spk/mold",
        component: () => import("./../pages/Report/SpkMold.vue"),
      },
      {
        path: "temuan",
        component: () => import("./../pages/Report/Temuan.vue"),
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
