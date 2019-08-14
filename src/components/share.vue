<template>
  <div class="body">
    <div class="top">
      <div class="line"></div>
      <div class="text">
        <span>将二维码通过以下方式分享给好友</span>
      </div>
    </div>
    <div class="btn-box">
      <div @click="share('qq')">
        <img class="icon" src="../../static/images/qq_share.png" alt="qq_share">
        <div>微信好友</div>
      </div>
      <div @click="share('wx')">
        <img class="icon" src="../../static/images/wx_share.png" alt="wx_share">
        <div>QQ好友</div>
      </div>
    </div>
  </div>
</template>

<script>

import wx from 'weixin-js-sdk'
export default {
  props: {
    option: {
      type: Object,
      default: {
        title: '', // 分享标题
        desc: '', // 分享描述
        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        trigger: res => {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          // alert('用户点击发送给朋友')
          console.log('分享开始')
        },
        success: res => {
          console.log('分享成功')
          // 用户点击了分享后执行的回调函数
        },
        cancel: res => {
          console.log('分享已取消')
          // alert('已取消')
        },
        fail: res => {
          console.log('分享失败')
          // alert(JSON.stringify(res))
        }
      }
    }
  },

  data() {
    return {

    }
  },

  watch: {
    option(newValue, oldValue) {
      this.option = newValue
    }
  },

  created() { },

  mounted() { },

  methods: {
    share(shareTo) {
      console.log('分享到' + shareTo)
      wx.ready(() => {   //需在用户可能点击分享按钮前就先调用
        if (shareTo == 'wx') {
          console.log(this.option)
          wx.onMenuShareAppMessage(this.option)
        } else if (shareTo == 'qq') {
          console.log(this.option)
          wx.onMenuShareQQ(this.option)
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
.body {
  padding: 15px 0;
  background-color: #f5f9fc;
}
.top {
  position: relative;
  .line {
    width: 100%;
    height: 1px;
    background-color: #666666;
    position: relative;
    top: 8px;
  }
  .text {
    position: relative;
    top: 0px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    span {
      padding: 0 10px;
      background-color: #f5f9fc;
      z-index: 2;
    }
  }
}
.btn-box {
  display: flex;
  justify-content: space-around;
  padding: 30px 20%;
  & > div {
    text-align: center;
    font-size: 16px;
    & > div {
      margin-top: 3px;
    }
  }
}
.icon {
  width: 50px;
  height: 50px;
}
</style>


