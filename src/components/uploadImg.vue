<template>
  <div>
    <div class="img-box">
      <div class="single-img" v-for="(img, i) in localIds" :key="i">
        <img :src="img">
        <img class="delete" src="../../static/images/delects.png" @click="deleteImg(i)">
      </div>
      <div class="single-img" v-show="localIds.length < count" @click="showMask">
        <img src="../../static/images/addPhoto.png">
      </div>
    </div>

    <div class="mask" :style="{width:mask.w, height:mask.h}" @click="closeMask">
      <div class="tip-img">
        <img src="../../static/images/tishiGif.gif">
      </div>
      <div class="choose-source" style="text-align:center;">
        <div @click="chooseImg(0)">
          <img class="icon" src="../../static/images/album.png">
          <span class="text">相册</span>
        </div>
        <div @click="chooseImg(1)">
          <img class="icon" src="../../static/images/camera.png">
          <span class="text">拍照</span>
        </div>
      </div>
    </div>

    <!-- <div v-html="log"></div> -->
  </div>
</template>
<script>
import { Toast, MessageBox } from "mint-ui"
import wx from 'weixin-js-sdk'

export default {
  props: {
    // 上传数量
    count: {
      default: 1
    },
    // 图片来源 0:相册,1:相机,2:都行
    sourceType: {
      default: 2
    },

  },

  data() {
    return {
      // 图片列表
      localIds: [], // 所选择图片的本地ID列表
      serverIds: [],  // 上传到微信服务器后返回的ID列表
      isChoose: false,

      sourceVisible: false,
      mask: {
        w: '100vh',
        h: 0
      },

      // 图片来源选择列表
      sourceTypeList: [["album"], ["camera"], ["album", "camera"]],

      log: ``
    }
  },

  created() { },

  methods: {
    test() {
      console.log('uploadImg')
    },

    dataInit() {
      this.localIds = []
      this.serverIds = []
      this.isChoose = false
    },

    /**
     * 显示遮罩层
     */
    showMask() {
      this.mask = {
        w: '100vw',
        h: '100vh'
      }
      this.sourceVisible = true
    },

    /**
     * 关闭遮罩层
     */
    closeMask() {
      this.mask = {
        w: '100vw',
        h: 0
      }
      this.sourceVisible = false
    },

    /**
     * 删除图片
     */
    deleteImg(index) {
      MessageBox.confirm("确定要删除该图片?").then(action => {
        this.localIds.splice(index, 1)
        if (!this.localIds.length) {
          this.isChoose = false
        }
      })
    },

    /**
     * 选择图片
     */
    chooseImg(sourceType) {
      // Toast('选择图片')
      console.log(wx)
      this.log += `开始选择图片 <br/> `
      wx.ready(() => {
        // Toast('wx.ready')
        this.log += `wx.ready <br/> `
        wx.chooseImage({
          count: parseInt(this.count),
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: this.sourceTypeList[sourceType], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            this.localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            this.isChoose = true
            this.log += `success: ${res.errMsg} <br/> `
          },
          fail: res => {
            alert(JSON.stringify(res))
            this.log += `fail: ${res.errMsg} <br/> `
          },
          complete: res => {
            this.log += `complete: ${res.errMsg} <br/> `
          }
        })
      })
    },



    /**
     * 上传图片
     */
    doUpLoad() {

      if (!this.isChoose) {
        console.log('清先选择图片！')

        this.$emit('completed', {
          state: 0,
          msg: 'no choose'
        })
        return
      }

      console.log(`剩余图片数量： ${this.localIds.length}`)

      if (!this.localIds.length) {
        console.log('图片全部上传完成！')
        this.$emit('completed', {
          state: 1,
          msg: 'completed',
          serverIds: this.serverIds
        })
        return
      }

      wx.uploadImage({
        localId: this.localIds.shift(), // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: res => {
          this.serverIds.push(res.serverId) // 返回图片的服务器端ID
          console.log(res)
          this.doUpLoad()
        }
      })
    },


  }
};
</script>
<style lang="less" scoped>
.img-box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .single-img {
    position: relative;
    width: 80px;
    height: 80px;
    padding: 10px;
    img {
      width: 80px;
      height: 80px;
    }
    img.delete {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 13px;
      right: 13px;
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
    }
  }
}

.mask {
  z-index: 9999;
  position: fixed;
  bottom: 0;
  width: 100vh;
  height: 0;
  background-color: rgba(0, 0, 0, 0.7);
  transition: width 0.3s;
  transition: height 0.3s;
}
.tip-img {
  box-sizing: border-box;
  height: 40%;
  padding: 20px;
}
.choose-source {
  box-sizing: border-box;
  padding-top: 40px;
  width: 100%;
  height: 60%;
  position: relative;
  top: 80px;
  display: flex;
  justify-content: space-around;
  // align-items: center;
  .icon {
    width: 64px;
    height: 64px;
    padding: 5px;
    background-color: #ffffff;
    border: 1px solid #26a2ff;
    border-radius: 5px;
    box-shadow: rgba(38, 162, 255, 0.5) 2px 2px 2px;
  }
  .text {
    display: block;
    color: #ffffff;
  }
}
</style>


