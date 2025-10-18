import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import DashboardLayout from '../layouts/Dashboard.vue'
import { useAuthStore } from '../store/auth'

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/Login.vue") },
  {
    path: "/",
    component: () => DashboardLayout,
    children: [
      { path: "", redirect: "/students" },
      { path: "/students", component: () => import("@/views/Students.vue") },
      { path: "/teachers", component: () => import("@/views/Teachers.vue") },
      { path: "/classes", component: () => import("@/views/Teachers.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth guard

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router;
