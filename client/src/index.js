import { createApp } from 'vue';
import App from '@/App';
import { pageTitle } from '@mixins/pageTitle';
import { router }  from '@/router/index';
import { store } from '@store/index';
import VueSocketIO from 'vue-socket.io'
import { API_URL } from './constants';

const app = createApp(App);
app.use(store);
app.use(new VueSocketIO({
  debug: false,
  connection: `${API_URL}`,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));
app.use(router);
app.mixin(pageTitle);
app.mount('#app');