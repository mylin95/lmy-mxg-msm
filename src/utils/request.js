import axios from "axios";
import Vue from "vue";

// lmy: db.json放置在与index.html的打包同目录下，此请求能找到
// axios.get('/db.json').then(response => {
// 	const data = response.data
// 	console.log('test axios', data)
// })

let vm = new Vue();

// 封装自定义axios
const request = axios.create({
  // baseURL: '/lmy', // 默认为/，自动添加请求前缀
  // baseURL: '/',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 //请求超时，5000ms
});

// lmy: 请求拦截器，封装请求提交前的操作
// Add a request interceptor
request.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// lmy：响应报文的拦截器
// Add a response interceptor
request.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("response interceptor", response);
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // alert(error.config.url + ' ' + error.message)
    vm.$message({
      type: "error",
      message: error.config.url + ' ' + error.message
    })
    return Promise.reject(error);
  }
);

// 导出自定义的axios
export default request;
