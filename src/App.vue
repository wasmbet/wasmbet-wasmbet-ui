<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from './components/Main';

export default {
  components: {
    Main,
  },
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
