<template>
  <div class="header">
    <el-link type="info" href="/" class="header-text">
      <img class="header-logo" src="@/assets/logo.png">
      梦学谷会员管理系统
    </el-link>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="updatePwd">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-close" command="logout">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { logout } from '@/api/login'
  export default {
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'updatePwd':
            // 修改密码
            this.$message('修改密码');
            break
          case 'logout':
            // 退出系统
            const token = localStorage.getItem('mxg-msm-token')
            logout(token).then(response => {
              const resp = response.data
              if (resp.flag) {
                // 1.清除登录信息缓存
                localStorage.removeItem('mxg-msm-user')
                localStorage.removeItem('mxg-msm-token')
                // 2.弹窗提示
                this.$message({
                  message: '退出系统成功',
                  type: 'warning',
                  duration: 500 // 500ms
                })
                // 3.跳转到登录页
                this.$router.push('/login')
              }
            })
            break
        }
      }
    }
  }

</script>

<style scoped>
  .header-text {
    color: white;
    font-size: 16px;
  }
  .header-logo {
    width: 25px;
    vertical-align: middle;
    padding: 0 7px 0 40px;
  }
  .el-dropdown {
    float: right;
    margin-right: 40px;
    cursor: pointer;
    color: white;
  }
</style>
