<template>
  <div id="applyVisit">
    <mt-cell title="授权人" class="applyVisit-row">
      <span>{{$store.state.resUser.trueName}}</span>
      <img slot="icon" src="../../static/images/user_icon.png" class="applyVisit-icon">
    </mt-cell>

    <mt-cell title="房  址" class="applyVisit-row" is-link @click.native="showAddressPicker">
      <span class="applyVisit-address">{{address.label}}</span>
      <img slot="icon" src="../../static/images/address_icon.png" class="applyVisit-icon">
    </mt-cell>

    <mt-popup v-model="address.visible" position="bottom" closeOnClickModal style="width:100%">
      <mt-picker
        v-show="address.visible"
        :slots="address.list"
        value-key="label"
        showToolbar
        @change="addressChange"
      >
        <div class="applyVisit-picker-header">
          <mt-button type="default" size="small" class="button-mini" @click="cancelAddress">取 消</mt-button>
          <span>选择房址</span>
          <mt-button type="primary" size="small" class="button-mini" @click="sureAddress">确 定</mt-button>
        </div>
      </mt-picker>
    </mt-popup>

    <div style="width: 100%; height:10px;"></div>

    <mt-cell class="applyVisit-row">
      <span slot="title" class="required">访客姓名</span>
      <mt-field placeholder="请输入被授权人姓名" v-model="visitorName"></mt-field>
    </mt-cell>
    <mt-cell class="applyVisit-row">
      <span slot="title" class="required">访客性别</span>
      <mt-radio v-model="sex.value" :options="sex.list" style="display:flex;"></mt-radio>
    </mt-cell>

    <mt-cell class="applyVisit-row">
      <span slot="title" class="required">手机号码</span>
      <mt-field placeholder="请输入被授权人手机号码" v-model="phoneNum" type="tel" :attr="{ maxlength: 11 }">
        <!-- <mt-button size="small" style="width:50px; height:25px; padding:0;">通讯录</mt-button> -->
      </mt-field>
    </mt-cell>

    <mt-cell title="访客类型" class="applyVisit-row">
      <mt-button @click.native="type.visible = true" size="small">{{type.label}}</mt-button>
    </mt-cell>

    <mt-popup v-model="type.visible" popup-transition="popup-fade" class="applyVisit-list-popup">
      <mt-radio align="right" v-model="type.value" :options="type.list" @change="radioChange(type)"></mt-radio>
    </mt-popup>

    <mt-cell title="证件类型" class="applyVisit-row">
      <mt-button @click.native="cerSort.visible = true" size="small">{{cerSort.label}}</mt-button>
    </mt-cell>

    <mt-popup v-model="cerSort.visible" popup-transition="popup-fade" class="applyVisit-list-popup">
      <mt-radio
        align="right"
        v-model="cerSort.value"
        :options="cerSort.list"
        @change="radioChange(cerSort)"
      ></mt-radio>
    </mt-popup>

    <mt-cell title="证件号码" class="applyVisit-row">
      <mt-field class="applyVisit-field-value" placeholder="请输入被授权人的证件号码" v-model="cerCode"></mt-field>
    </mt-cell>

    <mt-cell title="到访原因" class="applyVisit-row">
      <mt-field class="applyVisit-field-value" placeholder="请输入被授权人的到访原因" v-model="reason"></mt-field>
    </mt-cell>

    <mt-cell class="applyVisit-row" is-link @click.native="time.boxVisible = !time.boxVisible">
      <span slot="title" class="required">有效时长</span>
      <span
        class="address"
        :style="timeSpan == 'error' ? 'color:red;' : ''"
      >{{timeSpan == 'error' ? '开始时间必须小于结束时间！' : timeSpan}}</span>
    </mt-cell>

    <div v-show="time.boxVisible" class="bg-color applyVisit-time-box">
      <mt-cell title="开始时间" @click.native="showDatePicker('startTimePicker')" class="bg-color">
        <div
          class="time-string-box"
          style="background-color:white"
        >{{startTime ? startTime : '点击选择开始时间'}}</div>
      </mt-cell>
      <mt-cell title="结束时间" @click.native="showDatePicker('endTimePicker')" class="bg-color">
        <div
          class="time-string-box"
          style="background-color:white"
        >{{endTime ? endTime : '请点击选择时间'}}</div>
      </mt-cell>
    </div>

    <mt-datetime-picker
      ref="startTimePicker"
      type="datetime"
      :startDate="time.allowStartDate"
      :endDate="time.allowEndDate"
      v-model="time.start"
    ></mt-datetime-picker>

    <mt-datetime-picker
      ref="endTimePicker"
      type="datetime"
      :startDate="time.endAllowMinDate"
      :endDate="time.allowEndDate"
      v-model="time.end"
    ></mt-datetime-picker>

    <mt-cell title="人脸识别" class="applyVisit-row" v-if="face.visible">
      <mt-switch v-model="face.isUse">{{face.isUse ? '开启' : '关闭'}}</mt-switch>
    </mt-cell>

    <!-- 图片上传组件 -->
    <upLoadImg ref="uploadImg" v-show="face.isUse" count="1" @completed="uploadCompleted"></upLoadImg>

    <div style="margin:10px;">
      <mt-button type="primary" size="large" @click="submit">确认授权</mt-button>
    </div>

    <!-- <div v-html="log"></div> -->
  </div>
</template>

<script>
import { Cell, Field, Popup, Picker, Switch, Toast, MessageBox, Indicator } from "mint-ui"
// import wx from 'weixin-js-sdk'
import upLoadImg from '@/components/upLoadImg'
import { submitVisitorInfo, isFaceDb, uploadFace, queryDict } from '@/api/applyVisit'
import Util from "@/libs/util.js"

export default {
  computed: {
    // 开始时间
    startTime: function () {
      let showStr = this.dateToStr(this.time.start)
      this.time.startStr = showStr.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')
      this.time.endAllowMinDate.setMinutes(this.time.start.getMinutes() + 10)
      return showStr
    },

    // 结束时间
    endTime: function () {
      let showStr = this.dateToStr(this.time.end)
      this.time.endStr = showStr.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')
      return showStr
    },

    // 时间差
    timeSpan: function () {
      if (!this.startTime || !this.endTime) return ''
      let diffTime = this.getDiffTime(this.startTime, this.endTime)
      if (diffTime.isMinus || diffTime.second < 60) {
        // 开始时间必须小于结束时间！
        return 'error'
      }
      return diffTime.str
    }
  },

  components: {
    upLoadImg: upLoadImg
  },

  data() {
    return {
      visitorName: '',
      sex: {
        value: '',
        label: '',
        list: []
      },
      phoneNum: '',
      address: {
        visible: false,
        value: '',
        preValue: '', // 储存 唤起地址选择器前的value
        label: '',
        resCode: '',
        resName: '',
        list: [{ values: [] }]
      },

      type: {
        value: '9',
        visible: false,
        list: []
      },
      cerSort: {
        value: '9',
        visible: false,
        list: []
      },
      cerCode: "",
      reason: '',

      time: {
        boxVisible: false,
        allowStartDate: new Date(),
        allowEndDate: new Date(),
        endAllowMinDate: new Date(),
        start: new Date(),
        end: '',

        startStr: '', // yyyymmddHHiiss 12位格式，用于传给后端
        endStr: '',
      },

      face: {
        isUse: false,
        visible: false,
        serverId: '',
      },
      allParams: {},
      log: ``
    }
  },

  created() {
    this.getMyHouseList()
    this.setEndData()


  },

  mounted() {
    console.log(this.$store.state)
    this.getDict()
    this.sureAddress() // 查询默认选中的小区是否有人脸库 
    this.log += `————————————————<br/>用户信息：${JSON.stringify(this.$store.state.resUser.tagId)},${JSON.stringify(this.$store.state.resUser.identity)} <br/>————————————————<br/>`
  },

  methods: {

    /**
     * 获取数据字典
     */
    getDict() {
      let param = { identity: this.$store.state.resUser.identity, openId: this.$store.state.openId }
      queryDict(param).then(response => {
        const res = response.data.data
        // console.log(res)
        if (res) {
          this.sex.list = this.dictTransform(res.sexDict)
          this.type.list = this.dictTransform(res.visType)
          this.cerSort.list = this.dictTransform(res.idcardType)

          this.radioChange(this.sex)
          this.radioChange(this.type)
          this.radioChange(this.cerSort)
        }
      })
    },

    /**
     * 数据字典key转换：id -> value, text -> lebel, 用于UI组件所需的数据格式
     */
    dictTransform(dict) {
      let newDict = []
      dict.forEach(item => {
        newDict.push({
          value: item.id,
          label: item.text
        })
      })
      return newDict
    },

    /**
     * 值转为显示的内容  用于UI组件所需的数据格式 [{value:'', label:''},...]
     */
    valueToLabel(array, v) {
      if (!array || !v) return ''
      let obj = array.find(item => item.value === v)
      // console.log('value: ' + v)
      // console.log('label: ' + obj.label)
      return obj.label
    },

    /**
     * 单选框的值改变
     */
    radioChange(obj) {
      // console.log('--radioChange--')
      this.$nextTick(() => {
        obj.label = this.valueToLabel(obj.list, obj.value)
        obj.visible = false
      })
    },

    /**
     * 获取用户房屋列表
     */
    getMyHouseList() {
      this.$store.state.resUser.resMyhouse.forEach(house =>
        this.address.list[0].values.push({
          label: house.houseAddr.split(',')[1], // 去掉房址头部：厦门市思明区,
          value: house.houseId,
          resCode: house.resCode,
          resName: house.resName
        })
      )
      this.address.label = this.valueToLabel(this.address.list[0].values, this.address.value)
    },

    /**
     * 唤起地址选择器
     */
    showAddressPicker() {
      this.address.visible = true
      this.address.preValue = this.address.value
    },

    /**
     * 选择房址滚动切换
     */
    addressChange(picker, values) {
      this.$set(this.address, 'value', values[0].value)
      this.$set(this.address, 'label', values[0].label)
      this.$set(this.address, 'resCode', values[0].resCode)
      this.$set(this.address, 'resName', values[0].resName)
    },

    /**
     * 取消选择房址
     */
    cancelAddress() {
      this.address.visible = false
      this.address.value = this.address.preValue
      this.address.label = this.valueToLabel(this.address.list[0].values, this.address.value)
    },

    /**
     * 确定选择房址
     */
    sureAddress() {
      isFaceDb({ openId: this.$store.state.openId, resCode: this.address.resCode }) // 查询人脸库
        .then(res => {
          // console.log(res.data)
          if (res.data.data > 0) {
            // 人脸项显示隐藏
            this.face.visible = true
          } else {
            this.face.visible = false
          }
        }).catch(err => console.log(err))
      this.address.visible = false
    },

    /**
     * 唤起时间选择器
     */
    showDatePicker(ref) {
      this.$refs[ref].open()
    },

    /**
     * 设置结束时间
     */
    setEndData() {
      let d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      this.time.allowEndDate = d
    },

    // 步骤分解
    // 1. 点击按钮提交
    // 2. 上传图片到微信服务器
    // 3. 等待全部上传完成后，返回serverId
    // 4. 将serverId 上传到服务器，返回fileName
    // 5. 将fileName 与 其他表单资料 一起提交


    /**
     * 点击提交
     */
    submit() {
      let params = {
        identity: this.$store.state.resUser.identity,
        openId: this.$store.state.openId,
        resUserId: this.$store.state.resUser.resUserId,
        resCode: this.address.resCode,
        resHomeAddr: this.address.label,
        visitorName: this.visitorName,  // 访客名
        mphone: this.phoneNum,
        sex: this.sex.value,
        visitorType: this.type.value,
        idcardType: this.cerSort.value,
        idcardNumb: this.cerCode,
        visitRemark: this.reason,
        resTrueName: this.$store.state.resUser.trueName,
        expectVisitTime: this.time.startStr,
        expectLeaveTime: this.time.endStr,
      }
      console.log(params)

      if (!params.visitorName) {
        Toast('请填写访客姓名')
        return
      }
      if (!params.sex) {
        Toast('请选择访客性别')
        return
      }
      if (params.mphone.match(/^1[3-9]\d{9}$/) === null) {
        Toast('请填写正确的手机号码')
        return
      }
      if (!params.expectVisitTime || !params.expectLeaveTime) {
        Toast('请设置有效时间')
        return
      }
      this.allParams = params

      Indicator.open()
      if (this.face.isUse) {
        this.log += `开始上传图片 <br/>`
        // 调用子组件上传图片
        this.$refs.uploadImg.doUpLoad()
      } else {
        this.submitFormInfo(params)  // 只提交其他资料
      }

    },

    /**
     * 图片上传微信服务器完成
     */
    uploadCompleted(data) {

      this.log += `上传完成，返回mediaId：${data.serverIds[0]} <br/> 整个数据：${JSON.stringify(data)}<br/>`
      console.log(data)
      if (data.state === 0) {
        Toast('清先选择人脸图片')
        this.log += `结束：未选择人脸图片 <br/>`
        return
      } else if (data.state === 1) {

        this.uploadFaceImg(data.serverIds[0]).then(fileName => {
          this.allParams.fileName = fileName
          console.log('-----------------')
          this.log += `提交所有资料 <br/>`
          this.submitFormInfo(this.allParams)
        }).catch(err => {
          Indicator.close()
          MessageBox.alert(err, '提示').then(action => {
            this.$refs.uploadImg.dataInit()
          })
        })
      }
    },

    /**
     * 上传人脸图片到后端服务器 mediaId 换 fileName
     */
    uploadFaceImg(serverIds) {
      let param = {
        identity: this.$store.state.resUser.identity,
        openId: this.$store.state.openId,
        mediaId: serverIds,
        visitorName: this.allParams.visitorName
      }
      this.log += `身份标识：${param.identity} <br/>`

      return new Promise((resolve, reject) => {
        this.log += `请求参数：${JSON.stringify(param)} <br/>`
        uploadFace(param).then(res => {
          this.log += `返回数据：${JSON.stringify(res.data)} <br/> 获取的fileName：${res.data.data} <br/> `
          console.log(res)
          if (res.data.info == 'success') {
            resolve(res.data.data)
          } else {
            // reject(res.data.message)
            reject('请上传正确清晰的人脸图片！')
          }
        }).catch(err => console.log(err))
      })
    },


    /**
     * 提交表单部分的资料
     */
    submitFormInfo(params) {
      Indicator.open()
      this.log += `请求参数：${JSON.stringify(this.allParams)} <br/>`
      submitVisitorInfo(params).then(res => {
        Indicator.close()
        this.log += `返回: ${JSON.stringify(res.data)} <br/>`
        console.log(res.data)
        if (res.data.info === 'failure') {
          Toast('提交错误')
          return
        }
        // 跳转到通行证页面
        this.$router.push({
          name: 'passPermit',
          params: {
            applyId: res.data.data,
            resCode: params.resCode,
            resName: this.address.resName,
            startTime: this.startTime,
            endTime: this.endTime
          }
        })
      }).catch(err => console.log(err))
    },


    /**
     * 日期转时间
     * @param {Date} date 时间对象
     * @return {String} yyyy-mm-dd HH:ii
     */
    dateToStr(date) {
      if (!date) return ''
      let year = date.getFullYear()
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let date1 = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return year + '-' + month + '-' + date1 + ' ' + hour + ':' + minutes
    },

		/**
		 * 字符串转时间戳
		 * @param {String} timeStr 时间字符串
		 * @param {Boolean} isMillisec 返回带毫秒 13位 时间戳
		 * @return 10位/13位 时间戳
		 */
    getTimestamp(timeStr, isMillisec = false) {
      let timestamp = (new Date(timeStr.replace(/-/g, "/"))).getTime();
      return isMillisec ? timestamp : timestamp / 1000;
    },

		/**
		 * 获取时间差值
		 * @param {String or timeStamp} startTime 开始时间
		 * @param {String or timeStamp} endTime 结束时间
		 */
    getDiffTime(startTime, endTime) {
      startTime = typeof startTime == 'string' ? this.getTimestamp(startTime) : startTime
      endTime = typeof endTime == 'string' ? this.getTimestamp(endTime) : endTime
      let diffSec = endTime - startTime // 时间差的秒数
      let isMinus = false
      if (diffSec < 0) {
        diffSec = 0 - diffSec
        isMinus = true
      }

      // 组装时间差字符
      let diffStr = diffSec < 60 ? '小于1分钟' : ''
      let temp = Math.floor(diffSec / (3600 * 24))
      diffStr += temp ? temp + '天' : ''
      temp = Math.floor(diffSec % (3600 * 24) / 3600)
      diffStr += temp ? temp + '小时' : ''
      temp = Math.floor((diffSec % (3600)) / 60);
      diffStr += temp ? temp + '分钟' : ''
      return {
        second: diffSec,  // 相差秒数
        str: diffStr, // x天x时x分
        isMinus: isMinus  // 差值是否为负数
      }
    },



  }
}
</script>

<style lang="less" scoped>
@import "../assets/less/lib-rem";

// mint UI 组件蓝： #26A2FF rgba(38,162,255)

#applyVisit {
  background-color: #f5f9fc;

  // 必须填写的信息
  .required:before {
    content: "*";
    color: red;
    font-size: 20px;
    line-height: 20px;
  }

  .applyVisit-address {
    width: 11rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .applyVisit-icon {
    width: 24px;
    height: 24px;
  }

  // 行
  .applyVisit-row {
    border-bottom: 1px solid #eeeeee;
    & /deep/ .mint-cell-wrapper {
      justify-content: flex-start;
    }
    & /deep/ .mint-cell-wrapper > .mint-cell-title {
      flex: none;
      width: 5rem;
    }
  }

  .applyVisit-field-value {
    width: 12rem;
  }

  .applyVisit-time-box {
    padding-left: 20px;
    & /deep/ .mint-cell-wrapper {
      background-color: #f5f9fc;
    }

    & /deep/ .mint-cell-wrapper > .mint-cell-title {
      flex: none;
      width: 5rem;
    }
  }

  /deep/ .mint-cell-value .mint-cell-wrapper {
    padding: 0;
  }

  .mint-cell-value {
    font-size: 14px;
  }

  // 弹出框
  .applyVisit-list-popup {
    width: 10rem;
    padding: 5px;
    border-radius: 5px;
    color: #303133;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 2px;
  }

  // 时间框
  .time-string-box {
    box-sizing: border-box;
    text-align: center;
    width: 150px;
    height: 26px;
    border: 1px solid #26a2ff;
    border-radius: 5px;
    padding: 5px 10px;
  }

  // 小区选择器
  .applyVisit-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 5px 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 1px;
  }

  .button-mini {
    height: 28px;
  }
}
</style>
