// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () =>
          import("../components/Login.vue"),
      },
      {
        path: "/accounts",
        name: "accounts",
        component: () =>
          import("../components/Accounts.vue"),
      },
      {
        path: "/free-shipping",
        name: "freeshipping",
        component: () =>
          import("../components/FreeShipping.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
