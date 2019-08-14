<template>
  <div class="invoicBox">
    <div class="headers">
      <!-- <span>请选择缴费记录</span> -->
      <span></span>
      <span @click="history">开票历史</span>
    </div>
    <div class="billContain">
      <!-- <div v-if="billArr.length<=0" style="text-align:center;">暂无数据....</div> -->
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li class="billList" v-for="(item , index) in billArr" :key="index">
          <div class="billListHead">
            <div>
              <!-- <input
                type="checkbox"
                v-model="checkBill"
                :value="{amount:item.amount,billOrder:item.billOrder}"
              /> -->
              <span>{{item.payDate}}</span>
            </div>
            <div @click="showToggle(item,index)" style="display:flex;align-items:center;">
              <span style="margin-right:15px;">￥{{item.amount}}</span>
              <img src="../../../static/images/jiantou.png" alt style="width:0.6rem;height:1.2rem;" />
            </div>
          </div>
          <ul
            v-show="item.isSubShow"
            v-for="(monthItems, monthIndexs) in item.monthlyBill"
            :key="monthIndexs"
            style="padding: 0 20px;"
          >
            <li>
              <div class="paddings monthS">{{monthItems.feeStartDateL}}</div>
              <ul v-for="(items, indexs) in monthItems.subItems" :key="indexs">
                <li class="billListCon paddings">
                  <span>{{items.feeItemName}}</span>
                  <span>￥{{items.amount}}</span>
                </li>
              </ul>
              <ul v-for="(lateItems, lateIndexs) in monthItems.late" v-show="lateItems.amount!=0">
                <li class="billListCon paddings">
                  <span>{{lateItems.lateName}}</span>
                  <span>￥{{lateItems.amount}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <div v-if="loading" class="loading-box">
          <span style="margin-right:10px;">加载中...</span>
          <mt-spinner type="snake" color="#26a2ff"></mt-spinner>
        </div>

        <div v-if="!loading" class="loading-box">没有更多数据</div>
      </ul>
    </div>
    <!-- <div class="billFooter">
      <div>
        <input type="checkbox" :checked="checkAll" :value="checkAll" @click="handleCheckAll()" />全选
        <div>已选中{{billSum}}账单 共{{billToTalMoney}}元</div>
      </div>
      <button class="nextBtn" @click="next()">下一步</button>
    </div> -->
  </div>
</template>

<script>
import { Toast, InfiniteScroll } from "mint-ui";
import Util from "@/libs/util.js";
import { esQueryHistoryBill, esInvoiceHistoryForm } from "@/api/invoice";
import { Popup, Indicator } from "mint-ui";
import { infiniteScroll } from "mint-ui";
export default {
  data() {
    return {
      checkBill: [],
      billArr: [],
      checkAll: false, //全选
      billSum: 0, //已选择几条账单
      billToTalMoney: 0, //已选择账单总金额
      openId: "",
      houseId: "",
      resCode: "",
      userInfo: {},
      isLoad: true,
      loading: false,
      page: 1
    };
  },
  watch: {
    checkBill(val) {
      console.log(val);
      var result = 0;
      this.billSum = val.length;
      this.billToTalMoney = 0;
      if (val.length < this.billArr.length) {
        this.checkAll = false;
      } else {
        this.checkAll = true;
      }
      for (var i = 0; i < val.length; i++) {
        result += val[i].amount;
        console.log(result);
        this.billToTalMoney = result;
      }
    }
  },
  created: function() {
    Indicator.open({
      spinnerType: "fading-circle"
    });
    var that = this;
    that.userInfo = that.$store.state.resUser;
    for (var i = 0; i < that.userInfo.resMyhouse.length; i++) {
      if (that.userInfo.resMyhouse[i].isDefaultHouse == 1) {
        that.houseId = that.userInfo.resMyhouse[i].houseId;
        that.resCode = that.userInfo.resMyhouse[i].resCode;
      }
    }
    that.openId = that.userInfo.openId;
    // that.getHistoryBill()
  },

  methods: {
    loadMore() {
      this.$nextTick(() => {
        console.log(this.isLoad);
        if (!this.isLoad) {
          return;
        }
        this.loading = true;
        this.getHistoryBill();
      });
    },
    getHistoryBill() {
      let that = this;
      esQueryHistoryBill({
        houseId: that.houseId,
        openId: that.openId,
        page: that.page,
        pageSize: 10
      })
        .then(res => {
          Indicator.close();
          this.loading = false;
          let rtnData = res.data;
          if (rtnData.data.Rows.length > 0) {
            that.billArr = [...that.billArr, ...rtnData.data.Rows];
            console.log(that.billArr);
          } else {
            that.isLoad = false;
          }
          if (that.billArr.length >= rtnData.data.Total) {
            that.isLoad = false;
          }
          that.page++;
        })
        .catch(error => {});
    },
    handleCheckAll() {
      let arr = [];
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        for (let i = 0; i < this.billArr.length; i++) {
          let obj = {
            amount: this.billArr[i].amount,
            billOrder: this.billArr[i].billOrder
          };
          arr.push(obj);
        }
        this.checkBill = arr;
      } else {
        this.checkBill = [];
      }
    },
    next() {
      if (!this.billSum) {
        Toast("请选择要开具发票的缴费单");
      } else {
        this.$router.push({ path: "/billingInformation", query: {} });
      }
    },
    history() {
      this.$router.push({ path: "/invoiceHistory" });
    },
    showToggle: function(item, ind) {
      this.billArr.forEach(i => {
        // 判断如果数据中的menuList[i]的show属性不等于当前数据的isSubShow属性那么menuList[i]等于false
        if (i.isSubShow !== this.billArr[ind].isSubShow) {
          i.isSubShow = false;
        }
      });
      item.isSubShow = !item.isSubShow;
    }
  }
};
</script>

<style lang="less" scoped>
.paddings {
  padding: 8px 0;
}
.invoicBox {
  width: 100%;
  height: 100%;
  //  background-color: #f5f9fc;
  background-image: url("../../../static/images/propertyPayBg.png");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%;
  flex: 1;
  font-size: 15px;
}
.billContain {
  margin-bottom: 44px;
  margin-top: 50px;
}
.headers {
  width: 90%;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  height: 45px;
  line-height: 45px;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 5px;
}
.billList {
  //  background-color: #ffffff;
  //  padding: .5rem  0.7rem;
  margin-bottom: 10px;
}
.billListHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  line-height: 60px;
  padding: 0 0.7rem;
  // border-bottom: 1px solid rgba(114, 190, 255, 0.45);
  background-color: #f5f9fc;
}
.billListCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #818181;
}
.billFooter {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45px;
  border-top: 1px solid #eeeeee;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}
.nextBtn {
  width: 4rem;
  height: 1.5rem;
  background-color: #26a2ff;
  color: white;
  line-height: 1.5rem;
  text-align: center;
  border: none;
  outline: none;
}
.monthS {
  border-top: 1px solid rgba(114, 190, 255, 0.45);
  border-bottom: 1px solid rgba(114, 190, 255, 0.45);
}
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  font-size: 16px;
  color: #666666;
}
</style>
