<template>

  <div class="module-a-page1">

    <h1>{{title}}</h1>
    <p>{{intro}}</p>

    <mt-cell :to="{name: 'moduleAIndex'}"
             title="module-a index.vue" is-link>
    </mt-cell>
    <mt-cell :to="{name: 'moduleAPage1'}"
             title="module-a page1.vue" is-link>
    </mt-cell>

    <br>

    <mt-cell to="/a.html#/module-a" title="go module-a" is-link>
    </mt-cell>
    <mt-cell to="/b.html#module-b" title="go module-b" is-link>
    </mt-cell>

  </div>

</template>

<script>

  export default {
    name: 'module-a-index',
    data() {
      return {
        title: 'module-a page1 页面',
        intro: '使用webpack+vue构建多页应用'
      }
    }
  }

</script>