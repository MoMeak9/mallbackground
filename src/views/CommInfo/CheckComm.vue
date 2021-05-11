<template>
  <div id="check">
    <el-page-header @back="goBack()" content="商品详情">
    </el-page-header>
    <div class="information">
      <el-carousel indicator-position="outside" height="30rem">
        <el-carousel-item v-for="item in obj.commPicList" :key="item">
          <el-image :src=item fit="cover" class="banner-img"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div class="data-content">
        <el-divider><i class="el-icon-tickets"></i>基本信息</el-divider>
        <div class="text-data">
          商品编号：{{ obj.commodity.commNo }}
        </div>
        <div class="text-data">
          商品名称：{{ obj.commodity.commName }}
        </div>
        <div class="text-data">
          商品描述：{{ obj.commodity.commDesc }}
        </div>
        <div class="text-data">
          创建时间：{{ obj.commodity.createTime }}
        </div>
        <el-divider><i class="el-icon-shopping-cart-full"></i>销售情况</el-divider>
        <div class="text-data">
          商品类型：{{ obj.commodity.commTag }}
        </div>
        <div class="text-data">
          商品价格：{{ obj.commodity.commPrice }}
        </div>
        <div class="text-data">
          商品销售：{{ obj.commodity.commSale }}
        </div>
        <div class="text-data">
          商品库存：{{ obj.commodity.commStock }}
        </div>
        <div class="text-data">
          商品总量：{{ obj.commodity.commStock + obj.commodity.commSale }}
        </div>
        <el-divider><i class="el-icon-edit-outline
"></i>审核情况
        </el-divider>
        <div class="text-data">
          审核状态：{{ obj.commodity.auditStatus }}
        </div>
        <div class="text-data">
          审核人员：{{ obj.commodity.auditor }}
        </div>
        <div class="text-data">
          审核时间：{{ obj.commodity.auditTime }}
        </div>
        <div class="text-data">
          退回反馈：{{ obj.commodity.auditMsg }}
        </div>
        <div v-if="userBean.userRoot===1">
          <el-button type="danger" @click="setCommRec(1)" v-if="obj.commodity.recommend===0">推荐商品</el-button>
          <el-button type="danger" @click="setCommRec(0)" v-if="obj.commodity.recommend===1">停止推荐商品</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckComm",
  data() {
    return {
      commNo: '',
      token: '',
      obj: {},
      userBean: ''
    }
  },
  methods: {
    initDate() {
      this.$axios.get('/shop/commodity/queryCommByNo', {
        params: {
          commNo: this.commNo,
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.obj = data.obj
          console.log(this.obj)
          this.obj.commodity.createTime = this.rTime(this.obj.commodity.createTime)
          this.obj.commodity.auditTime = this.rTime(this.obj.commodity.auditTime)
          this.obj.commodity.auditStatus = this.rAuditStatus(this.obj.commodity.auditStatus)
          this.obj.commodity.commTag = this.rCommTag(this.obj.commodity.commTag)
        }
      })
    },
    rTime(date) {
      if (date === null || date === '') {
        return null
      }
      var date1 = new Date(date).toJSON();
      return new Date(+new Date(date1) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    rAuditStatus(data) {
      if (data === 0) {
        return "待审核"
      } else if (data === 1) {
        return "审核通过"
      } else {
        return "审核拒绝"
      }
    },
    rCommTag(data) {
      if (data === 0) {
        return "衣物"
      } else if (data === 1) {
        return "数码"
      } else if (data === 2) {
        return "食品"
      } else if (data === 3) {
        return "图书"
      } else if (data === 4) {
        return "化妆品"
      } else if (data === 5) {
        return "文具"
      } else {
        return "居家"
      }
    },
    goBack() {
      this.$router.go(-1)
      this.$store.state.DEL_COMM()
      console.log('go back');
    },
    setCommRec(recommend) {
      this.$axios.post('/shop/admin/setCommRec', this.$qs.stringify({
        commNo: this.commNo,
        recommend: recommend,
      }), {
        headers: {
          Authorization: this.token,
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify.success({
            title: '成功',
            message: '已设置推荐',
          })
        }
      })
    }
  },
  mounted() {
    this.userBean = this.$store.state.userBean
    this.token = this.$store.state.token
    this.commNo = this.$store.state.commNo
    this.$nextTick(function () {
      this.initDate()
    })
  }
}
</script>

<style lang="scss">
#check {
  background-color: #f5f5f5;
  padding: 1rem;

  .information {
    width: 45rem;
    margin: 1rem auto;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 10px 5px 30px #99a9bf;
    background: white;

    .data-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 60%;

      .text-data {
        text-align: left;
        margin: 10px;
      }
    }
  }
}
</style>
