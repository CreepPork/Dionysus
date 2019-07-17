import Vue from 'vue';
import VueRouter from 'vue-router';

import './bootstrap';

Vue.use(VueRouter);

// Auto register all Vue components
// @ts-ignore As this is polyfilled to a webpack require .context works.
// const files = require.context('./', true, /\.vue$/i);
// files.keys().map((key: string) => {
//     const splitKey = key.split('/').pop();
//     if (splitKey !== undefined) {
//         Vue.component(
//             splitKey.split('.')[0],
//             files(key).default,
//         );
//     }
// });

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
