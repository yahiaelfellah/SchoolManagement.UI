import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import DashboardLayout from "../layouts/Dashboard.vue";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/Login.vue") },
  {
    path: "/",
    component: DashboardLayout, // changed: use imported layout directly
    children: [
      {
        path: "",
        redirect: "/operations", // changed to absolute redirect
      },
      {
        path: "/operations", // changed to absolute path
        component: () => import("@/views/Operations/Operations.vue"),
      },
      {
        path: "/students",
        component: () => import("@/views/Students.vue"),
      },
      {
        path: "/students/:id",
        component: () => import("@/views/StudentDetails.vue"),
      },
      {
        path: "/teachers",
        component: () => import("@/views/Teachers.vue"),
      },
      {
        path: "/classes", // fixed: point to Classes view
        component: () => import("@/views/Classes.vue"),
      },
      {
        path: "/systems",
        component: () => import("@/views/ManageSystem.vue"),
      },
      {
        path: "/operations/:type/add",
        name: "AddEntity",
        component: () => import("@/views/Operations/AddEntity.vue"),
      },
      {
        path: "/operations/:type/assign",
        name: "AssignEntity",
        component: () => import("@/views/Operations/AssignEntity.vue"),
      },
      {
        path: "/operations/generateTimetable",
        name: "GenerateTimetable",
        component: () => import("@/views/Operations/GenerateTimetable.vue"),
      },
      {
        path: "/operations/students/enroll",
        name: "EnrollStudent",
        component: () => import("@/views/Operations/EnrollStudent.vue"),
      },
      {
        path: "/operations/:type/upload",
        name: "uploadDocuments",
        component: () => import("@/views/Operations/UploadDocuments.vue"),
        props: true,
      },
      {
        path: "/operations/:type/delete",
        name: "deleteOrarchive",
        component: () => import("@/views/Operations/DeleteOrArchive.vue"),
        props: true,
      },
      {
        path: "/operations/setCalendar",
        name: "setCalendar",
        component: () => import("@/views/Operations/SetCalendar.vue"),
        props: true,
      },
      {
        path: "/operations/addPayment",
        name: "addPayment",
        component: () => import("@/views/Operations/AddPayment.vue"),
        props: true,
      },
      {
        path: "/operations/markAttendance",
        name: "markAttendance",
        component: () => import("@/views/Operations/MarkAttendance.vue"),
        props: true,
      },
      {
        path: "/operations/attendanceReport",
        name: "attendanceReport",
        component: () => import("@/views/Operations/AttendanceReport.vue"),
        props: true,
      },
      {
        path: "/operations/viewAttendanceSummary",
        name: "viewAttendanceSummary",
        component: () => import("@/views/Operations/ViewAttendanceSummary.vue"),
        props: true,
      },
      {
        path: "/finance",
        name: "finance-dashboard", // explicit name to ensure clear matching
        component: () => import("@/views/Finance/FinanceDashboard.vue"),
      },
      {
        path: "/finance/tuition-plans",
        name: "tuition-plans",
        component: () => import("@/views/Finance/TuitionPlans.vue"),
      },
      {
        path: "/finance/payment-ledger",
        name: "payment-ledger",
        component: () => import("@/views/Finance/PaymentLedger.vue"),
      },
      {
        path: "/finance/services",
        name: "services",
        component: () => import("@/views/Finance/Services.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth guard
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }
});

export default router;
