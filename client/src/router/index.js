import { createWebHistory, createRouter } from 'vue-router';

export const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: { auth: true, layout: "empty" },
      component: () => import('../views/Home.vue')
    },
    {
      path: '/sign-in',
      name: 'sing-in',
      meta: { auth: false, layout: "empty" },
      component: () => import('../views/SignIn')
    },
    {
      path: '/sign-up',
      name: 'sing-up',
      meta: { auth: false, layout: "empty" },
      component: () => import('../views/SignUp')
    },
    {
      path: '/test',
      name: 'test',
      meta: { auth: false, layout: "empty" },
      component: () => import('../views/Test')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  try {
    if (to.matched.some(record => record.meta.auth)) {
      const token = localStorage.getItem('token');

      if(!token) {
        next('/sign-in');
      }
    }
    next();
  } catch (e) {
    console.log(`[VUE ROUTER ERROR]\n${e}`);
  }
});



