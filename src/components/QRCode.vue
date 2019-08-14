<template>
  <div class="body">
    <canvas id="qr" v-show="false"></canvas>
    <canvas id="myCanvas" v-show="false"></canvas>
    <!-- <img :src="src" alt="1" style="border: 1px solid red"> -->
    <!-- {{src}} -->
    <img :src="imgSrc">
  </div>
</template>
<script>

import QRious from 'qrious'
export default {
  props: {
    src: {
      default: ''
    },
    timeStr: {
      type: String
    }
  },

  data() {
    return {
      imgSrc: '',
      size: 200,
      // qrCodeData: '内容哈哈哈哈哈哈xcwgqrg56r1g56q1g6r5g1r5e563',

      password: '666666(密码)',
      canvasSize: { w: 400, h: 400 } // 整个画布的宽高
    }
  },

  created() {


  },

  watch: {
    src(newValue, oldValue) {
      let src = newValue
      this.drawAll(src)
    }
  },

  mounted() {

  },

  methods: {

    drawAll(qrImgSrc) {
      // console.log('drawAll')
      // console.log(qrImgSrc)
      // console.log('drawAll')

      // 基础配置
      const canvas = document.getElementById("myCanvas")
      const cv = this.canvasSize
      canvas.width = cv.w
      canvas.height = cv.h
      let ctx = canvas.getContext("2d")

      // 背景
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cv.w, cv.h)

      // 二维码部分
      let qr = {
        x: (cv.w - this.size) / 2,
        y: 90,
        w: this.size,
        h: this.size
      }
      const padding = 2
      let qrBorder = {
        x: qr.x - padding,
        y: qr.y - padding,
        w: qr.w + padding * 2,
        h: qr.h + padding * 2
      }

      ctx.shadowBlur = 10
      ctx.shadowColor = "black"
      ctx.fillRect(qrBorder.x, qrBorder.y, qrBorder.w, qrBorder.h)

      ctx.shadowBlur = 3
      ctx.fillRect(0, 320, cv.w, cv.h - 320)
      ctx.shadowBlur = 0

      // 文字部分
      ctx.fillStyle = "#000000"
      ctx.font = "small-caps 500 20px arial"
      ctx.fillText("通行码：", 20, 32)

      ctx.textAlign = "center"
      ctx.fillStyle = "#606266";
      ctx.fillText(this.password, cv.w / 2, 60)

      ctx.font = "small-caps bold 16px arial"
      ctx.fillText("进入园区时，请将二维码对着门禁机（手机）扫码", cv.w / 2, 350)
      ctx.fillStyle = "#000000";
      ctx.fillText(this.timeStr, cv.w / 2, 380)

      // 外边框
      ctx.strokeRect(0, 0, cv.w, cv.h)

      // 二维码图片
      let img = new Image()
      img.src = qrImgSrc
      img.onload = () => {
        // console.log('img.onload')
        ctx.drawImage(img, qr.x, qr.y, this.size, this.size)
        this.imgSrc = canvas.toDataURL("image/png")
        // this.$nextTick(()=>{
        //   this.$emit()
        // })
        // console.log(this.imgSrc)
      }

    },


    qrCodeImgSrc(data) {
      if (!data) {
        console.log('数据为空')
        return
      }
      if (data.length > 100) {
        return data
      }
      return this.qr(data).toDataURL("image/png")
    },

    /**
     * 字符串生成二维码
     * @param str [string] 生成二维码的内容
     */
    qr(str) {
      let qr = new QRious({
        element: document.getElementById('qr'),
        size: this.size,
        value: str
      })
      return qr
    }
  }

  // https://github.com/neocotic/qrious

  /* API
  Field	            Type	    Description	                                         Default	      Read Only
  _________________________________________________________________________________________________________
  background	      String	  Background color of the QR code	                     "white"	      No
  backgroundAlpha	  Number	  Background alpha of the QR code	                     1.0	          No
  element	          Element	  Element to render the QR code	                       <canvas>	      Yes
  foreground	      String	  Foreground color of the QR code	                     "black"	      No
  foregroundAlpha	  Number	  Foreground alpha of the QR code	                     1.0	          No
  level	            String	  Error correction level of the QR code (L, M, Q, H)   "L"	          No
  mime	            String	  MIME type used to render the image for the QR code	 "image/png"	  No
  padding	          Number	  Padding for the QR code (pixels)	                   null (auto)	  No
  size	            Number	  Size of the QR code (pixels)	                       100	          No
  value	            String	  Value encoded within the QR code	                   ""	            No
  */


}
</script>
<style lang="less" scoped>
</style>


