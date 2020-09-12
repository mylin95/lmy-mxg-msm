import request from "../utils/request";

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username, // username: username
      password
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: `/user/info/${token}`,
    methods: 'get'
  })
}
