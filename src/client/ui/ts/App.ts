import Vue from 'vue';
import VueRouter from 'vue-router';

import './Bootstrap';

Vue.use(VueRouter);

import AppLayout from './layouts/AppLayout.vue';
import HomeView from './views/HomeView.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

new Vue({
    render: h => h(AppLayout),
    router: new VueRouter({
        routes: [
            {
                component: HomeView,
                name: 'home',
                path: '/',
            },
        ],
    }),
}).$mount('#app');
