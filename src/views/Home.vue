<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld :msg="helloWorldMsg" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// import request from '../utils/request'
import testApi from '@/api/test'

export default {
  name: "Home",
  data() {
    return {
      helloWorldMsg: 'Welcome to Your Vue.js App',
      list: []
    }
  },
  components: {
    HelloWorld
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      testApi.getList().then(response => {
        console.log('getList', response.data)
        this.list = response.data
        this.helloWorldMsg = JSON.stringify(response.data)
      })
    }
  }
};
</script>
