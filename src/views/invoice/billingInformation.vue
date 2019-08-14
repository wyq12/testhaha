<template>
  <div class="invoicInBox">
    <div class="headers">
      <span>请填写开票信息</span>
    </div>
    <div class="billContain" style="margin-bottom:15px;">
      <div class="newslist">
        <div class="information p" ref="liCon">
          <div class="flex">
            <span>发票类型</span>
            <span>电子发票</span>
          </div>
          <div class="flex">
            <span>抬头类型</span>
            <!-- <mt-radio v-model="selectValue" :options="options"></mt-radio> -->
            <mt-radio v-model="selectValue" :options="options" class="my-radio"></mt-radio>
            <!-- <span>{{selectValue}}</span> -->
          </div>
          <div class="flex">
            <span>发票抬头</span>
            <div style="margin: 8px 0; min-height: 25px;">
              <input
                type="text"
                v-model="invoiceTitle"
                style="margin-right:5px; position: relative;"
                placeholder="抬头名称"
              />
              <!-- <ul style="position:absolute;left:10px;top:10px;background-color:red;">
                <li
                  v-for="(item,index) in TitleItems"
                  :key="index"
                  :value="item.value"
                  v-text="item.CName"
                ></li>
                1234656757
              </ul> -->
              <!-- <div class="selectT" @click="popupTit">
                <img src="../../../static/images/goBtn.png" alt />
              </div>-->
            </div>
          </div>
          <!-- 企业的开发票不用到-->
          <!-- <template v-if="selectValue=='02'">
            <div class="flex">
              <span>税号</span>
              <input type="text" v-model="paragraph" placeholder="纳税人识别号" />
            </div>
            <div class="flex">
              <span>开户银行</span>
              <input type="text" v-model="depositBank" placeholder="选填" />
            </div>
            <div class="flex">
              <span>银行帐号</span>
              <input type="text" v-model="bankAccount" placeholder="选填" />
            </div>
            <div class="flex">
              <span>企业地址</span>
              <input type="text" v-model="businessAddress" placeholder="选填" />
            </div>
            <div class="flex">
              <span>企业电话</span>
              <input type="text" v-model="bussinessPhone" placeholder="选填" />
            </div>
          </template>-->
          <!-- <div>
            <span>设置为默认抬头</span>
            <mt-checklist
              align="right"
              v-model="isDefaultT"
              :value="isDefaultT"
              :options="options2"
            ></mt-checklist>
            <mt-radio align="right" title="设置为默认抬头"  v-model="isDefaultT" :options="options2"></mt-radio>
          </div>-->
        </div>
        <template v-if="selectValue=='02'">
          <div class="open" @click="open()">
            <div v-if="openFlag">【展开】</div>
            <div v-else>【收缩】</div>
          </div>
        </template>
      </div>
    </div>
    <div class="billContain" style="margin-bottom:45px;">
      <div class="flex">
        <span>接收邮箱</span>
        <input type="text" v-model="imap" placeholder="必填" />
      </div>
      <div class="flex">
        <span>收件人</span>
        <input type="text" v-model="recipients" placeholder="选填" />
      </div>
      <div class="flex">
        <span>联系电话</span>
        <input type="text" v-model="contactNumber" placeholder="选填" />
      </div>
      <!-- <div class="flex">
        <span>所在地区</span>
        <input type="text" v-model="region" placeholder="选填" />
        <div class="selectT" @click="popupTit">
          <img src="../../../static/images/goBtn.png" alt />
        </div>
      </div>-->
    </div>
    <button class="footerBtn" @click="makeInvoice()">开票</button>
    <mt-popup v-model="popupVisibleDoor" position="bottom" style="width:100%">
      <div class="openDoorMax" v-if="openMaxIsShow">
        <div class="openDoorBox">
          <div class="openDoorTopBg">
            <!-- <p class="faceBtnBox">
                            <span class="faceBtn" @click='faceBtn(1)'>开通人脸开门</span>
            </p>-->
            <!-- <img  @click='closeDoorList' src="images/doorClose.png" style="width: 2rem;height: 2rem"> -->
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import {
  esInvoice,
  esInvoiceHistoryForm,
  queryEsRecordFeeId,
  queryInvoiceCname
} from "@/api/invoice.js";
import Util from "@/libs/util.js";
import Vue from "vue";
export default {
  data() {
    return {
      newslist: [
        { content: "hahhahahhhhhhh", openFlag: true },
        { content: "hahhahahhhhhhh", openFlag: true }
      ],
      liConHeight: 160, // 两行文字的高度
      options: [
        {
          label: "个人",
          value: "01"
        }
        // {
        //   label: "企业",
        //   value: "02"
        // }
      ],
      selectValue: "01", //抬头类型
      invoiceTitle: "", //发票抬头
      items: [],
      paragraph: "", //税号
      openMaxIsShow: false,
      popupVisibleDoor: false,
      depositBank: "", //开户银行
      bankAccount: "", //银行帐号
      businessAddress: "", //企业地址
      bussinessPhone: "", //企业电话
      isDefaultT: [], //是否为默认抬头
      options2: [{ label: "设置为默认抬头", value: "01" }],
      openFlag: true, //展开、收缩
      imap: "", //接收邮件
      recipients: "", //收件人
      contactNumber: "", //联系电话
      region: "",
      feeId: "",
      houseId: "",
      feePayCategory: "",
      loading1: false
    };
  },
  created() {
    // console.log(this.$store.state);
    //查询feesNo来获取feeId
    let that = this;
    var rfeesNo = Util.GetUrlParam("feesNo");
    if (rfeesNo != null) {
      var rfeesNo = decodeURIComponent(rfeesNo);
      that.feesNo = rfeesNo;
    }
    queryEsRecordFeeId({ feesNo: this.feesNo }).then(res => {
      this.feeId = res.data.data;
      if (res.data.info === "failure") {
        Toast("数据未及时返回");
        return;
      }else if (res.data.data === "NO") {
        // Toast("不可开票");
        this.$router.push({ path: "/onlineInvoicing", query: {} });
      }
    });
    //进入页面时获取发票抬头和邮箱渲染在页面
    let params = {
      openId: this.$store.state.openId
    };
    esInvoiceHistoryForm(params).then(res => {
      // this.invoiceTitle = res.data.data.cName;
      this.imap = res.data.data.email;
      this.invoiceTitle = this.$store.state.resUser.trueName;
    });
  },
  methods: {
    open() {
      const liCon = this.$refs.liCon;
      var height = liCon.offsetHeight;
      if (height === this.liConHeight) {
        // 展开
        liCon.style.height = "auto";
        height = liCon.offsetHeight;
        liCon.style.height = this.liConHeight + "px";
        var f = document.body.offsetHeight; // 必加
        liCon.style.height = height + "px";
      } else {
        // 收缩
        liCon.style.height = this.liConHeight + "px";
      }
      if (!this.openFlag) {
        this.openFlag = true;
      } else {
        this.openFlag = false;
      }
    },
    popupTit() {
      this.openMaxIsShow = true;
      this.popupVisibleDoor = true;
      document.ontouchmove = function(e) {
        e.stopPropagation();
      };
    },
    //开票
    makeInvoice() {
      let params = {
        openId: this.$store.state.openId,
        houseId: Util.GetUrlParam("houseId"),
        feePayCategory: Util.GetUrlParam("feePayCategory"),
        feeId: this.feeId,
        phone: this.$store.state.resUser.mphone,
        mailbox: this.imap,
        type: this.selectValue,
        cName: this.invoiceTitle,
        cTaxpayerNo: this.paragraph,
        cAddress: this.region,
        cPhone: this.contactNumber,
        cBankName: this.depositBank,
        cBankNo: this.bankAccount
      };
      // alert(JSON.stringify(params))

      if (this.selectValue == "01") {
        if (!params.cName) {
          Toast("请填写发票抬头");
          return;
        }
        // if (!params.cTaxpayerNo) {
        //   Toast("请填写税号");
        //   return;
        // }
        if (
          params.mailbox.match(
            /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
          ) === null
        ) {
          Toast("请填写正确的接收邮箱");
          return;
        }
      }
      // } else {
      //   if (!this.invoiceTitle) {
      //     Toast("请填写发票抬头");
      //     return;
      //   }
      //   if (!this.imap) {
      //     Toast("请填写接收邮箱");
      //     return;
      //   }
      // }

      esInvoice(params).then(res => {
        console.log("params :", params);
        console.log(res.data);
        if (res.data.info === "success") {
          Toast("提交成功");
          this.$router.push({ path: "/invoiceHistory", query: {} });
          // return;
        } else {
          Toast("开票失败或已开过该发票");
          return;
        }
      });
    }
    // //发票抬头模糊查询
    // invoiceTitle() {
    //   queryInvoiceCname({
    //     openId: this.$store.state.openId,
    //     cName: this.invoiceTitle,
    //     feePayCategory: Util.GetUrlParam("feePayCategory"),
    //     type: this.selectValue
    //   }).then(res => {
    //     console.log(" zzz:", res.data.data);
    //     // this.loading1 = false;
    //     this.invoiceTitle = res.data.data.CName;
    //   });
    // }
  },
  // computed: {
  //   TitleItems() {
  //     var _this = this;
  //     var TitleItems = [];
  //     queryInvoiceCname({
  //       openId: this.$store.state.openId,
  //       cName: this.invoiceTitle,
  //       feePayCategory: Util.GetUrlParam("feePayCategory"),
  //       type: this.selectValue
  //     }).then(res => {
  //       console.log(" zzz:", res.data.data);
  //       // this.loading1 = false;
  //       this.items = res.data.data.CName;
  //     });
  //   }
  // }
};
</script>
<style lang="less">
.invoicInBox .mint-radiolist {
  display: flex;
  justify-content: space-between;
}
.invoicInBox .mint-cell-wrapper {
  padding: 0 !important;
  font-size: 15px;
}
// .invoicBox .mint-cell .mint-radiolist-label{
//    padding: 0 0 0 10px ;
//  }
.invoicInBox .mint-cell .mint-radiolist-label {
  padding: 0 0 0 5px;
}
.invoicInBox .mint-cell {
  min-height: 0;
}
.invoicInBox .mint-checklist-label {
  padding: 0;
}
.invoicInBox .mint-checkbox-label,
.invoicInBox .mint-radio-label {
  margin-left: 0;
}
.invoicInBox .mint-radiolist-title {
  margin: 0;
}
</style>

<style lang="less" scoped>
@import "../../assets/less/index.less";
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  min-height: 25px;
}
input {
  border: none;
  outline: none;
  text-align: right;
}
.invoicInBox {
  width: 100%;
  height: 100%;
  background-color: #f5f9fc;
  flex: 1;
  font-size: 15px;
}
.headers {
  width: 90%;
  height: 45px;
  line-height: 45px;
  padding: 0 1rem;
}
.billContain {
  background-color: #ffffff;
  border-radius: 1rem;
  margin: 0 15px;
  padding: 0.5rem 0.8rem;
}
.selectT {
  width: 15px;
  height: 20px;
  & img {
    width: 100%;
    height: 100%;
  }
}
.newslist .p {
  font-size: 14px;
  color: #555;
  line-height: 25px;
  height: 120px;
  overflow: hidden;
  transition: height 0.3s;
}
.open {
  text-align: center;
  margin-top: 5px;
}
.footerBtn {
  position: fixed;
  bottom: 0;
  background-color: #26a2ff;
  width: 100%;
  height: 40px;
  color: #ffffff;
  border: none;
  outline: none;
}
.my-radio /deep/ .mint-radio-core {
  display: none;
}
</style>

