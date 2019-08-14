<template>
  <div
    style="height: 100vh;overflow: scroll;position: relative;background-image: -webkit-linear-gradient(90deg, #86b0ef, #9ccfff);"
    @touchmove.prevent
  >
    <!-- <div class="maskMax" v-show="maskMax"></div> -->
    <mt-popup v-model="popupVisibleMenu" position="left">
      <div class="menuMax">
        <div class="topBox">
          <div class="topBox_one" @click="dropMyInfo">
            <img :src="headImage==1?iconPeople:headImage" alt style="width:100%" />
          </div>
          <div>
            <div class="nickNameBox">{{nickName==''?'暂未绑定个人信息':nickName}}</div>
            <div class="nowHouseBox">
              <!-- <span>当前房屋：</span> -->
              <span>{{nowHouse==''?'暂未绑定房屋':nowHouse}}</span>
            </div>
            <span class="menuBtn" @click="dropMyHouse">切 换</span>
          </div>
        </div>
        <div class="menuBox">
          <div class="item_menu" @click="myRepairDrop">
            <img src="../../static/images/myRepair_menu.png" alt style="width:1.8rem" />
            <span>我的报事报修</span>
          </div>
          <div class="item_menu" @click="myComplain">
            <img src="../../static/images/tousu_menu.png" alt style="width:1.8rem" />
            <span>我的投诉</span>
          </div>
          <div class="item_menu" @click="dropMyHouse">
            <img src="../../static/images/addr_menu.png" alt style="width:1.8rem" />
            <span>我的房址</span>
          </div>
          <div class="item_menu" @click="applyVisit">
            <img src="../../static/images/applyVisit.png" alt style="width:1.8rem" />
            <span>访客申请</span>
          </div>
          <div class="item_menu" @click="visitRecord">
            <img src="../../static/images/visitRecord.png" alt style="width:1.8rem" />
            <span>访客记录</span>
          </div>
        </div>
      </div>
    </mt-popup>
    <div class="max">
      <!-- <mt-button type="primary" @click=menuOpen style="z-index: 1;width: 24%;position: absolute;top: 25px;">我的</mt-button> -->
      <span class="menuInfoBtn" @click="menuOpen">
        <span>我 的</span>
      </span>
      <mt-swipe :auto="4000">
        <mt-swipe-item>
          <div class="weatherBox" style="position:relative">
            <div class="weatherBoxOneDiv"></div>
            <div class="weatherBoxTwoDiv"></div>
            <iframe
              allowtransparency="true"
              frameborder="0"
              width="140"
              height="128"
              scrolling="no"
              src="//tianqi.eastday.com/plugin/widget_v1.html?sc=1&z=2&t=0&v=1&d=1&bd=0&k=&f=&q=1&a=0&c=59134&w=140&h=128&align=center"
              style="position:relative;z-index: 1;"
            ></iframe>
          </div>
        </mt-swipe-item>
        <mt-swipe-item>
          <div class="weatherBox" style="position:relative">
            <div class="weatherBoxOneDiv"></div>
            <div class="weatherBoxTwoDiv"></div>
            <iframe
              allowtransparency="true"
              frameborder="0"
              width="140"
              height="128"
              scrolling="no"
              src="//tianqi.eastday.com/plugin/widget_v1.html?sc=1&z=2&t=0&v=1&d=1&bd=0&k=&f=&q=1&a=0&c=59134&w=140&h=128&align=center"
              style="position:relative;z-index: 1;"
            ></iframe>
          </div>
        </mt-swipe-item>
        <mt-swipe-item>
          <div class="weatherBox" style="position:relative">
            <div class="weatherBoxOneDiv"></div>
            <div class="weatherBoxTwoDiv"></div>
            <iframe
              allowtransparency="true"
              frameborder="0"
              width="140"
              height="128"
              scrolling="no"
              src="//tianqi.eastday.com/plugin/widget_v1.html?sc=1&z=2&t=0&v=1&d=1&bd=0&k=&f=&q=1&a=0&c=59134&w=140&h=128&align=center"
              style="position:relative;z-index: 1;"
            ></iframe>
          </div>
        </mt-swipe-item>
      </mt-swipe>

      <div class="main-index">
        <div class="mainBox">
          <img
            src="../../static/images/wave.png"
            alt
            style="position: absolute;width: 100%;top: .5rem;"
          />
          <p class="mainTit"></p>
          <div class="mainBtnBox">
            <div class="mainRow">
              <div>
                <p class="mainBtn" @click="openDoorBtn">
                  <img src="../../static/images/index_phone.png" style="width: 100%;" alt />
                </p>
                <p class="btnTit">手机开门</p>
              </div>
              <div>
                <p class="mainBtn" @click="repairBtn">
                  <img src="../../static/images/index_repair.png" style="width: 100%;" alt />
                </p>
                <p class="btnTit">报事报修</p>
              </div>
            </div>
            <div class="mainRow">
              <div style="margin-top: 1.5rem;">
                <p class="mainBtn" @click="propertyPayBtn">
                  <img src="../../static/images/index_propertyPay.png" style="width: 100%;" alt />
                </p>
                <p class="btnTit">物业缴费</p>
              </div>
              <div style="margin-top: 1.5rem;">
                <p class="mainBtn" @click="complainAndSuggest">
                  <img src="../../static/images/comAndSugg_index.png" style="width: 100%;" alt />
                </p>
                <p class="btnTit">投诉建议</p>
              </div>
            </div>
          </div>
          <div class="mainBottom">
            <span>一键开门（默认）：禹州小区一号楼</span>
          </div>
        </div>
      </div>
    </div>

    <div class="loginMax" v-if="loginMaxIsShow">
      <!-- 手机验证 -->
      <div style="width: 90%; padding-bottom: 5rem;" v-if="boxOneisShow">
        <div class="loginBox boxOne">
          <p class="loginTit">手机验证</p>
          <div class="fieldBox" style="justify-content: flex-start;">
            <div style="width:100%;display: flex;justify-content: flex-start;">
              <input type="text" placeholder="请输入手机号" v-model="phone" />
            </div>
          </div>
          <div class="fieldBox" style="justify-content: flex-start;">
            <div style="width:70%;display: flex;justify-content: flex-start;">
              <input type="text" placeholder="验证码" v-model="code" />
            </div>
            <span v-show="show" class="getCode" @click="getCode">获取</span>
            <span
              v-show="!show"
              class="getCode count"
              style="width: 28%;color:#fff;background-color:#999"
            >{{count}} s</span>
            <!-- <mt-button size="small" v-show="show" type="primary" style="width: 28%;" class="getCode" @click="getCode">获取验证码</mt-button> -->
            <!-- <mt-button size="small" v-show="!show" type="primary" style="width: 28%;color:#fff;background-color:#999" class="getCode count" >{{count}} s</mt-button> -->
          </div>
          <div class="loginCheck" style="flex-direction: column;">
            <div @click="boxOneDrop" style="margin-bottom:.5rem">下一步</div>
            <p
              @click="loginMaxIsShow=false"
              style="text-align: center;margin-bottom: 1rem;color: #518DEA;font-size: 16px;
                        margin-top: .5rem;"
            >游客登录</p>
          </div>
        </div>
      </div>

      <!-- 房屋绑定 -->
      <div style="width: 90%; padding-bottom: 5rem;" v-if="boxTwoisShow">
        <div class="loginBox">
          <p class="loginTit">
            房屋绑定
            <span @click="loginMaxIsShow=false;boxTwoisShow=false;updateUserInfo()">跳过</span>
          </p>
          <div class="fieldBox">
            <span style="width:30%;">选择小区</span>
            <div style="width:70%;display: flex;justify-content: flex-end;">
              <div
                v-on:click="dropChooseCommunity"
                class="select_bottom"
                style="width: 90%;padding-left: 0;"
              >
                <span>{{communityValue}}</span>
                <div class="goBtn"></div>
              </div>
            </div>
          </div>
          <div class="fieldBox">
            <span style="width:30%;">选择房屋</span>
            <div style="width:70%;display: flex;justify-content: flex-end;">
              <div v-on:click="dropChooseHouse" class="select_bottom" style="width: 70%;">
                <span>{{houseValue}}</span>
                <div class="goBtn"></div>
              </div>
            </div>
          </div>
          <div class="fieldBox">
            <span style="width:30%;">身份</span>
            <div style="width:70%;display: flex;justify-content: flex-end;">
              <div
                v-on:click="popupVisible = true"
                class="select_bottom"
                style="width: 100%;padding-left: 0;"
              >
                <span>{{messageIden}}</span>
                <div class="goBtn"></div>
              </div>
            </div>
            <mt-popup
              v-model="popupVisible"
              position="bottom"
              style="width:100%;background-color: #f1f1f1;"
            >
              <div
                class="pickerDiv"
                v-on:click="messageIden = '业主（房产登记人）';idenValue = 1;popupVisible = false"
              >业主（房产登记人）</div>
              <div
                class="pickerDiv"
                v-on:click="messageIden = '业主家属';idenValue = 2;popupVisible = false"
              >业主家属</div>
              <div
                class="pickerDiv"
                style="margin-bottom:.2rem"
                v-on:click="messageIden = '租户';idenValue = 3;popupVisible = false"
              >租户</div>
              <div class="pickerDiv" v-on:click="popupVisible = false">取消</div>
            </mt-popup>
          </div>
          <div class="loginCheck">
            <div @click="boxTwoDrop">下一步</div>
          </div>
        </div>
      </div>

      <!-- 实名认证 -->
      <div style="width: 90%; padding-bottom: 5rem;" v-if="boxThrisShow">
        <div class="loginBox boxThrisShow">
          <p class="loginTit">实名认证</p>
          <div class="fieldBox">
            <span style="width:30%;">姓名</span>
            <div style="width:70%;display: flex;justify-content: flex-end;">
              <input type="text" placeholder="请输入真实姓名" v-model="trueName" />
            </div>
          </div>
          <div class="fieldBox">
            <span style="width:30%;">性别</span>
            <div style="width:70%;display: flex;justify-content: flex-end;">
              <div v-on:click="popupVisible = true" class="select_bottom">
                <span>{{messageSex}}</span>
                <div class="goBtn"></div>
              </div>
            </div>
            <mt-popup
              v-model="popupVisible"
              position="bottom"
              style="width:100%;background-color: #f1f1f1;"
            >
              <div class="pickerDiv" v-on:click="messageSex = '男';sex = 'M';popupVisible = false">男</div>
              <div class="pickerDiv" v-on:click="messageSex = '女';sex = 'F';popupVisible = false">女</div>
              <div class="pickerDiv" v-on:click="popupVisible = false">取消</div>
            </mt-popup>
          </div>
          <div
            style="font-size: 15px;color:#518DEA;margin:15px 31px 0 0;text-align:right;"
            @click="faceBtn(0)"
          >点击上传照片，开通‘刷脸’开门</div>
          <div class="loginCheck">
            <div @click="boxThrDrop">完 成</div>
          </div>
        </div>
      </div>
    </div>

    <mt-popup v-model="popupVisibleDoor" position="bottom" style="width:100%">
      <div class="openDoorMax" v-if="openMaxIsShow">
        <div class="openDoorBox">
          <div class="openDoorTopBg">
            <p class="faceBtnBox">
              <span class="faceBtn" @click="faceBtn(1)">开通人脸开门</span>
            </p>
            <!-- <img  @click='closeDoorList' src="images/doorClose.png" style="width: 2rem;height: 2rem"> -->
          </div>
          <div class="openDoorMain">
            <div
              class="item_openDoor"
              v-for="(item, index) in doorList"
              :key="index"
              :index="item.index"
            >
              <div class="btn_openDoor" @click="openDoor(item.id,index)">
                <img
                  v-show="current==index"
                  src="../../static/images/openDoorSuccess.png"
                  style="width: 100%;"
                  alt
                />
                <img
                  v-show="current!=index"
                  v-bind:src="item.isOnline=='true'?doorIcon:doorIcon_false"
                  style="width: 100%;"
                  alt
                />
              </div>
              <p
                :style="item.isOnline=='true'?'':'background-image: none;color: #999;box-shadow: 5px 5px 0px #d6d6d6;background-color: #e6e6e6;'"
              >{{item.lockName.replace("门禁","")}}</p>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/babel">
import Util from "@/libs/util.js";
import indexAxios from "@/api/index.js";
import AppAxios from "@/api/App.js";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  name: "index",
  data() {
    return {
      doorIcon: require("../../static/images/doorIcon.png"),
      doorIcon_false: require("../../static/images/doorIcon_false.png"),
      countMask: "",
      timerMask: null,
      popupVisibleMenu: false,
      cityData: [],
      phone: "",
      code: "",
      show: true,
      count: "",
      timer: null,
      trueName: "",
      popupVisible: false,
      idenValue: "",
      openMaxIsShow: false,
      pathStatus: "", //测试暂时写死
      openId: "",
      houseId: "",
      resUserId: "",
      messageIden: "点击选择身份",
      doorList: [],
      idStatus: 1,
      communityValue: "",
      resCode: "PC0000103901A5",
      houseValue: "",
      houseIdNow: "",
      messageSex: "男",
      sex: "M",
      current: -1,
      popupVisibleDoor: false,
      //************************主页主要变量 */
      userInfo: "",
      pathState: "",
      loginMaxIsShow: false,
      boxOneisShow: false,
      boxTwoisShow: false,
      boxThrisShow: false,
      headImage: "1", //测试暂时写死
      iconPeople: require("../../static/images/iconPeople.png"),
      nickName: "暂未获取", //测试暂时写死
      nowHouse: "",
      userInfoState: {
        house: false,
        trueName: false
      }
    };
  },
  created() {
    let that = this;
    //  document.ontouchmove = function(e){ e.preventDefault(); };
    // document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //     // 通过下面这个API隐藏底部导航栏
    //     WeixinJSBridge.call('hideToolbar');
    // });
    this.userInfo = this.userData.resUser;
    this.pathState = this.$store.state.pathState;
    this.openId = this.$store.state.openId;
    console.log("6666", this.$store.state.openId);
    indexAxios.WXnick(this.openId).then(res => {
      //获取头像昵称
      if (res.data.info == "success") {
        that.headImage = res.data.data.headimgurl;
        that.nickName = res.data.data.nickname;
      } else if (res.data.info == "failure") {
        that.headImage = require("../../static/images/headImg_icon.png");
        that.nickName = "暂未获取";
      }
    });

    /* ------------------------------- */

    /* boxOneisShow 或 boxTwoisShow 或 boxThrisShow */
    if (this.userInfo == "") {
      //住户没有数据 走注册登录流程
      this.boxOneisShow = true;
      this.loginMaxIsShow = true;
    } else if (this.userInfo != "") {
      //住户有信息
      if (this.userInfo.resMyhouse[0]) {
        for (var i = 0; i < this.userInfo.resMyhouse.length; i++) {
          if (this.userInfo.resMyhouse[i].isDefaultHouse == 1) {
            //获取当前房屋
            this.nowHouse = this.userInfo.resMyhouse[i].houseAddr.split(",")[1];
          }
        }
        this.userInfoState.house = true; //有绑定房屋
        if (this.userInfo.trueName) {
          this.userInfoState.trueName = true; //有实名认证
        }
      }

      /* boxTwoisShow 或者 boxThrisShow */
      if (this.pathState == 1) {

        /* boxTwoisShow 或者 boxThrisShow */
        //通过公众号菜单直接进手机开门
        if (this.userInfoState.house) {
          /* boxThrisShow */
          if (this.userInfo.trueName) {
            let countDoor = 0;
            for (let i = 0; i < this.userInfo.resMyhouse.length; i++) {
              if (this.userInfo.resMyhouse[i].verifyStatus == 1) {
                this.openMaxIsShow = true;
                this.popupVisibleDoor = true;
                document.ontouchmove = function (e) {
                  e.stopPropagation();
                }; //开启窗口滑动
                if (this.doorList.length == 0) {
                  Indicator.open("门禁列表加载中...");
                  indexAxios.myDoorDevice(this.openId).then(res => {
                    Indicator.close();
                    that.doorList = res.data.data.Rows;
                  });
                }
              } else {
                countDoor++;
              }
            }
            let countDoor2 = 0;
            if (countDoor == this.userInfo.resMyhouse.length) {
              for (let i = 0; i < this.userInfo.resMyhouse.length; i++) {
                if (this.userInfo.resMyhouse[i].verifyStatus == 2) {
                  Toast("房屋信息正在审核，请耐心等待");
                } else {
                  countDoor2++;
                }
              }
              if (countDoor2 == this.userInfo.resMyhouse.length) {
                Toast("房屋信息已被驳回");
              }
            }
          } else {
            Toast("没有实名认证");
            this.loginMaxIsShow = true;
            this.boxThrisShow = true;
          }
        } else {
          // Toast("没有绑定房屋信息");
          this.loginMaxIsShow = true;
          this.boxTwoisShow = true;
        }
      } else if (this.pathState == 5) {
        this.popupVisibleMenu = true;
      } else if (this.pathState == 2) {
        if (this.userInfoState.house) {
          this.$router.push({ name: "repair" });
        } else {
          Toast("没有绑定房屋信息");
          this.loginMaxIsShow = true;
          this.boxTwoisShow = true;
        }
      } else if (this.pathState == 3) {
        this.$router.push({ name: "propertyPay" });
      } else if (this.pathState == 4) {
        this.$router.push({ name: "complainAnSuggest" });
      }
    } else {
      alert("未知的网络错误");
    }

    /* ------------------------------- */

    /* 这一段 if 我大概看了一下, 有可能 boxTwoisShow = true, 即出现 "房屋绑定" 框 */
    if (Util.GetUrlParam("router")) {
      if (Util.GetUrlParam("router") == "choosecommunity") {
        this.communityValue = this.$store.state.bindCommunityInfo.resiAreaName;
        this.resCode = this.$store.state.bindCommunityInfo.resCode;
        this.boxOneisShow = false;
        this.boxTwoisShow = true;
        this.boxThrisShow = false;
        this.loginMaxIsShow = true;
      } else if (Util.GetUrlParam("router") == "chooseHouse") {
        this.communityValue = this.$store.state.bindCommunityInfo.resiAreaName;
        this.houseValue = this.$store.state.bindHouseInfo.houseNumb;
        this.houseIdNow = this.$store.state.bindHouseInfo.houseId;
        this.boxOneisShow = false;
        this.boxThrisShow = false;

        if (!this.userInfoState.house) {
          this.boxTwoisShow = true;
          this.loginMaxIsShow = true;
        }
      }
    }

    /* 这一段 if 有可能让 loginMaxIsShow = true, 即出现 "实名认证" 框 */
    if (Util.GetUrlParam("type") && Util.GetUrlParam("type") == 0) {
      this.boxThrisShow = true;
      this.loginMaxIsShow = true;
      this.trueName = this.$store.state.trueName;
      this.messageSex = this.$store.state.sex;
    }

    /* 下面代码仅测试用 */
    // this.boxOneisShow = false
    // this.boxTwoisShow = false
    // this.boxThrisShow = false

    // setTimeout(() => {
    //   this.boxTwoisShow = true
    //   console.log('赋值 2');
    //   this.boxThrisShow = true
    //   console.log('赋值 3');
    // }, 1000)

  },
  /* 同时出现两个框框的临时解决方案 */
  watch: {
    boxOneisShow(value) {
      if (value) this.active(0)
    },
    boxTwoisShow(value) {
      // console.log('监听: 2')
      if (value) this.active(1)
    },
    boxThrisShow(value) {
      // console.log('监听: 3')
      if (value) this.active(2)
    },
  },
  computed: {
    userData: function () {
      return this.$store.state;
    }
  },
  methods: {
    active(index) {
      ['boxOneisShow', 'boxTwoisShow', 'boxThrisShow'].forEach((box, i) => {
        this[box] = (i === index)
      })
      this.loginMaxIsShow = true
    },

    menuOpen: function () {
      this.popupVisibleMenu = true;
    },
    faceBtn: function (type) {
      //改
      // window.location.href='upLoadFace.html'trueName

      if (type == 0) {
        this.$store.commit("setTrun", {
          trueName: this.trueName,
          sex: this.messageSex
        });
        this.$router.push({ path: "/upLoadFace", query: { type: 0 } });
      } else {
        this.$router.push({ path: "/upLoadFace", query: { type: 1 } });
      }
    },
    myRepairDrop: function () {
      this.$router.push({ name: "myRepair" });
    },
    myComplain: function () {
      this.$router.push({ name: "myComplain" });
    },
    dropChooseHouse: function () {
      let repairAddrItem = Util.GetUrlParam("repairAddr");
      if (repairAddrItem) {
        var url = decodeURI(location.href);
        var urlAll = url.split("?")[1];
        var urlItem = urlAll.split("&")[3];
        console.log(urlItem.split("="));
        repairAddrItem = urlItem.split("=")[1];
      } else {
        repairAddrItem = "";
      }
      let reCodeWeb = Util.GetUrlParam("resCode");
      let reOpenIds = Util.GetUrlParam("openId");
      console.log("dd" + repairAddrItem + reCodeWeb);
      if (repairAddrItem != "" && reCodeWeb != null) {
        console.log(repairAddrItem + "扫2");
        this.$router.push({
          name: "chooseHouse",
          query: {
            repairAddr: repairAddrItem,
            resCode: reCodeWeb,
            openId: reOpenIds
          }
        });
      } else {
        this.$router.push({ name: "chooseHouse" });
      }
    },
    dropChooseCommunity: function () {
      let repairAddrItem = Util.GetUrlParam("repairAddr");
      if (repairAddrItem) {
        var url = decodeURI(location.href);
        var urlAll = url.split("?")[1];
        var urlItem = urlAll.split("&")[3];
        console.log(urlItem.split("="));
        repairAddrItem = urlItem.split("=")[1];
      } else {
        repairAddrItem = "";
      }
      let reCodeWeb = Util.GetUrlParam("resCode");
      let reOpenIds = Util.GetUrlParam("openId");
      console.log("dd" + repairAddrItem + reCodeWeb);
      if (repairAddrItem != "" && reCodeWeb != null) {
        console.log(repairAddrItem + "扫1");
        this.$router.push({
          name: "chooseCommunity",
          query: {
            repairAddr: repairAddrItem,
            resCode: reCodeWeb,
            openId: reOpenIds
          }
        });
      } else {
        this.$router.push({ name: "chooseCommunity" });
      }
    },
    hide: function () {
      this.boxOneisShow = false;
      this.loginMaxIsShow = false;
    },
    boxOneDrop: function () {
      var that = this;
      if (!this.code) {
        Toast("验证码不能为空不能为空");
      } else if (!this.phone) {
        Toast("手机号码不能为空不能为空");
      } else {
        indexAxios.bindingPhone(
          this.phone,
          this.code,
          this.openId,
          this.headImage,
          this.nickName,
          1
        )
          .then(response => {
            if (response.data.info == "success") {
              console.log(response.data.data);
              if (response.data.data.resUserId) {
                that.$store.commit("alterResUserId", response.data.data.resUserId);
                that.$store.commit("setResUser", response.data.data);
              } else {
                that.$store.commit("setResUser", "");
              }
              that.userInfo = response.data.data;

              if (that.userInfo.resMyhouse[0]) {
                for (var i = 0; i < that.userInfo.resMyhouse.length; i++) {
                  if (that.userInfo.resMyhouse[i].isDefaultHouse == 1) {
                    that.nowHouse = that.userInfo.resMyhouse[i].houseAddr.split(
                      ","
                    )[1];
                  }
                }
                that.userInfoState.house = true;
                if (that.userInfo.trueName) {
                  that.userInfoState.trueName = true;
                }
              }
              if (that.pathState == 1) {
                if (that.userInfoState.house) {
                  if (that.userInfoState.trueName) {
                    that.boxOneisShow = false;
                    that.loginMaxIsShow = false;
                    let countDoor = 0;
                    for (let i = 0; i < that.userInfo.resMyhouse.length; i++) {
                      if (that.userInfo.resMyhouse[i].verifyStatus == 1) {
                        that.openMaxIsShow = true;
                        document.ontouchmove = function (e) {
                          e.stopPropagation();
                        };
                        if (that.doorList.length == 0) {
                          Indicator.open("门禁列表加载中...");
                          indexAxios.myDoorDevice(that.openId).then(res => {
                            Indicator.close();
                            that.doorList = res.data.data.Rows;
                          });
                        }
                      } else {
                        countDoor++;
                      }
                    }
                    var countDoor2 = 0;
                    if (countDoor == that.userInfo.resMyhouse.length) {
                      for (let i = 0; i < that.userInfo.resMyhouse.length; i++) {
                        if (that.userInfo.resMyhouse[i].verifyStatus == 2) {
                          Toast("房屋信息正在审核，请耐心等待");
                        } else {
                          countDoor2++;
                        }
                      }
                      if (countDoor2 == that.userInfo.resMyhouse.length) {
                        Toast("房屋信息已被驳回");
                      }
                    }
                  } else {
                    Toast("还未实名认证");
                    that.boxOneisShow = false;
                    that.boxThrisShow = true;
                  }
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              } else if (that.pathState == 2) {
                if (that.userInfoState.house) {
                  that.$router.push({ name: "repair" });
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              } else if (that.pathState == 3) {
                if (that.userInfoState.house) {
                  that.$router.push({ name: "propertyPay" });
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              } else if (that.pathState == 4) {
                if (that.userInfoState.house) {
                  that.$router.push({ name: "complainAnSuggest" });
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              } else if (that.pathState == 5) {
                if (that.userInfoState.house) {
                  that.popupVisibleMenu = true;
                  that.boxOneisShow = false;
                  that.boxTwoisShow = false;
                  that.boxThrisShow = false;
                  that.loginMaxIsShow = false;
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              } else {
                if (that.userInfoState.house) {
                  that.boxOneisShow = false;
                  that.loginMaxIsShow = false;
                } else {
                  that.boxOneisShow = false;
                  that.boxTwoisShow = true;
                }
              }
            } else {
              Toast(response.data.message);
            }
          })
          .catch(function (error) { });
      }
    },
    boxTwoDrop: function () {
      //登录流程第二步，绑定房屋
      let that = this;
      if (this.houseValue) {
        if (this.idenValue) {
          let resUserId = this.$store.state.resUser.resUserId;
          indexAxios.bindingHouse(resUserId, that.houseIdNow, that.idenValue)
            .then(response => {
              if (response.data.info == "success") {
                that.boxThrisShow = true;
                that.boxTwoisShow = false;
              } else if (response.data.info == "101") {
                Toast("该账户已被禁用，请联系物业管理员");
              } else if (response.data.info == "102") {
                Toast("用户已绑定了此房屋信息");
              } else {
                Toast(response.data.message);
              }
            })
            .catch(function (error) { });
        } else {
          Toast("请选择身份信息");
        }
      } else {
        Toast("房屋信息不能为空");
      }
    },
    boxThrDrop: function () {
      var that = this;
      let resUserId = this.$store.state.resUser.resUserId;
      if (!this.trueName || !this.sex) {
        Toast("请填写真实姓名及性别");
      } else {
        // alert('trueName:'+this.trueName+';sex:'+this.sex+';resUserId'+resUserId)
        indexAxios.RealNameAuthentication(this.trueName, this.sex, resUserId)
          .then(response => {
            if (response.data.info == "success") {
              if (this.pathState == 2) {
                that.updateUserInfo().then(
                  res => {
                    let userData = that.$store.state.resUser;
                    let paramsresCode = "";
                    for (let i = 0; i < userData.resMyhouse.length; i++) {
                      if (userData.resMyhouse[i].isDefaultHouse == 1) {
                        paramsresCode = userData.resMyhouse[i].resCode;
                        break;
                      }
                    }
                    // that.$store.commit("resCode_repair", paramsresCode);
                    let repairAddrItem = Util.GetUrlParam("repairAddr");
                    if (repairAddrItem) {
                      var url = decodeURI(location.href);
                      var urlAll = url.split("?")[1];
                      var urlItem = urlAll.split("&")[0];
                      console.log(urlItem.split("="));
                      repairAddrItem = urlItem.split("=")[1];
                    } else {
                      repairAddrItem = "";
                    }
                    let reCodeWeb = Util.GetUrlParam("resCode");
                    let reOpenIds = Util.GetUrlParam("openId");
                    console.log("dd" + repairAddrItem + reCodeWeb);
                    if (repairAddrItem != "" && reCodeWeb != null) {
                      console.log(repairAddrItem + "扫");
                      this.$router.push({
                        name: "repair",
                        query: {
                          repairAddr: repairAddrItem,
                          resCode: reCodeWeb,
                          openId: reOpenIds
                        }
                      });
                    } else {
                      that.$router.push({ name: "repair" });
                    }
                  },
                  error => {
                    console.log(error); // 执行失败的回调函数
                  }
                );
              } else if (that.$store.state.pathState == 3) {
                that.$router.push({ name: "propertyPay" });
              } else if (that.$store.state.pathState == 4) {
                that.$router.push({ name: "complainAndSuggest" });
              } else if (that.$store.state.pathState == 5) {
                that.popupVisibleMenu = true;
                that.boxOneisShow = false;
                that.boxTwoisShow = false;
                that.boxThrisShow = false;
                that.loginMaxIsShow = false;
              } else {
                Toast("信息提交成功，请等待审核");
                that.boxThrisShow = false;
                that.loginMaxIsShow = false;
                that.updateUserInfo();
              }
            } else {
              Toast(response.data.message);
            }
          })
          .catch(function (error) { });
      }
    },
    getCode() {
      //验证码倒计时
      var that = this;
      if (!this.phone) {
        Toast("手机号码不能为空");
      } else if (!(/(^[1][3-9][0-9]{9}$)|(^0[1][3-9][0-9]{9}$)/.test(this.phone) && this.phone.length == 11)) {
        Toast("请输入正确的手机号码");
      } else {
        indexAxios.sendCode(this.phone)
          .then(function (response) {
            var dataCode = response.data;
            if (dataCode.info == "success") {
              Toast("验证码已发送");
              const TIME_COUNT = 60;
              if (!that.timer) {
                that.count = TIME_COUNT;
                that.show = false;
                that.timer = setInterval(() => {
                  if (that.count > 0 && that.count <= TIME_COUNT) {
                    that.count--;
                  } else {
                    that.show = true;
                    clearInterval(that.timer);
                    that.timer = null;
                  }
                }, 1000);
              }
            } else {
              Toast(dataCode.message);
            }
          })
          .catch(function (error) { });
      }
    },
    openDoor: function (doorId, index) {
      if (this.current == -1) {
        var that = this;
        indexAxios.openDoor(doorId, that.idStatus, that.openId)
          .then(function (response) {
            if (response.data.info == "failure") {
              Toast(response.data.data.message);
            } else if (response.data.info == "success") {
              Toast("开门成功");
              that.current = index;
              var count = 0;
              if (!that.timer) {
                count = 5;
                that.timer = setInterval(() => {
                  if (count > 0) {
                    count--;
                  } else {
                    that.current = -1; //5s后关门
                    clearInterval(that.timer);
                    that.timer = null;
                  }
                }, 1000);
              }
            } else {
              Toast(response.data.message);
            }
          })
          .catch(function (error) { });
      } else {
        Toast("已是开门状态，请勿重复开门");
      }
    },
    updateUserInfo: function () {
      return new Promise((resolve, reject) => {
        AppAxios.WXPuser({ openId: this.$store.state.openId })
          .then(res => {
            let that = this;
            if (res.data.data.resUser) {
              this.$store.commit("setResUser", res.data.data.resUser);
            } else {
              this.$store.commit("setResUser", "");
            }
            resolve("ready");
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    openDoorBtn: function () {
      // console.log(window.localStorage.getItem('userInfo').smnUser)
      // if(window.localStorage.getItem('serviceIsOk')||JSON.parse(window.localStorage.getItem('userInfo')).smnUser){
      //     this.openMaxIsShow=true
      //     that.popupVisibleDoor=true
      //     document.ontouchmove = function(e){ e.stopPropagation(); };
      //     //房屋信息审核通过，打开手机开门列表，并加载门禁设备
      //     axios.get("api/cisp_res/wxp/WXP050100Unlock.do?method=myDoorDevice",{
      //         params: {
      //             openId:''
      //         }
      //     })
      //     .then(function (response) {
      //         console.log(response.data.data.Rows)
      //         that.doorList=response.data.data.Rows
      //         that.idStatus=2
      //     })
      //     .catch(function (error) {});
      // }else{
      var that = this;
      var userData = that.$store.state.resUser;
      // window.localStorage.setItem('pathStatus',1)
      // this.$store.commit("setPathState", 1);
      if (userData != "") {
        if (userData.resMyhouse[0]) {
          if (userData.trueName != "") {
            //有真实姓名有房屋信息则更新用户信息
            var countDoor = 0;
            for (let i = 0; i < userData.resMyhouse.length; i++) {
              if (userData.resMyhouse[i].verifyStatus == 1) {
                that.openMaxIsShow = true;
                that.popupVisibleDoor = true;
                document.ontouchmove = function (e) {
                  e.stopPropagation();
                };
                if (that.doorList.length == 0) {
                  Indicator.open("门禁列表加载中...");
                  //房屋信息审核通过，打开手机开门列表，并加载门禁设备
                  indexAxios.myDoorDevice(that.$store.state.openId)
                    .then(function (response) {
                      Indicator.close();
                      that.doorList = response.data.data.Rows;
                    })
                    .catch(function (error) { });
                  break;
                }
              } else {
                countDoor++;
              }
            }
            var countDoor2 = 0;
            if (countDoor == userData.resMyhouse.length) {
              for (var i = 0; i < userData.resMyhouse.length; i++) {
                console.log(userData.resMyhouse[i].verifyStatus);
                if (userData.resMyhouse[i].verifyStatus == 2) {
                  Toast("房屋信息正在审核，请耐心等待");
                } else {
                  countDoor2++;
                }
              }
              if (countDoor2 == userData.resMyhouse.length) {
                Toast("房屋信息已被驳回");
              }
            }
            that.updateUserInfo();
          } else {
            that.updateUserInfo();
            Toast("还未实名认证");
            that.boxOneisShow = false;
            that.boxTwoisShow = false;
            that.boxThrisShow = true;
            that.loginMaxIsShow = true;
          }
        } else {
          Toast("没有绑定房屋信息");
          that.loginMaxIsShow = true;
          that.boxTwoisShow = true;
        }
      } else {
        Toast("请先注册用户");
        that.loginMaxIsShow = true;
        that.boxOneisShow = true;
      }
      // }
    },
    repairBtn: function () {
      // if(window.localStorage.getItem('serviceIsOk')||JSON.parse(window.localStorage.getItem('userInfo')).smnUser){
      //     Toast('物业端报修功能正在火速开发')
      // }else{
      // window.localStorage.setItem('pathStatus',2)
      let userData = this.$store.state.resUser;
      let resUserId = this.$store.state.resUserId;
      if (userData) {
        if (userData.resMyhouse[0]) {
          let paramsresCode = "";
          for (let i = 0; i < userData.resMyhouse.length; i++) {
            if (userData.resMyhouse[i].isDefaultHouse == 1) {
              paramsresCode = userData.resMyhouse[i].resCode;
              break;
            }
          }
          this.$store.commit("resCode_repair", paramsresCode);
          this.$router.push({ name: "repair" });
        } else {
          Toast("没有绑定房屋信息");
          this.loginMaxIsShow = true;
          this.boxTwoisShow = true;
        }
      } else {
        Toast("请先注册");
        this.loginMaxIsShow = true;
        this.boxOneisShow = true;
      }
      // }
    },
    dropMyInfo: function () {
      // window.location.href='myInfo.html'
      this.$router.push({ name: "myInfo" });
    },
    propertyPayBtn: function () {
      //  window.location.href="https://wx-api.qdingnet.com/qds-harbor/audit/userAuthCheck?appId=wx10b3f1096db3fee0&mchId=1523886861&method=propertyFee"
      // if(this.$store.state.serviceIsOk ||JSON.parse(window.localStorage.getItem('userInfo')).smnUser){
      //     Toast('正在火速开发')
      // }else{
      let userData = this.$store.state.resUser;
      if (userData) {
        if (userData.resMyhouse[0]) {
          this.$router.push({ name: "propertyPay" });
        } else {
          Toast("没有绑定房屋信息");
          this.loginMaxIsShow = true;
          this.boxTwoisShow = true;
          this.boxOneisShow = false;
        }
      } else {
        Toast("请先注册");
        this.loginMaxIsShow = true;
        this.boxOneisShow = true;
      }
      // }
    },
    complainAndSuggest: function () {
      // if(window.localStorage.getItem('serviceIsOk')||JSON.parse(window.localStorage.getItem('userInfo')).smnUser){
      //     Toast('正在火速开发')
      // }else{
      let userData = this.$store.state.resUser;
      if (userData) {
        if (userData.resMyhouse[0]) {
          this.$router.push({ name: "complainAndSuggest" });
        } else {
          Toast("没有绑定房屋信息");
          this.loginMaxIsShow = true;
          this.boxTwoisShow = true;
          this.boxOneisShow = false;
        }
      } else {
        Toast("请先注册");
        this.loginMaxIsShow = true;
        this.boxOneisShow = true;
      }
      // }
    },
    dropMyHouse: function () {
      this.$router.push({ name: "myHouse", query: { router: "index" } });
    },
    applyVisit: function () {
      this.$router.push({ name: "applyVisit" });
    },
    visitRecord: function () {
      this.$router.push({ name: "visitRecord" });
    }
  }
};
</script>
<style lang="less">
.mint-indicator {
  z-index: 3000;
}
.mint-indicator-wrapper {
  z-index: 3001;
}
.mint-toast {
  position: fixed;
  max-width: 80%;
  // border-radius: 5px;
  // background: rgba(0, 0, 0, 0.7);
  // color: #fff;
  // box-sizing: border-box;
  // text-align: center;
  z-index: 3000 !important;
  // -webkit-transition: opacity .3s linear;
  // transition: opacity .3s linear;
}
</style>

 <style lang="less" scoped>
@import "../assets/less/index.less";
</style>