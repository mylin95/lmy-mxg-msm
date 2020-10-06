<template>
  <div>
    <app-header></app-header>
    <app-nar-bar></app-nar-bar>
    <app-main></app-main>
  </div>
</template>

<script>
  import AppHeader from '@/components/AppHeader'
  import AppNarBar from '@/components/AppNarBar'
  import AppMain from '@/components/AppMain'

  export default {
    components: {
      AppHeader,
      AppNarBar,
      AppMain
    }
  }
</script>

<style scoped>
  .header {
    position: absolute;
    line-height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: #2d3a4b;
  }

  .nav-bar {
    position: absolute;
    width: 230px;
    top: 50px;
    left: 0px;
    bottom: 0px;
    /*y轴过长 滚动条*/
    overflow-y: auto;
    background-color: #545c64;
  }

  .main {
    position: absolute;
    /*同样有效*/
    /*width: calc(100% - 230px);*/
    top: 50px;
    right: 0px;
    bottom: 0px;
    left: 230px;
    overflow-y: auto;
    /*background-color: red;*/
  }
</style>
