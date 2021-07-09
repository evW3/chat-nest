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
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  try {
    if (to.matched.some(record => record.meta.auth)) {
      let token = localStorage.getItem('token');
      if(!token) {
        let cookieList = document.cookie.split(';');

        const token = cookieList[cookieList.findIndex(cookie => {
          return cookie.split('=')[0].trim() === 'auth-cookie';
        })].split('=').reverse()[0];

        if(!token) {
          next('/sign-in');
        }

        localStorage.setItem('token', token);
        next();
      }
    }
    next();
  } catch (e) {
    console.log(`[VUE ROUTER ERROR]\n${e}`);
  }
});