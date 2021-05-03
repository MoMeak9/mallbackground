<template>

  <div id="login">
    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">转小二后台管理系统</h3>
      <el-form-item style="user-select: none;">
        <el-input type="text" v-model="userEmail" placeholder="请输入账号..."></el-input>
      </el-form-item>

      <el-form-item style="user-select: none;">
        <el-input show-password v-model="password" placeholder="请输入密码..."></el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" class="button-login" @click="login()">登录
        </el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
      </el-form-item>
    </el-form>

  </div>

</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      userEmail: '',
      password: ''
    }
  },
  mounted() {
  },
  methods: {
    login() {
      if (this.email === '' || this.password === '') {
        this.$notify.error({
          title: '错误',
          message: '请填写相应的邮箱和密码后登入！',
          type: 'error'
        })
      } else {
        this.$axios.post('/shop/user/login', this.$qs.stringify({
          userEmail: this.userEmail,
          userPassword: this.password,
        })).then((resp) => {
          const data = resp.data
          if (data.code === 1) {
            if (data.obj.userBean.isBan === 1) {
              this.$notify({
                title: 'Error',
                message: '账户被封禁',
                type: 'error'
              })
            } else {
              //用户数据
              this.$store.commit('SET_TOKEN', data.obj.token)
              this.$store.commit('GET_USER', data.obj.userBean)
              console.log(this.$store.state.token)
              console.log(this.$store.state.user)
              this.$notify({
                title: '登入成功',
                message: '欢迎您，管理员',
                type: 'success'
              })
              this.$router.push({path: '/home'})
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户名或密码错误！'
            })
          }
        })
      }
    },
  }
}
</script>

<style scoped>
#login {
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: scroll;
  z-index: -1;
}

.login-container {
  border-radius: 10px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 3;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #f3f9f1;
  user-select: none;
}

.button-login {
  width: 100%;
  background: rgb(61, 226, 226);
  border: 2px solid #3db8ab;
}

.button-login:hover {
  width: 100%;
  background: rgb(45, 123, 96);
  border: 2px solid #40e0d0;
  box-shadow: 0 0 25px rgba(64, 224, 208, .5);
}
</style>
