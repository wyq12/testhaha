<template>
  <div class="body" id="body">
    <mt-cell title="授权人" class="row">
      <span>{{$store.state.resUser.trueName}}</span>
      <img slot="icon" src="../../static/images/user_icon.png" class="icon">
    </mt-cell>

    <mt-cell title="房  址" class="row" id="address">
      <span class="addr-text">{{visitor.resHomeAddr}}</span>
      <img slot="icon" src="../../static/images/address_icon.png" class="icon">
    </mt-cell>

    <div style="width: 100%; height:10px;"></div>

    <mt-cell title="创建时间" :value="visitor.createTime" class="row"></mt-cell>
    <mt-cell title="访客姓名" :value="visitor.visitorName" class="row"></mt-cell>
    <mt-cell title="访客性别" :value="visitor.sexText" class="row"></mt-cell>
    <mt-cell title="手机号码" :value="visitor.mphone" class="row"></mt-cell>
    <mt-cell title="访客类型" :value="visitor.visitorTypeText" class="row"></mt-cell>
    <mt-cell title="证件类型" :value="visitor.idcardTypeText" class="row"></mt-cell>
    <mt-cell title="证件号码" :value="visitor.idcardNumb" class="row"></mt-cell>
    <mt-cell title="到访原因" :value="visitor.visitRemark" class="row"></mt-cell>
    <mt-cell
      title="有效时长"
      :value="visitor.expectVisitTime +' ~ ' + visitor.expectVisitTime"
      class="row"
    ></mt-cell>

    <mt-cell title="通行证" class="row" value="通行证已失效" v-if="!passImg.isUse"></mt-cell>

    <div v-if="passImg.isUse">
      <mt-cell title="通行证" class="row" is-link @click.native="switchImg">
        <span>{{passImg.visible ? '点击收起' : '点击展开'}}</span>
      </mt-cell>

      <div v-show="passImg.visible">
        <QRCode style="padding:10px;" :src="codeImgSrc" :timeStr="qrCodeTimeStr"></QRCode>
        <div class="send-tip">
          <img src="../../static/images/longTouch.png">
          <span>长按二维码图片发送给朋友</span>
        </div>
      </div>
    </div>

    <div style="margin:10px;">
      <mt-button type="primary" size="large" @click.native="back">返 回</mt-button>
    </div>

    <!-- <div class="cell">
      <div class="left">
        <div>左边文字字</div>
      </div>
      <div class="right">右边文字右边文字右边文字右边文字右边文字右边文字右边文字右边文字右边文字</div>
    </div>-->
  </div>
</template>

<script>

import { Cell, Switch, Toast, Indicator } from "mint-ui"
import { queryVisitDetail, getQRCode } from '@/api/visitDetail'
import QRCode from '@/components/QRCode'
export default {
  components: {
    QRCode: QRCode
  },

  computed: {

  },

  data() {
    return {

      passImg: {
        isUse: true,
        visible: false,
        src: '',
        name: 'repairSuccess.png' // 需改成远程链接
      },
      visitor: {},
      qrCodeTimeStr: '',
      codeImgSrc: {}

    }
  },

  created() {
    this.passImg.src = '../../static/images/' + this.passImg.name
  },

  mounted() {
    this.getDetail()
  },

  methods: {

    isPassPermitUse(outDate) {
      console.log(new Date())
      console.log(outDate)
      if (new Date() >= outDate) {
        this.passImg.isUse = false
        console.log('通行证已过期')
      } else {
        this.getCodeImg()
      }
    },

    switchImg() {
      this.passImg.visible = !this.passImg.visible
      this.$nextTick(() => {
        document.getElementById('body').scrollIntoView(false) // true = top; false = bottom
      })
    },

    getDetail() {
      let param = {
        itemId: this.$route.params.itemId
      }
      queryVisitDetail(param).then(response => {
        console.log(response.data)
        const res = response.data.data
        this.visitor = res.visitorApply
        let obj = res.sexDict.find(item => item.id === this.visitor.sex)
        this.visitor.sexText = obj ? obj.text : ''
        obj = res.visType.find(item => item.id === this.visitor.visitorType)
        this.visitor.visitorTypeText = obj ? obj.text : ''
        obj = res.idcardType.find(item => item.id === this.visitor.idcardType)
        this.visitor.idcardTypeText = obj ? obj.text : ''

        let vt = parseInt(this.visitor.expectVisitTime.replace(/-/g, '').replace(/:/g, '').replace(/ /g, ''))
        let lt = parseInt(this.visitor.expectLeaveTime.replace(/-/g, '').replace(/:/g, '').replace(/ /g, ''))
        let year = parseInt(this.visitor.createTime.substr(0, 4))
        this.visitor.stratTime = year + '-' + this.visitor.expectVisitTime
        if (vt < lt) {
          this.visitor.endTime = year + '-' + this.visitor.expectLeaveTime
        } else {
          this.visitor.endTime = (year + 1) + '-' + this.visitor.expectLeaveTime
        }
        this.qrCodeTimeStr = `有效时长：${this.visitor.stratTime} ~ ${this.visitor.endTime}`

        this.isPassPermitUse(new Date(this.visitor.endTime))

      }).catch(err => console.log(err))
    },

    /**
     * 获取二维码图片 BASE64
     */
    getCodeImg() {
      const params = {
        applyId: this.$route.params.itemId,
        resCode: this.$route.params.resCode
      }
      getQRCode(params).then(res => {
        if (res.data.data) {
          this.codeImgSrc = 'data:image/png;base64,' + res.data.data // 后端返回值没有前缀，需要自己加！
        } else {
          this.passImg.isUse = false
        }
      }).catch(err => console.log(err))
    },

    createTimeStr() {
      // return `有效时长：2019-03-26 20:19 ~ 2019-03-27 21:00`
      return `有效时长：${this.$route.params.startTime} ~ ${this.$route.params.endTime}`
    },

    back() {
      this.$router.go(-1)
    },

  }
}
</script>

<style lang="less" scoped>
@import "../assets/less/lib-rem";

.cell {
  padding: 12px 10px;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #dcdfe6;

  .left {
    & > div {
      min-width: 64px;
      white-space: nowrap;
    }
    margin-right: 10px;
    color: #303133;
  }
  .right {
    color: #606266;
  }
}

#address {
  white-space: nowrap;
  .addr-text {
    margin-left: 1rem;
    white-space: pre-wrap;
  }
}

// mint UI 组件蓝： #26A2FF rgba(38,162,255)

.body {
  background-color: #f5f9fc;
  // padding: 0 5px;
}

.icon {
  width: 24px;
  height: 24px;
}

// 行
.row {
  border-bottom: 1px solid #eeeeee;
  padding: 0 5px;
  .mint-cell-wrapper {
    justify-content: flex-start;
  }

  & > .mint-cell-wrapper > .mint-cell-title {
    flex: none;
    width: 5rem;
  }
}

.button-mini {
  height: 28px;
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



    <!-- createTime:"2019-04-02 15:27"
createUser:""
expectLeaveTime:"04-03 16:37"
expectVisitTime:"04-02 15:27"
id:"DCF2812CC0A856CE2240F3A6102F1EFF"
idcardNumb:""
idcardType:"1"
mphone:"13322223333"
pkid:""
pptUserId:""
pptUserMphone:""
pptUserName:""
resCode:"禹洲华侨海景城"
resHomeAddr:"禹洲华侨海景城澳门楼5单元11楼1103室"
resTrueName:"翁盛盛"
resUserId:"5535D26AC0A856CE253EBD1F4CD665C8"
resUserMphone:"15980183046"
resUserName:"翁盛盛"
sex:"M"
visitRemark:""
visitorName:"欧阳修"
    visitorType:"1"-->