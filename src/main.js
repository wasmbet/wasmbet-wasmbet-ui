import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'

import Gamble from './components/Gamble'
import Stake from './components/Stake'

Vue.use(VueRouter);

const routes = [
  {
    path: '/' ,
    name: 'stake',
    component : Stake,
  },
  {
    path: '/gamble/:address' ,
    name: 'gamble',
    component : Gamble,
  },
]


const router = new VueRouter({
  mode : 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
})

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial)


// const routes = [
//   {
//     path: '/' ,
//     component : Home,
//     children: [
//       { path: '/', component : Gamble},
//       { path: '/gamble', component : Gamble},
//       { path: '/stake', component : Stake},
//     ],
//   },
// ]

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
