<template>
  <div id="admin-home">
    <aside style="z-index: 99;position: absolute">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo"
               :collapse="isCollapse">
        <el-menu-item index="1" @click="isCollapse=!isCollapse">
          <i class="el-icon-caret-right" v-if="isCollapse"></i><i class="el-icon-caret-left" v-else></i>
          <span slot="title"><a v-if="isCollapse">展开</a><a v-else>关闭</a></span>
        </el-menu-item>
        <el-menu-item index="3" @click="tabActive='2'">
          <i class="el-icon-s-custom"></i>
          <span slot="title">账号管理</span>
        </el-menu-item>
        <el-submenu index="4" @click="tabActive='3'">
          <template slot="title">
            <i class="el-icon-s-shop"></i>
            <span slot="title">商品管理</span>
          </template>
          <el-menu-item index="1-1" @click="filterHandler('')">所有商品</el-menu-item>
          <el-menu-item index="1-2" @click="filterHandler(0)">待审核的</el-menu-item>
          <el-menu-item index="1-3" @click="filterHandler(1)">审核通过</el-menu-item>
          <el-menu-item index="1-4" @click="filterHandler(2)">被驳回的</el-menu-item>
        </el-submenu>
        <el-menu-item index="5" @click="tabActive='4'">
          <i class="el-icon-s-claim"></i>
          <span slot="title">用户审核</span>
        </el-menu-item>
        <el-menu-item index="6" @click="back">
          <i class="el-icon-close"></i>
          <span slot="title">返回</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <div class="content">
      <header><h1>管理中心</h1></header>
      <el-tabs v-model="tabActive">
        <el-tab-pane label="账号管理" name="2">
          <div class="item-reg">
            <el-table :data="userList" style="width: 100%">
              <el-table-column prop="userBean.lastLoginTime" label="最后登入日期" width></el-table-column>
              <el-table-column prop="userBean.userName" label="用户名" width="180"></el-table-column>
              <el-table-column prop="userBean.userEmail" label="邮箱" width="180"></el-table-column>
              <el-table-column prop="userBean.userNo" label="UUID" width=""></el-table-column>
              <el-table-column prop="userBean.isBan" label="账号状态" width="180">
                <div slot-scope="scope">
                  <div v-if="scope.row.userBean.isBan === 0">正常</div>
                  <div v-else>封禁</div>
                </div>
              </el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="banUser(scope.row.userBean.userNo)"
                             v-show="scope.row.userBean.isBan===0">封禁
                  </el-button>
                  <el-button type="success" @click="unBanUser(scope.row.userBean.userNo)"
                             v-show="scope.row.userBean.isBan===1">解封
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                @current-change="changeUserList()"
                background
                :current-page="userListCurrent"
                :pager-count="11"
                layout="prev, pager, next"
                :page-count="userListPages">
            </el-pagination>
          </div>
        </el-tab-pane>
        <!--        管理所有商品  可筛选-->
        <el-tab-pane label="商品管理" name="3">
          <div class="item-audit">
            <el-table :data="commList" stripe
                      :default-sort="{prop: 'commodity.commName', order: 'increasing'}">
              <el-table-column label="图片" width="120">
                <template slot-scope="scope">
                  <el-image :src="scope.row.commPicList[0]" fit='cover' :preview-src-list="scope.row.commPicList"
                            style="width: 70px;height: 70px"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="commodity.commName" label="名称" sortable></el-table-column>
              <el-table-column prop="commodity.commNo" label="商品编码"></el-table-column>
              <el-table-column prop="commodity.commDesc" label="简述"></el-table-column>
              <el-table-column prop="commodity.userName" label="创建者" width="180" sortable></el-table-column>
              <el-table-column prop="commodity.auditStatus" label="审核状态" sortable>
                <div slot-scope="scope">
                  <div v-if="scope.row.commodity.auditStatus === 0">待审核</div>
                  <div v-else-if="scope.row.commodity.auditStatus === 1">审核通过</div>
                  <div v-else>驳回</div>
                </div>
              </el-table-column>
              <el-table-column label="商品操作" width="300">
                <template slot-scope="scope">
                  <el-button type="primary" @click="checkCommo(scope.row.commodity.commNo)" size="small">查看
                  </el-button>
                  <el-button type="primary" @click="allowCommo(scope.row.commodity.commNo)" size="small"
                             v-show="scope.row.commodity.auditStatus===0||scope.row.auditStatus===2">通过
                  </el-button>
                  <el-button type="danger" @click="refuseCommo(scope.row.commodity.commNo)" size="small"
                             v-show="scope.row.commodity.auditStatus===0||scope.row.commodity.auditStatus===1">拒绝
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                @current-change="changeCommList"
                background
                :current-page="commListCurrent"
                :pager-count="11"
                layout="prev, pager, next"
                :page-count="commListPages">
            </el-pagination>
          </div>
        </el-tab-pane>
        <!--        学院信息审核-->
        <el-tab-pane label="认证审核" name="4">
          <div class="item-reg">
            <el-table :data="userList" style="width: 100%">
              <el-table-column prop="userBean.userName" label="用户名" width="180"></el-table-column>
              <el-table-column label="学生证照片">
                <template slot-scope="scope">
                  <el-image :src="scope.row.photoList[1]" fit='cover' :preview-src-list="scope.row.photoList"
                            style="width: 70px;height: 70px">
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="userBean.userRealName" label="真实姓名" width="180"></el-table-column>
              <el-table-column prop="userBean.college" label="学院" width=""></el-table-column>
              <el-table-column prop="userBean.sno" label="学号" width=""></el-table-column>
              <el-table-column prop="userBean.authentication" label="认证状态" width="">
                <div slot-scope="scope">
                  <div v-if="scope.row.userBean.authentication === 0">未认证</div>
                  <div v-else-if="scope.row.userBean.authentication === 1">认证中</div>
                  <div v-else-if="scope.row.userBean.authentication === 2">审核通过</div>
                  <div v-else>认证失败</div>
                </div>
              </el-table-column>
              <el-table-column label="账号操作">
                <template slot-scope="scope">
                  <el-button type="success" @click="changeAuthentication(scope.row.userBean.userNo,2)"
                             v-if="scope.row.userBean.authentication!==2&&scope.row.userBean.authentication!==0">
                    通过
                  </el-button>
                  <el-button type="danger" @click="changeAuthentication(scope.row.userBean.userNo,3)"
                             v-if="scope.row.userBean.authentication===2">驳回
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                @current-change="changeUserList()"
                background
                :current-page="userListCurrent"
                :pager-count="11"
                layout="prev, pager, next"
                :page-count="userListPages">
            </el-pagination>
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
      isCollapse: true,
      userName: '',
      tabActive: '2',
      allUsers: [],
      auditCommos: [],
      userList: [],
      commList: [],
      token: '',
      userBean: '',
      auditMsg: '',
      activeIndex: '/adminHome',
      //分页
      tryCount: 1,
      auditStatus: '',
      userListCurrent: 1,
      userListPages: 1,
      commListCurrent: 1,
      commListPages: 1,
    }
  },
  components: {},
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
          this.getUserList()
        }
      })
    },
    //  获取数据
    initDate() {
      this.getUserList()
      this.getCommList()
    },
    //用户列表
    getUserList() {
      this.$axios.post('/shop/admin/userList', this.$qs.stringify({
        current: this.userListCurrent,
        size: '10'
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.userListPages = data.obj.pages
          this.userList = data.obj.obj
          for (let i = 0; i < this.userList.length; i++) {
            this.userList[i].userBean.lastLoginTime = this.rTime(this.userList[i].userBean.lastLoginTime);
          }
        }
      })
    },
    changeUserList(val) {
      this.$axios.post('/shop/admin/userList', this.$qs.stringify({
        current: val,
        size: '10'
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.userListPages = data.obj.pages
          this.userList = data.obj.obj
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
        },
        params: {
          auditStatus: this.auditStatus,
          current: 1,
          size: 10
        }
      }).then(resp => {
        console.log(resp)
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj.obj
          this.commListPages = data.obj.pages
        }
      })
    },
    changeCommList(val) {
      this.$axios.get('/shop/admin/commList', {
        headers: {
          Authorization: this.token
        },
        params: {
          auditStatus: this.auditStatus,
          current: val,
          size: 10
        }
      }).then(resp => {
        console.log(resp)
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj.obj
          this.commListPages = data.obj.pages
        }
      })
    },
    filterHandler(value) {

      this.auditStatus = value
      this.$axios.get('/shop/admin/commList', {
        headers: {
          Authorization: this.token
        },
        params: {
          auditStatus: this.auditStatus,
          current: 1,
          size: 10
        }
      }).then(resp => {
        console.log(resp)
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj.obj
          this.commListPages = data.obj.pages
        }
      })
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
    //登出
    back() {
      this.$notify({
        title: '成功',
        message: '返回个人中心',
        type: 'success'
      })
      this.$router.push({path: '/user'})
    }
  },
  mounted() {
    this.token = this.$store.state.token
    this.userBean = this.$store.state.userBean
    console.log(this.token)
    this.$nextTick(function () {
      if (this.token === '' || this.token === null) {
        this.$notify({
          title: '错误',
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

  .el-menu {
    height: 100vh;
  }

  .el-pagination {
    text-align: center;
    margin-top: 15px
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100vh;
  }

  .content {
    background-color: white;
    width: 90%;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 10px 5px 30px #99a9bf;
  }
}
</style>
