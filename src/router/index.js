import Vue from 'vue'
import Router from 'vue-router'

import moduleAIndex from '@/pages/module-a/index.vue'
import moduleAPage1 from '@/pages/module-a/page1.vue'

import moduleBIndex from '@/pages/module-b/index.vue'
import moduleBPage1 from '@/pages/module-b/page1.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      components: {
        default: moduleAIndex
      }
    },
    {
      path: '/module-a',
      name: 'moduleAIndex',
      components: {
        default: moduleAIndex
      }
    },
    {
      path: '/module-a/page1',
      name: 'moduleAPage1',
      components: {
        default: moduleAPage1
      }
    },
    {
      path: '/module-b',
      name: 'moduleBIndex',
      components: {
        default: moduleBIndex
      }
    },
    {
      path: '/module-b/page1',
      name: 'moduleBPage1',
      components: {
        default: moduleBPage1
      }
    }
  ]
})
