<template>
  <div class="body">
    <div class="top">
      <div>{{communityName}}</div>
    </div>
    <QRCode style="padding:10px;" :src="codeImgSrc" :timeStr="createTimeStr()"></QRCode>

    <div class="send-tip">
      <img src="../../static/images/longTouch.png">
      <span>长按二维码图片发送给朋友</span>
    </div>

    <!-- <share :option="shareOption"></share> -->

    <div class="btn-box">
      <mt-button type="primary" plain size="small" @click="back">继续申请</mt-button>
      <mt-button type="primary" size="small" @click="toVisitRecord">查看列表</mt-button>
    </div>
  </div>
</template>
<script>

import QRCode from '@/components/QRCode'
// import share from '@/components/share'
import { getQRCode } from '@/api/passPermit'
import { Toast, Button } from 'mint-ui'

export default {
  components: {
    QRCode: QRCode,
    // share: share
  },

  props: {

  },

  data() {
    return {
      communityName: '',
      codeImgSrc: '',
      shareOption: {}
    }
  },

  created() {
    // this.shareOption = this.setOption()
    this.communityName = this.$route.params.resName
  },

  mounted() {
    console.log(this.$route.params)
    this.getCodeImg()
  },

  methods: {

    createTimeStr() {
      // return `有效时长：2019-03-26 20:19 ~ 2019-03-27 21:00`
      return `有效时长：${this.$route.params.startTime} ~ ${this.$route.params.endTime}`
    },

    /**
     * 获取二维码图片 BASE64
     */
    getCodeImg() {
      const params = {
        applyId: this.$route.params.applyId,
        resCode: this.$route.params.resCode
      }
      getQRCode(params)
        .then(res => {
          this.codeImgSrc = 'data:image/png;base64,' + res.data.data // 后端返回值没有前缀，需要自己加！
          // console.log(this.codeImgSrc)
        })
        .catch(err => console.log(err))
    },

    back() {
      this.$router.go(-1)
    },

    toVisitRecord() {
      this.$router.push({ name: 'visitRecord' })
    }

  }
}

</script>
<style lang="less" scoped>
.top {
  padding: 20px 50px;
  div {
    border: 1px solid #000000;
    padding: 10px;
    text-align: center;
    font-size: 18px;
  }
}
.btn-box {
  padding: 10px;
  text-align: right;
  & > button {
    margin-right: 5px;
  }
}
.icon-success {
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 50%;
  background-size: 100%;
  background-image: url(../../static/images/success.png);
}

.send-tip {
  text-align: center;
  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  span {
    font-size: 16px;
  }
}
</style>


