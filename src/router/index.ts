import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import DashboardLayout from "../layouts/Dashboard.vue";
import { useAuthStore } from "../store/auth";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/Login.vue") },
  {
    path: "/",
    component: () => DashboardLayout,
    children: [
      {
        path: "",
        redirect: "/operations",
      },
      {
        path: "/operations",
        component: () => import("@/views/Operations/Operations.vue"),
      },
      { path: "/students", component: () => import("@/views/Students.vue") },
      { path: "/teachers", component: () => import("@/views/Teachers.vue") },
      { path: "/classes", component: () => import("@/views/Teachers.vue") },
      {
        path: "/operations/:type/add",
        name: "AddEntity",
        component: () => import("@/views/operations/AddEntity.vue"),
      },
            {
        path: "/operations/:type/assign",
        name: "AssignEntity",
        component: () => import("@/views/operations/AssignEntity.vue"),
      },
                  {
        path: "/operations/generateTimetable",
        name: "GenerateTimetable",
        component: () => import("@/views/operations/GenerateTimetable.vue"),
      },
      {
        path: "/operations/enrollStudent",
        component: () => import("@/views/Operations/EnrollStudent.vue"),
      },
      {
        path: "/operations/upload/:type",
        name: "uploadDocuments",
        component: () => import("@/views/Operations/UploadDocuments.vue"),
        props: true,
      },
      {
        path: "/operations/deleteOrarchive",
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
