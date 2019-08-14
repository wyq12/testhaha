<template>
  <div class="invoicBox">
    <!-- <div class="headers">
          <span>请选择缴费记录</span>
          <span>开票历史</span>
    </div>-->
    <div class="billContain">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li
          class="billList"
          v-for="(item , index) in billArr"
          :key="index"
          @click="invoiceDetail(item.status, item.id)"
        >
          <div class="billListHisHead">
            <mt-cell v-bind:title="item.createTime" is-link>
              <span>{{ item.statusText}}</span>
              <img slot="icon" src="../../../static/images/invoiceTime.png" width="14" height="14" />
            </mt-cell>
          </div>

          <div>
            <div class="billListCon">
              <span>电子发票</span>
              <span></span>
            </div>
            <div class="billListCon">
              <span>{{item.feePayCategory}}:</span>
              <span>
                <span style="font-size:18px;color:black;">{{item.totalAmount}}</span> 元
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="loading" class="loading-box">
      <span style="margin-right:10px;">加载中...</span>
      <mt-spinner type="snake" color="#26a2ff"></mt-spinner>
    </div>

    <div v-if="!loading" class="loading-box">没有更多数据</div>
  </div>
</template>

<script>
import { Toast, InfiniteScroll } from "mint-ui";
import { queryInvoiceHistory } from "@/api/invoice.js";
import Util from "@/libs/util.js";
import { WXnickPort } from "@/api/myInfo";
export default {
  data() {
    return {
      // checkBill: [],
      billArr: [],
      loading: false,
      // checkAll: false, //全选
      // billSum: 0, //已选择几条账单
      // billToTalMoney: 0 //已选择账单总金额
      openId: "",
      houseId: "",
      resCode: "",
      userInfo: {},
      isLoad: true,
      loading: false,
      page: 1,
      invoiceStatusDict: [],
      statusId:""
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
        result += val[i].money;
        console.log(result);
        this.billToTalMoney = result;
      }
    }
  },
  created: function() {
    //开票的历史记录
    queryInvoiceHistory({ openId: this.$store.state.openId }).then(res => {
      console.log("查看历史记录", res);
      let data = JSON.parse(res.data.data);
      console.log(data);
      // 数据为空
      if (data.Total === 0) {
        this.billArr = [];
        return;
      }

      // 不为空
      this.billArr = data.Rows;
      this.invoiceStatusDict = data.invoiceStatusDict;

      for (let i = 0; i < data.Rows.length; i++) {
        const item = data.Rows[i];
        const statusObj = this.invoiceStatusDict.find(function(dict) {
          return dict.id === item.status;
        });
        this.billArr[i].statusText = statusObj.text;
      }

      // //判断是否为空
      // if (rows.Total != 0) {
      //   this.billArr = rows;
      // } else {
      // }
    });
  },

  methods: {
    // loadMore() {
    //   this.loading = true;
    //   setTimeout(() => {
    //     // let last = this.list[this.list.length - 1];
    //     // for (let i = 1; i <= 10; i++) {
    //     //   this.list.push(last + i);
    //     // }
    //     // this.loading = false;
    //   }, 2500);
    // },
    loadMore() {
      this.$nextTick(() => {
        console.log(this.isLoad);
        if (this.isLoad) {
          return;
        }
        this.loading = true;
      });
    },
    handleCheckAll() {
      let arr = [];
      this.checkAll = !this.checkAll;
      this.indeterminate = false;
      if (this.checkAll) {
        for (let i = 0; i < this.billArr.length; i++) {
          let obj = {
            money: this.billArr[i].money,
            billOrder: this.billArr[i].billOrder
          };
          arr.push(obj);
        }
        this.checkBill = arr;
      } else {
        this.checkBill = [];
      }
    },
    //点击查看开票详情，只有开票成功才可查看
    invoiceDetail(status, id) {
      if (status === "2") {
        this.$router.push({ path: "/invoiceDetails", query: { id: id } });
      } else if (status === "1") {
        Toast("开票中");
        return;
      } else {
        Toast("开票失败");
        return;
      }
    }
  }
};
</script>
<style lang="less">
.billListHisHead .mint-cell-wrapper {
  font-size: 13px;
  padding: 0 0;
}
.billListHisHead .mint-cell-allow-right::after {
  right: 5px;
}
</style>

<style lang="less" scoped>
.invoicBox {
  width: 100%;
  height: 100%;
  background-color: #f5f9fc;
  flex: 1;
  font-size: 15px;
}
.billContain {
  padding: 0 8px;
}
.billList {
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  margin-bottom: 10px;
  box-shadow: 2px 2px 5px #eeeeee;
}
.billListHisHead {
  // display: flex;
  // justify-content: space-between;
  // height: 40px;
  // line-height: 38px;
  // border-bottom: 1px solid #eeeeee;
  padding: 0 0;
}
.billListCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #818181;
  padding: 5px 0;
}
img {
  width: 7%;
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
