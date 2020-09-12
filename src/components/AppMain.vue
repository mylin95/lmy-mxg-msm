<template>
  <div class="main">
    <nar-bar-title v-show="$route.path !== '/home'"></nar-bar-title>
    <router-view></router-view>
  </div>
</template>

<script>
  import NarBarTitle from './NarBarTitle'
  export default {
    components: {
      NarBarTitle
    }
  }
</script>

<style scoped>
  .main {
    padding: 10px;
  }
</style>
