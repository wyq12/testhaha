<template>
   <div><!--style="padding: 0.9rem 1.3rem;" -->
      <span class="menuBtn" @click='invoice'>开发票</span>
      <div style="padding: 0.9rem 1.3rem;">

        <div class="payBg" >
            <div class="pageIit" style="display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;">物业缴费</div>
            <div class="payTit">
                <div style=" display: flex;
                justify-content: center;
                width: 80%;
                line-height: 1.4rem;
                font-size: 15px;">
                    缴费房址：
                    <span style="width: 65%;" >{{nowHouse.split(",")[1]}}</span>
                </div>
                <div class="toggleAddr" @click=changHouse>切换</div>
                <!-- <span @click=changHouse style="width: 20%;text-align: right;color: #72beff;font-size: 15px;">切 换</span> -->
            </div>

            <div class="payMain" style="color:#808080">
                <div class="payItem" v-for="(item, index) in payItem" :key="index">
                    <div style="width: 100%;
                    height: 2rem;
                    display: flex;
                    /* background-color: rgb(53, 137, 248); */
                    color: #606060;
                    align-items: center;
                    border-bottom: 1px solid rgba(114, 190, 255, 0.45);
                    border-top: 1px solid rgba(114, 190, 255, 0.45);    margin-bottom: 1rem;
    margin-top: 1rem;"><input  type="checkbox" v-model='checkList' :value="{ 'amounts': item.amount, 'feeNos': item.pptFeeNo }" style="width: 16px;height: 16px;margin-left: 1rem;"><span style="    width: 80%;
    font-size: 14px;
    margin-left: .5rem;">{{item.feeStartDate}}</span></div>
                    <div v-for="(item1, index1) in item.item" style="padding-left: 10px;display: flex;justify-content: flex-end;padding: 10px;font-size: 14px">
                        <span style="width: 70%;">{{item1.feeItemName}}</span>
                        <span style="width: 25%;text-align: right;">{{item1.amount}}</span>
                    </div>
                    <div v-for="(item2, index2) in item.late" v-show="item2.amount!=0"  style="padding-left: 10px;display: flex;font-size: 14px;justify-content: flex-end;padding: 10px;">
                        <span style="width: 70%;">{{item2.lateName}}</span>
                        <span style="width: 25%;text-align: right;">{{item2.amount}}</span>
                    </div>
                </div>
            </div>


            <div v-show="!showBtn" style="text-align:center;margin-top: 2rem;color: #808080;">暂无账单</div>
        </div>
      </div>
      <div v-show="showBtn" class="paySumbit payFootBox">
                <!-- <mt-button type="primary" style="font-size: 14px;" @click='payOrder'>立即支付</mt-button> -->
          <div v-show="showBtn" style="margin-left:10px;">
            <input type="checkbox" :checked="checkAll" :value="checkAll" @click="handleCheckAll()">全选
            <div>总计：￥{{ sumValue }}</div>
          </div>
          <mt-button type="primary"  @click='payOrder' style="border-radius:0;">立即支付</mt-button>
      </div>

    </div>

</template>

<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import {
  queryPptBillPort,
  isPayPort,
  paySourceWay,
  queryResConfig,
  queryEsQueryBill
} from "@/api/propertyPay";
export default {
  data() {
    return {
      seacherValue: "",
      value: [],
      value1: [],
      options: [],
      sumValue: 0,
      payItem: [],
      checkList: [],
      feeNos: "",
      amounts: "",
      userInfo: "",
      openId: "",
      nowHouse: "",
      latePay: [],
      showBtn: true,
      resCode: "",
      checkAll:false,
      houseId:''
    };
  },
  created: function() {
    // let countId=Util.GetUrlParam("countId");
    var self = this;
    var houseId = "";
    this.userInfo = this.$store.state.resUser;
    // window.localStorage.setItem('isBindHouse','true')
    for (var i = 0; i < self.userInfo.resMyhouse.length; i++) {
      if (self.userInfo.resMyhouse[i].isDefaultHouse == 1) {
        houseId = self.userInfo.resMyhouse[i].houseId;
        self.nowHouse = self.userInfo.resMyhouse[i].houseAddr;
        self.resCode = self.userInfo.resMyhouse[i].resCode;
      }
    }
    console.log(self.resCode);
    self.openId = this.userInfo.openId;
    self.houseId = houseId;
    queryResConfig({ resCode: self.resCode, type: "propertyFeeWay" })
      .then(res => {
        if (res.data.data == "1") {
          queryEsQueryBill({ houseId: houseId })
            .then(res => {
              self.payItem = res.data.data;
              for (var i = 0; i < res.data.data.length; i++) {
                self.options.push(res.data.data[i].feeStartDate);
              }
              if (self.options.length == 0) {
                self.showBtn = false;
              }
            })
            .catch(function() {});
        } else {
          queryPptBillPort({ houseId: houseId })
            .then(res => {
              self.payItem = res.data.data;
              for (var i = 0; i < res.data.data.length; i++) {
                self.options.push(res.data.data[i].feeStartDate);
              }
              if (self.options.length == 0) {
                self.showBtn = false;
              }
            })
            .catch(function() {});
        }
      })
      .catch(function() {});
  },

  methods: {
    payOrder: function() {
      var that = this;
      if (this.feeNos.length == 0) {
        Toast("未选取账单");
      } else {
        isPayPort({ type: "WXWY", feeNos: this.feeNos })
          .then(res => {
            var sumbitSum = Math.round(that.sumValue * 1000) / 10;
            if (res.data.info == "success") {
              window.location.href =
                "/cisp_res/wxp/WXP070200Pay.do?method=paySourceWay&type=WXWY&openId="+
                that.openId +
                '&feeNos='+
                that.feeNos +
                "&amounts=" +
                that.amounts +
                "&totalFee=" +
                sumbitSum +
                "&resCode=" +
                that.resCode+
                "&houseId=" + that.houseId;
              // window.location.href='/cisp_res/apps/wxPay.jsp?type=WXWY&openId='+that.openId+'&feeNos='+that.feeNos+'&amounts='+that.amounts+'&totalFee='+sumbitSum
              // window.location.href='/cisp_res/apps/xmyhWxPay.jsp?type=WXWY&openId='+that.openId+'&feeNos='+that.feeNos+'&amounts='+that.amounts+'&totalFee='+sumbitSum
              //    paySourceWay({type:'WXWY',openId:that.openId,feeNos:that.feeNos,amounts:that.amounts,totalFee:sumbitSum,resCode:that.resCode}).then(res=>{}) .catch(function(error){})
            } else {
              console.log(that);
              alert("选取订单中有已被支付订单，点击确定将重新获取");
              that.$router.push({ name: "propertyPay" });
              //重新进入页面
            }
          })
          .catch(function(error) {});
      }
    },
    checkon: function() {},
    changHouse: function() {
      // window.location.href='myHouse.html?router=propertyPay'
      this.$router.push({ name: "myHouse", query: { router: "propertyPay" } });
    },
     handleCheckAll(){
           let arr = [];
           console.log(this.checkAll)
           this.checkAll  = !this.checkAll;
           console.log(this.checkAll)
           if(this.checkAll){
             for(let i = 0;i< this.payItem.length;i++){
                let obj = {'amounts':this.payItem[i].amount,'feeNos':this.payItem[i].pptFeeNo};
                arr.push(obj)
             }
              this.checkList = arr;
           }else{
             this.checkList = [];
           }
       },
    invoice:function(){
        this.$router.push({ name: "invoiceProviding"});
    }
  },
  watch: {
    checkList(val, e) {
      // this.payList=val
      // if(val.length<4){
      var result = 0;
      this.feeNos = "";
      this.amounts = "";
       if(val.length < this.payItem.length){
          this.checkAll  = false;
          console.log(false)
        }else{
          this.checkAll  = true;
          console.log(true)
        }
      for (var i = 0; i < val.length; i++) {
        this.feeNos = this.feeNos + "," + val[i].feeNos;
        this.amounts = this.amounts + "," + val[i].amounts;
        result += val[i].amounts;
        // console.log(result);
      }
      this.sumValue = Math.round(result * 1000) / 1000;
      if (this.feeNos.substr(0, 1) == ",") {
        this.feeNos = this.feeNos.substr(1);
      }
      if (this.amounts.substr(0, 1) == ",") {
        this.amounts = this.amounts.substr(1);
      }
      console.log(this.sumValue * 100);
    }
  }
};
</script>

<style lang="less"  scoped>
.payBg {
  margin-bottom: 30px;
  box-shadow: rgb(153, 153, 153) 0px 0px 5px;
  padding-bottom: 2rem;
  min-height: 21rem;
  background-image: url("../../static/images/propertyPayBg.png");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%;
}
.toggleAddr {
  background-image: url("../../static/images/myhouseBtn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 0px;
  border: none;
  color: rgb(128, 128, 128);
  padding: 5px;
  width: 2rem;
  padding-right: 10px;
  padding-left: 15px;
  font-size: 12px;
}
.payTit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #fff;
  padding: 0.75rem 0.85rem;
  font-size: 12px;
  background-color: #fafafa;
  background-image: url("../../static/images/myhousebg.png");
  padding-right: 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: rgb(255, 255, 255);
  /* position: absolute;
            top: 0px; */
}
.mint-cell-wrapper {
  background-image: none;
  background-color: #d7f1ff;
  font-weight: bold;
  padding-left: 0;
}
.mint-cell:last-child {
  background-image: none;
}
.mint-checkbox-label {
  vertical-align: middle;
  margin-left: 0px;
}
// .orderSum{
//     padding-left: 24px;
//     padding-top: 50px;
// }
.pageIit {
  background-image: url("../../static/images/wave_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 5.474rem;
}
.payFootBox {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  border-top:1px solid silver;
  display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
  display: -webkit-flex;     /* 新版本 - 适配Chrome */
  display: flex;             /* 新版本,- 适配Opera 12.1, Firefox 20+ */
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  font-size: 14px;
  // background-image: -webkit-linear-gradient(0deg, #72beff, #518dea);
}
.menuBtn{
    position: absolute;
    right: 0rem;
    /* background-color: rgb(153, 153, 153); */
    top: 2.3rem;
    background-image: url("../../static/images/btn_bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 3.2rem;
    height: 1.6rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    bottom: 2rem;
}
</style>
