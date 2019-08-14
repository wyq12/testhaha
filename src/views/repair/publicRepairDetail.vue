<template>
  <div>
    <div class="repairBox">
      <div class="comBox">
        <div class="comBackground">报事报修详情</div>
        <div class="RepairDEtailContent">
          <div class="header dealStateBox">
            <div class="headerBtn">
              <div v-if="state>=2" style="background-color:white;width:4rem;"></div>
              <div
                v-if="state<2"
                style="background-color:white;width:4rem;"
                class="containBtn fontSize"
                @click="remind"
              >提醒物业</div>
              <div v-cloak>{{orderStatus}}</div>
              <div class="containBtn fontSize">
                <router-link
                  :to="{path:'/progressDetail',query:{repairType:'public',orderNo:orderNo}}"
                >进度明细</router-link>
              </div>
            </div>
            <div class="dealTime">
              <span>处理时间</span>
              <span v-cloak>{{dealTimes}}</span>
            </div>
            <div class="step">
              <div class="allStep" ref="allStep">
                <div style="width:33.3%;" v-bind:class="state>0?'currentStep':''"></div>
                <div style="width:33.3%;" v-bind:class="state>1?'currentStep':''"></div>
                <div style="width:33.3%;" v-bind:class="state>2?'currentStep':''"></div>
              </div>
              <div class="stepDot" ref="stepDot">
                <div
                  class="currentStepDot"
                  v-bind:class="state>=0?state==0?'dot-circle selectStepDot':'selectStepDot':''"
                ></div>
                <div
                  v-if="state<4"
                  class="currentStepDot"
                  v-bind:class="state>=1?state==1?'dot-circle selectStepDot':'selectStepDot':''"
                ></div>
                <div
                  v-if="state<4"
                  class="currentStepDot"
                  v-bind:class="state>=2?state==2?'dot-circle selectStepDot':'selectStepDot':''"
                ></div>
                <div
                  class="currentStepDot"
                  v-bind:class="state>=3?state==3?'dot-circle selectStepDot':'dot-circle selectStepDot':''"
                ></div>
                <!-- <div class="currentStepDot" v-bind:class="state>=3?state==3?'dot-circle selectStepDot':'selectStepDot':''"></div> -->
              </div>
              <div class="allStepText">
                <div v-bind:class="state==0?'allStepTextColor':''">待接单</div>
                <div v-if="state<4" v-bind:class="state==1?'allStepTextColor':''">处理中</div>
                <div v-if="state<4" v-bind:class="state==2?'allStepTextColor':''">已处理</div>
                <div v-if="state<4" v-bind:class="state==3?'allStepTextColor':''">已评价</div>
                <div v-if="state == 4" v-bind:class="state==4?'allStepTextColor':''">已取消</div>
              </div>
            </div>
          </div>
          <div class="relation">
            <a :href="'tel:'+relations" v-if="relations!=''">联系物业</a>
            <span v-if="relations==''" style="font-size:14px;">暂无法联系物业</span>
          </div>
          <div class="repairInfo">
            <div>
              <span>提交者:</span>
              <span v-cloak>{{submitName}}</span>
            </div>
            <div>
              <span>联系电话：</span>
              <span v-cloak>{{mphone}}</span>
            </div>
            <div>
              <span>地址：</span>
              <span class="wrap" v-cloak>{{repairAddr}}</span>
            </div>
            <div>
              <span>类型：</span>
              <span v-cloak>{{perRepairDict}}</span>
            </div>
            <div class="flexs">
              <span>处理人员：</span>
              <span v-if="dealName == ''">--</span>
              <span>{{dealName}}</span>
              <a :href="'tel:'+dealUserPhone">
                <div class="flexs" style="color:#3da1fe;">
                  <img
                    v-if="dealName!=''"
                    src="../../../static/images/tel.png"
                    style="width:23px;"
                    alt
                  />
                  {{dealUserPhone}}
                </div>
              </a>
            </div>
            <div>
              <span>提交时间：</span>
              <span v-cloak>{{createTime}}</span>
            </div>
            <div>
              <span>内容：</span>
              <span class="wrap" v-cloak>{{repairContent}}</span>
            </div>
            <div class="addPhoto" v-if="repairPhoto.length>0">
              <div>图片：</div>
              <div class="photoContent">
                <div class="photo" v-for="(item,index) in repairPhoto" :key="index">
                  <img :src="item" @click="funcReadImgInfo(index,item)" alt />
                </div>
              </div>
            </div>
            <div v-if="state>1">
              <div>
                处理情况：
                <span>{{dealContent}}</span>
              </div>
              <div class="photoContent">
                <div class="photo" v-for="(item,index) in dealPhoto" :key="index">
                  <img :src="item" @click="funcReadImgInfo(index,item)" alt />
                </div>
              </div>
            </div>
            <!-- 评价 -->
            <template v-if="state>1">
              <div style="margin-bottom:15px;" v-if="state<4">
                <div class="start">
                  <span>评价：</span>
                  <ul ref="foodsWrapper" v-if="state == 2">
                    <li
                      v-for="(item,index) in startList"
                      :key="index"
                      @click="showStart(index)"
                      v-bind:class="item.current?'active':''"
                    ></li>
                  </ul>
                  <ul v-if="state==3">
                    <li v-for="(item,index) in startList2" :key="index" class="active"></li>
                  </ul>
                  <!-- <span style="float:right;">{{evaluateTime}}</span> -->
                </div>
                <div>
                  <mt-field
                    v-if="state==2"
                    placeholder=" 请为物业工作人员做出评价，谢谢！"
                    type="textarea"
                    rows="3"
                    v-model="introduction"
                    class="repairContentTextarea"
                  ></mt-field>
                  <div v-if="state==3">{{remark}}</div>
                </div>
                <div class="photoContent" v-if="raisePhoto.length>0">
                  <div class="photo" v-for="(item,index) in raisePhoto" :key="index">
                    <img :src="item" @click="funcReadImgInfo(index,item)" alt />
                  </div>
                </div>
                <div class="addPhoto" v-if="state==2">
                  <div class="addBtn" v-cloak @click="addPhoto1" v-if="addRaisePhoto.length<=0">添加图片</div>
                  <div class="photoContent">
                    <div class="photo" v-cloak v-for="(item,index) in addRaisePhoto" :key="index">
                      <div class="removePhoto" @click="removePhoto1(index)">
                        <img src="../../../static/images/removePhoto.png" alt />
                      </div>
                      <img :src="item" alt />
                    </div>
                    <!-- <template v->

                    </template>-->
                    <div
                      class="photo"
                      v-cloak
                      @click="addPhoto1"
                      v-if="addRaisePhoto.length>0 && addRaisePhoto.length<3"
                    >
                      <img src="../../../static/images/addPhoto.png" alt />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div
              style="text-align:center;display: -webkit-box;display: -webkit-flex;display: flex;justify-content:space-around;"
            >
              <div size="large" v-if="state==0" @click="cancel" class="cancel">取消订单</div>
              <div v-if="state==2" @click="submitEvaluates" class="containBtn">提交</div>
              <div v-if="state==2" class="containBtn">
                <router-link :to="{path:'/myRepair'}">返回</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="zzShow"
      class="mint-msgbox-wrapper"
      style="position: absolute; z-index: 2005;"
      @click="viewImg"
      v-cloak
    >
      <!-- 遮罩层 -->
      <div class="v-modal" @touchmove.prevent></div>
      <div class="imgs">
        <!-- <mt-swipe :auto="0" > -->
        <img :src="defaultSrc" alt />
        <!-- </mt-swipe> -->
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { Swipe, SwipeItem } from 'mint-ui'
import back from '../../components/backHeader';
import {
  infoDetailPort,
  relationWyPort,
  imgInfoPort,
  cancelPort,
  submitEvaluatesPort,
  zhuHuRemindPort
} from "@/api/repairDetail";
import { setTimeout } from 'timers';
import { Indicator, MessageBox } from 'mint-ui';
export default {
  components: {
    Swipe, SwipeItem, back
  },
  data() {
    return {
      zzShow: false,
      repairPhoto: [],//报修图片
      dealPhoto: [],//处理图片
      raisePhoto: [],//评价图片
      repairPhoto5: [
        '../../../static/images/addPhoto.png', '../../../static/images/alarm.png'
      ],
      startList: [
        { current: false },
        { current: false },
        { current: false },
        { current: false },
        { current: false }
      ],
      startList2: [],
      introduction: "",
      evaluateTime: "",
      submitName: "",
      mphone: "",
      repairAddr: "",
      perRepairDict: "",
      dealName: "",
      createTime: "",
      repairContent: "",
      state: "",
      orderStatus: "",
      dealTimes: "",
      evaluate: 0,
      remark: "",
      orderNo: "", //跳转带参
      repairType: "",
      relations: "",
      resCode: "",
      dispatchCount: "",
      app_userId: "",
      defaultSrc: '',
      remindTime: "", //上一次提醒成功的时间
      fastRemindTime: "",
      openidd: '',
      dealUserPhone: '',
      dictId: '',
      dealContent: '',//处理情况
      serverId: [],
      addRaisePhoto: []
    };
  },
  async created() {
    let that = this;
    Indicator.open({
      spinnerType: 'fading-circle'
    });
    var srepairType = Util.GetUrlParam("repairType");
    var sperOrderNo = Util.GetUrlParam("orderNo");
    var openIds = Util.GetUrlParam("openId");
    that.dictId = Util.GetUrlParam("dictId");
    if (srepairType != null) {
      var srepairType_ = decodeURIComponent(srepairType);
      that.repairType = srepairType_;
    }
    if (sperOrderNo != null) {
      var sperOrderNo_ = decodeURIComponent(sperOrderNo);
      that.orderNo = sperOrderNo_;
    }
    var userData = this.$store.state.resUser;
    that.app_userId = userData.resUserId;
    var paramsresCode = "";
    for (var i = 0; i < userData.resMyhouse.length; i++) {
      if (userData.resMyhouse[i].isDefaultHouse == 1) {
        paramsresCode = userData.resMyhouse[i].resCode;
        break;
      }
    }
    that.resCode = paramsresCode;
    await that.infodetail();
    await that.relationWy();
    await that.imgInfo();
  },

  methods: {
    async infodetail() {
      let that = this;
      await infoDetailPort({
        type: "public",
        orderNo: that.orderNo,
        dictId: that.dictId
      })
        .then(res => {
          Indicator.close();
          let rtnData = res.data;
          if (rtnData.info == "success") {
            let rtnTypeJson = rtnData.data[1];
            let rtnInfo = rtnData.data[0];
            that.submitName = rtnInfo.submitName;
            that.mphone = rtnInfo.mphone;
            that.repairAddr = rtnInfo.repairAddr;
            that.dealName = rtnInfo.dealName;
            that.dealUserPhone = rtnInfo.dealUserPhone
            that.createTime = rtnInfo.createTime;
            that.repairContent = rtnInfo.repairContent;
            that.perRepairDict = rtnTypeJson.dictNameJson;
            that.state = rtnInfo.orderStatus;
            that.orderStatus = Util.getTypeJsonText(JSON.parse(rtnTypeJson.orderStatusDict), rtnInfo.orderStatus);
            that.dealTimes = Util.getDealTimes(rtnInfo.createTime, rtnInfo.lastModTime, rtnTypeJson.currentTime, rtnInfo.orderStatus);
            that.remark = rtnInfo.remark;
            that.evaluate = rtnInfo.evaluate;
            that.dispatchCount = rtnInfo.dispatchCount;
            that.resCode = rtnInfo.resCode;
            that.dealContent = rtnTypeJson.content
            if (rtnInfo.remindTime != "") {
              that.remindTime = Util.remindTimes(rtnInfo.remindTime).minute;
              that.fastRemindTime = Util.remindTimes(rtnInfo.remindTime).lastTime;
            }
            var evaluateArr = [];
            for (let i = 0; i < rtnInfo.evaluate; i++) {
              evaluateArr.push("current");
            }
            that.startList2 = evaluateArr;
          } else {
            Toast("网络请求失败");
          }
        })
        .catch(function (error) { });
    },
    async relationWy() {
      let that = this;
      await relationWyPort({ resCode: that.resCode }).then(res => {
        let rtnData = res.data;
        if (rtnData.info == "success") {
          that.relations = rtnData.data;
        } else {
          // Toast("暂时无法联系物业人员");
        }
      })
        .catch(function (error) { Toast('网络请求失败') });
    },
    async imgInfo() {
      let that = this;
      await imgInfoPort({
        type: "public",
        orderNo: that.orderNo
      })
        .then(res => {
          let rtnData = res.data;
          let imgSrc = rtnData.data;
          console.log('imgInfoPort res', res)
          if (rtnData.info == "success") {
            // 20190808 尝试解决取消后图片重复的问题
            this.repairPhoto = []
            this.dealPhoto = []
            this.raisePhoto = []
            for (let i = 0; i < imgSrc.imgList.length; i++) {
              var str = imgSrc.imgList[i].substr(1);
              that.repairPhoto.push(imgSrc.imagePath + imgSrc.imgList[i]);
            }
            for (let j = 0; j < imgSrc.affirmImgList.length; j++) {
              var dealStr = imgSrc.affirmImgList[j].substr(1);
              that.dealPhoto.push(imgSrc.imagePath + imgSrc.affirmImgList[j]);
            }
            for (let k = 0; k < imgSrc.appraiseImgList.length; k++) {
              var raiseStr = imgSrc.appraiseImgList[k].substr(1);
              that.raisePhoto.push(imgSrc.imagePath + imgSrc.appraiseImgList[k]);
            }
          } else {
            Toast("网络请求失败");
          }
        })
        .catch(function (error) { });
    },
    // 取消订单
    cancel: function () {
      var that = this;
      var params = {
        type: "public",
        orderNo: that.orderNo,
        orderStatus: "4", //取消固定为4
        app_userId: that.app_userId
      };
      this.$messagebox.confirm("确定执行此操作?").then(action => {
        cancelPort(params)
          .then(res => {
            let rtnData = res.data;
            if (rtnData.info == "success") {
              Toast('操作成功')
              that.infodetail();
              that.imgInfo();
            } else {
              Toast("网络请求失败");
            }
          })
          .catch(function (error) { });
      });
    },
    // 评价
    submitEvaluates: function () {
      let that = this;
      var mediaIdStr = that.serverId.join(',')
      // alert(mediaIdStr)
      let params = {
        type: "public",
        orderNo: that.orderNo,
        orderStatus: "3", //评价固定为3
        remark: that.introduction,
        evaluate: that.evaluate,
        app_userId: that.app_userId,
        mediaId: mediaIdStr
      };
      if (that.evaluate != "0") {
        submitEvaluatesPort(params)
          .then(res => {
            let rtnData = res.data;
            if (rtnData.info == "success") {
              that.infodetail();
              that.imgInfo()
            } else {
              Toast("网络请求失败");
            }
          })
          .catch(function (error) { });
      } else {
        Toast("请为物业工作人员打星，谢谢！");
      }
    },
    showStart: function (num) {
      this.evaluate = num + 1;
      let startList = this.$refs.foodsWrapper.getElementsByTagName("li");
      for (var i = 0; i < startList.length; i++) {
        if (i <= num) {
          this.startList[i].current = true;
        } else {
          this.startList[i].current = false;
        }
      }
    },
    //提醒物业
    remind: function () {
      var that = this;
      if (!that.fastRemindTime) {
        that.$options.methods.zhuHuRemind(that);
      } else {
        if (that.remindTime > 600) {
          that.$options.methods.zhuHuRemind(that);
        } else {
          that.$options.methods.formatRemingTime(that.fastRemindTime, that);
          Toast("十分钟内不能重复提醒");
        }
      }
    },
    zhuHuRemind: function (that) {
      let params = {
        orderNo: that.orderNo,
        orderStatus: that.state,
        dispatchCount: that.dispatchCount,
        resCode: that.resCode,
        type: "public",
        submitName: that.submitName
      };
      zhuHuRemindPort(params)
        .then(res => {
          let rtnData = res.data;
          if (rtnData.info == "success") {
            Toast("提醒成功");
            that.$options.methods.formatRemingTime("1", that);
          } else {
            Toast(rtnData.message);
          }
        })
        .catch(function (error) { });
    },
    // 点击放大图
    funcReadImgInfo: function (index, src) {
      console.log(index)
      this.zzShow = true;
      this.defaultSrc = src;
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = "hidden";
    },
    viewImg: function () {
      this.zzShow = false;
      document.documentElement.style.overflow = "auto";
    },
    formatRemingTime: function (lastTime, that) {
      var tDate = new Date();
      var year = tDate.getFullYear();
      var month = tDate.getMonth() + 1 >= 10 ? tDate.getMonth() + 1 : "0" + (tDate.getMonth() + 1);
      var day = tDate.getDate() >= 10 ? tDate.getDate() : "0" + tDate.getDate();
      var hour = tDate.getHours() >= 10 ? tDate.getHours() : "0" + tDate.getHours();
      var minute = tDate.getMinutes() >= 10 ? tDate.getMinutes() : "0" + tDate.getMinutes();
      var second = tDate.getSeconds() >= 10 ? tDate.getSeconds() : "0" + tDate.getSeconds();
      if (lastTime == "1") {
        lastTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
      }
      that.remindTime = Util.remindTimes(lastTime).minute;
      that.fastRemindTime = Util.remindTimes(lastTime).lastTime;
    },
    // 添加图片
    addPhoto1() {
      this.btnShow = false;
      let that = this;
      if (that.addRaisePhoto.length < 3) {
        wx.chooseImage({
          count: 3 - that.addRaisePhoto.length,
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
            Indicator.open({
              text: '正在上传图片中，请稍后...',
              spinnerType: 'fading-circle'
            });
            that.uploadImages(localIds, 0, 'public')
            for (let i = 0; i < localIds.length; i++) {
              that.addRaisePhoto.push(localIds[i]);
            }
          },
          fail: function (error) {
            console.log(error)
          }
        });
      } else {
        Toast('您最多可上传3张图片')
      }
    },
    uploadImages: function (localIds, i, type) {
      let that = this;
      // alert('uploadImages1')
      wx.uploadImage({
        localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
          var serverId = res.serverId;
          that.serverId.push(serverId);
          if (i < localIds.length - 1) {
            setTimeout(function () {
              i++;
              that.uploadImages(localIds, i, type);
            }, 100);
          } else {
            Indicator.close();
          }
        }
      })
    },
    removePhoto1: function (index) {
      let that = this;
      this.serverId.splice(index, 1);
      this.addRaisePhoto.splice(index, 1)
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/complainDetail.less";
@import "../../assets/less/publicRepairDetail.less";
@import "../../assets/less/repair.less";
@import "../../assets/less/complainAndSuggest.less";
a {
  color: white;
}
.flexs {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  height: 1.3rem;
  line-height: 1.3rem;
}
</style>
