import Vue from 'vue';
import router from '../router';

import 'mint-ui/lib/style.css';

import MintUI from 'mint-ui';
Vue.use(MintUI);

import ModuleA from '../pages/module-a.vue'

new Vue({
  el: '#page-a',
  router,
  template: '<ModuleA/>',
  components: { ModuleA }
})
