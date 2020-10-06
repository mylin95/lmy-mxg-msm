<template>
  <div class="login-form-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="login-form-title">梦学谷会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="form.username" autofocus></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {login, getUserInfo} from '@/api/login'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '账号不能为空！', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空！', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //  验证成功，提交表单到后台
          login(this.form.username, this.form.password).then(response => {
            const resp = response.data
            if (resp.flag === true) {
              // 验证成功，通过tocker去获取用户信息
              getUserInfo(resp.data.token).then(response => {
                // 获取到的用户信息
                const respUser = response.data
                if (respUser.flag === true) {
                  console.log('userInfo', respUser.data)
                  // 1.保存token、用户信息
                  localStorage.setItem('mxg-msm-user', JSON.stringify(respUser.data))
                  localStorage.setItem('mxg-msm-token', resp.data.token)
                  // 2.前往首页
                  this.$router.push('/')
                } else {
                  this.$message({
                    message: respUser.message,
                    type: 'warning'
                  });
                }

              })
            } else {
              // 未通过，弹出警告
              // this.$alert(resp.message)
              this.$message({
                message: resp.message,
                type: 'warning'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
  .login-form-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/login.jpg");
  }
  .login-form {
    width: 350px;
    margin: 160px auto;
    background-color: rgba(225, 225, 225, 0.8);
    padding: 30px;
    border-radius: 20px;
  }
  .login-form-title {
    color: #303133;
    text-align: center;
  }
</style>
