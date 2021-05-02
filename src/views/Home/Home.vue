<template>
  <div id="admin-home">
    <el-header>
      <el-menu default-active="/adminHome" class="el-menu-demo" mode="horizontal" router="true">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/search">搜索</el-menu-item>
        <el-menu-item index="/adminHome">管理中心</el-menu-item>
        <el-menu-item index="/user">个人中心</el-menu-item>
      </el-menu>
    </el-header>
    <div class="content">
      <el-tabs v-model="tabActive">
        <el-tab-pane label="账号管理" name="first">
          <div class="item-reg">
            <el-table :data="userList" style="width: 100%">
              <el-table-column prop="lastLoginTime" label="最后登入日期" width></el-table-column>
              <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
              <el-table-column prop="userEmail" label="邮箱" width="180"></el-table-column>
              <el-table-column prop="userNo" label="编号" width=""></el-table-column>
              <el-table-column prop="isBan" label="账号状态" width="180">
                <div slot-scope="scope">
                  <div v-if="scope.row.isBan === 0">正常</div>
                  <div v-else>封禁</div>
                </div>
              </el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="banUser(scope.row.userNo)" v-show="scope.row.isBan===0">封禁
                  </el-button>
                  <el-button type="success" @click="unBanUser(scope.row.userNo)" v-show="scope.row.isBan===1">解封
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!--        管理所有商品  可筛选-->
        <el-tab-pane label="商品管理" name="second">
          <div class="item-audit">
            <el-table :data="commList" style="width: 100%" height="90vh" stripe
                      :default-sort="{prop: 'commodity.commName', order: 'increasing'}">
              <el-table-column label="图片" width="120">
                <template slot-scope="scope">
                  <el-image :src="scope.row.commPicList[0]" fit='cover' :preview-src-list="scope.row.commPicList"
                            style="width: 70px;height: 70px"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="commName" label="名称" sortable></el-table-column>
              <el-table-column prop="commNo" label="单号"></el-table-column>
              <el-table-column prop="commDesc" label="简述"></el-table-column>
              <el-table-column prop="userName" label="创建者" width="180" sortable></el-table-column>
              <el-table-column prop="auditStatus" label="审核状态" sortable
                               :filters="[{text: '待审核', value: 0},{text: '审核通过', value: 1},{text: '驳回', value: 2}]"
                               :filter-method="filterHandler">
                <div slot-scope="scope">
                  <div v-if="scope.row.auditStatus === 0">待审核</div>
                  <div v-else-if="scope.row.auditStatus === 1">审核通过</div>
                  <div v-else>驳回</div>
                </div>
              </el-table-column>
              <el-table-column label="商品操作" width="300">
                <template slot-scope="scope">
                  <el-button type="primary" @click="checkCommo(scope.row.commNo)" size="small">查看
                  </el-button>
                  <el-button type="primary" @click="allowCommo(scope.row.commNo)" size="small"
                             v-show="scope.row.auditStatus===0||scope.row.auditStatus===2">通过
                  </el-button>
                  <el-button type="danger" @click="refuseCommo(scope.row.commNo)" size="small"
                             v-show="scope.row.auditStatus===0||scope.row.auditStatus===1">拒绝
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!--        学院信息审核-->
        <el-tab-pane label="认证审核" name="third">
          <div class="item-reg">
            <el-table :data="userList" style="width: 100%">
              <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
              <el-table-column label="学生证照片">
                <template slot-scope="scope">
                  <el-image :src="scope.row.photoUrl" fit='cover' :preview-src-list="scope.row.photoUrl"
                            style="width: 70px;height: 70px">
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="userRealName" label="真实姓名" width="180"></el-table-column>
              <el-table-column prop="college" label="学院" width=""></el-table-column>
              <el-table-column prop="sno" label="学号" width=""></el-table-column>
              <el-table-column prop="authentication" label="认证状态" width="">
                <div slot-scope="scope">
                  <div v-if="scope.row.authentication === 0">未认证</div>
                  <div v-else-if="scope.row.authentication === 1">认证中</div>
                  <div v-else-if="scope.row.authentication === 2">审核通过</div>
                  <div v-else>认证失败</div>
                </div>
              </el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="success" @click="changeAuthentication(scope.row.userNo,2)" v-if="scope.row.authentication!==2&&scope.row.authentication!==0">
                    通过
                  </el-button>
                  <el-button type="danger" @click="changeAuthentication(scope.row.userNo,3)"
                             v-if="scope.row.authentication===2">驳回
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  comments: {},
  data() {
    return {
      userName: '',
      tabActive: 'first',
      allUsers: [],
      auditCommos: [],
      userList: [],
      commList: [],
      token: this.$store.state.token,
      auditMsg: '',
      activeIndex: '/adminHome'
    }
  },
  methods: {
    //审核通过
    allowCommo(commNo) {
      this.$axios.post('/shop/admin/auditComm', this.$qs.stringify({
            auditStatus: 1,
            auditor: this.userName,
            commNo: commNo
          }), {
            headers: {
              Authorization: this.token
            }
          }
      ).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
        this.getCommList()
      }).catch(function (error) {
        console.log(error)
      })
    },
    //拒绝发布
    refuseCommo(commNo) {
      this.$prompt('拒绝原因:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '内容不得为空',
        inputPlaceholder: '请输入拒绝原因，不得为空'
      }).then(({value}) => {
        this.auditMsg = value
        console.log(this.auditMsg)
        this.$axios.post('/shop/admin/auditComm', this.$qs.stringify({
          auditMsg: this.auditMsg,
          auditStatus: 2,
          auditor: this.userName,
          commNo: commNo
        }), {
          headers: {
            Authorization: this.token
          }
        }).then(resp => {
          var data = resp.data
          if (data.code === 1) {
            this.$notify({
              title: '成功',
              message: '处理完成',
              type: 'success'
            })
            this.auditMsg = ''
            this.getCommList()
          }
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          type: 'info',
          message: '取消输入'
        });
      });
    },
    banUser(userNo) {
      console.log(userNo)
      this.$axios.post('/shop/admin/setUserIsBan', this.$qs.stringify({
        isBan: 1,
        userNo: userNo
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
        this.getUserList()
      })
    },
    unBanUser(userNo) {
      console.log(userNo)
      this.$axios.post('/shop/admin/setUserIsBan', this.$qs.stringify({
        isBan: 0,
        userNo: userNo
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
      })
      this.getUserList()
    },
    changeAuthentication(userNo, authentication) {
      this.$axios.post('/shop/admin/auditUserAuthentication', this.$qs.stringify({
        authentication: authentication,
        userNo: userNo
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '处理完成',
            type: 'success'
          })
        }
      })
      this.getUserList()
    },
    //  获取数据
    initDate() {
      this.getUserList()
      this.getCommList()
    },
    //用户列表
    getUserList() {
      this.$axios.post('/shop/admin/userList', {}, {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.userList = data.obj
          for (let i = 0; i < this.userList.length; i++) {
            this.userList[i].lastLoginTime = this.rTime(this.userList[i].lastLoginTime);
          }
        }
      })
    },
    getCommList() {
      //  商品列表
      this.$axios.get('/shop/admin/commList', {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        console.log(resp)
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj
        }
      })
    },
    //  待审核商品筛选器
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    //  数据格式化
    rTime: function (date) {
      var date1 = new Date(date).toJSON();
      return new Date(+new Date(date1) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    //  查看商品详情
    checkCommo(commNo) {

      this.$store.commit('GET_COMM', commNo)
      this.$router.push({path: '/check'})
    },
    //  返回个人主页
    goBack() {
      this.$router.push({path: '/user'})
    },
  },
  mounted() {
    this.token = this.$store.state.token
    console.log(this.token)
    this.$nextTick(function () {
      if (this.token === '') {
        this.$message({
          message: '用户未登录！即将返回登录页面',
          type: 'error'
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$router.push({path: '/login'});
        }, 1500);
      }
      this.initDate()
    })
  }
}
</script>
<style lang="scss" scoped>
#admin-home {
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;

  .content {
    background-color: white;
    width: 90%;
    margin: 30px auto;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 10px 5px 30px #99a9bf;
  }
}
</style>
