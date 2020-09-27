<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import VueRouter from 'vue-router'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>
</style>
