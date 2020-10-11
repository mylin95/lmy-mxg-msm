import request from '@/utils/request'

export default {
  /**
   * 校验密码
   * @param userId 用户id
   * @param password 旧密码
   */
  checkPassword(userId, password) {
    return request({
      url: '/user/pwd',
      method: 'post',
      data: {
        userId,
        password
      }
    })
  },
  /**
   * 更新密码
   * @param userId 用户id
   * @param password 新密码
   */
  updatePassword(userId, password) {
    return request({
      url: '/user/pwd',
      method: 'put',
      data: {
        userId,
        password
      }
    })
  }
}
