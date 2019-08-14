<template>
  <div class="body">
    <canvas id="qr" v-show="0"></canvas>
    <canvas id="myCanvas" v-show="0"></canvas>
    <!-- <img :src="qrCodeSrc" v-show="false" style="width:auto"> -->
    <!-- {{src}} -->
    <!-- <img :src="imgSrc" style="border:1px solid red;width:auto"> -->
    <button @click="start">开始生成</button>
    <div>
      <img
        v-for="(item,i) in resultList"
        :key="i"
        :src="item"
        style="border:1px solid red;width:auto"
      >
    </div>
  </div>
</template>
<script>

import QRious from 'qrious'
export default {
  props: {

  },

  data() {
    return {
      size: 260,
      canvasSize: { w: 260, h: 300 }, // 整个画布的宽高
      imgSrc: '',
      qrCodeSrc: '',
      url: 'xxxhttp://localhost:8080/#/productCode',
      codeList: ['1号楼A单元3层', '2号楼B单元4层', '3号楼C单元5层', '4号楼A单元3层', '5号楼B单元4层', '6号楼C单元5层', '7号楼A单元3层', '8号楼B单元4层', '9号楼C单元5层', '10号楼A单元3层', '11号楼B单元4层', '12号楼C单元5层'],
      resultList: []
    }
  },

  created() {

  },

  watch: {

  },

  mounted() {
    // this.product(this.url, this.codeList)
  },

  methods: {
    start() {
      this.product(this.url, this.codeList)
    },

    /**
     * 批量加工
     * @param {String} url 跳转地址
     * @param {Array} array 处理的房址列表
     */
    product(url, array) {
      console.log(array)
      array.forEach(element => {
        this.drawImg(url, element)
      })
      console.log(this.resultList)
    },

    upload() {

    },

    drawImg(url, content) {
      // 基础配置
      // const canvas = document.getElementById("myCanvas")
      const canvas = document.createElement('canvas')
      const cv = this.canvasSize
      canvas.width = cv.w
      canvas.height = cv.h
      let ctx = canvas.getContext("2d")

      // 文字部分
      ctx.fillStyle = "#000000"
      ctx.textAlign = "center"
      ctx.font = "small-caps 500 25px arial"
      ctx.fillText(content, 130, 283)

      // 二维码图片
      let img = new Image()
      img.src = this.qrCodeImgSrc(url + '?content=' + content)
      // this.qrCodeSrc = img.src
      // console.log(img.src)
      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.size, this.size)
        this.imgSrc = canvas.toDataURL("image/png")
        this.resultList.push(this.imgSrc)

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
.resul-box {
  display: flex;
  justify-content: space-around;
}
</style>


