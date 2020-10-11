<template>
  <div class="header">
    <el-link type="info" href="/" class="header-text">
      <img class="header-logo" src="@/assets/logo.png">
      梦学谷会员管理系统
    </el-link>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="updatePwd">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-close" command="logout">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passwordForm')">提交</el-button>
          <el-button @click="$refs.passwordForm.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { logout } from '@/api/login'
  import passwordApi from "@/api/password"

  export default {
    data() {
      /** 旧密码校验规则： 1.为空，则报错 2.不为空，则校验密码是否正确 */
      let validateOldPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('旧密码不能为空'))
        } else {
          passwordApi.checkPassword(this.user.id, value).then(response => {
            let resp = response.data
            if (resp.flag) {
              // 校验成功，放行
              callback()
            } else {
              // 校验失败，报错
              callback(new Error(resp.message))
            }
          })
        }
      }

      /** 新密码校验规则： 1.为空，则报错 2.不为空，则校验确认密码 */
      let validateNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空'));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass');
          }
          callback();
        }
      }
      /** 确认密码校验规则： 1.为空，则报错 2.不为空，则校验两个密码是否一致 */
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('确认密码不能为空'))
        } else {
          if (this.passwordForm.newPassword === this.passwordForm.checkPass) {
            callback()
          } else {
            callback(new Error('两次密码输入不一致'))
          }
        }
      }
      return {
        user: JSON.parse(localStorage.getItem('mxg-msm-user')),
        dialogFormVisible: false,
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          checkPass: ''
        },
        rules: {
          // oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
          // oldPassword: [{ validator: validateOldPassword, trigger: 'blur' }],
          oldPassword: [{ required: true, validator: validateOldPassword, trigger: 'blur' }],
          newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
          checkPass: [{ required: true, validator: validateCheckPass, trigger: 'change' }]
        }
      }
    },
    mounted() {
      console.log('user', this.user, this.user.name)
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'updatePwd':
            // 修改密码
            this.handleOpen()
            // this.$message('修改密码');
            break
          case 'logout':
            // 退出系统
            this.handleLogout()
            break
        }
      },
      /** 退出系统 */
      handleLogout() {
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
              // duration: 500 // 悬停 500ms
            })
            // 3.跳转到登录页
            this.$router.push('/login')
          }
        })
      },
      handleOpen() {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['passwordForm'].resetFields()
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate( (valid) => {
          if (valid) {
            passwordApi.updatePassword(this.user.id, this.passwordForm.newPassword).then(response => {
              let resp = response.data
              if(resp.flag) {
                // 修改成功，退出登录
                this.dialogFormVisible = false
                this.$message.success(resp.message)
                this.handleLogout()
              } else {
                // 修改失败，弹出警告
                this.$message.warning(resp.message)
              }
            })
          } else {
            this.$message.warning('密码验证失败')
          }
        })

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
