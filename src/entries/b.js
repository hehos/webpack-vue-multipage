import Vue from 'vue';
import router from '../router';

import 'mint-ui/lib/style.css';

import MintUI from 'mint-ui';
Vue.use(MintUI);

import ModuleB from '../pages/module-b.vue'

new Vue({
  el: '#page-b',
  router,
  template: '<ModuleB/>',
  components: { ModuleB }
})
