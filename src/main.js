import Vue from "vue";
// ElementUI在Vue框架下方引用
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";

Vue.use(ElementUI);

// 消息提示的环境配置，是否为生产环境：
// false 开发环境：Vue会提供很多警告来方便调试代码。
// true 生产环境：警告却没有用，反而会增加应用的体积
Vue.config.productionTip = process.env.NODE_ENV === "production";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.VUE_APP_SERVICE_URL", process.env.VUE_APP_SERVICE_URL);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
