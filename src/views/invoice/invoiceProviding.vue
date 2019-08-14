<template>
  <div class="invoicBoxP">
    <div
      class="pageIit"
      style="display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;"
    >开具发票</div>
    <div class="container">
      <div class="invoiceList">
        <mt-cell title="物业缴费" to="/onlineInvoicing" is-link value></mt-cell>
        <!-- <mt-cell title="停车缴费" to="/onlineInvoicing" is-link value=""></mt-cell> -->
      </div>
    </div>
    <div class="container">
      <div class="invoiceList" style="margin-top:10px;">
        <mt-cell title="开票历史" to="/invoiceHistory" is-link value></mt-cell>
        <!-- <mt-cell title="开票帮助" to="/onlineInvoicing" is-link value=""></mt-cell> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { WXnickPort } from "@/api/myInfo";
export default {
  data() {
    return {};
  },
  created: function() {},

  methods: {
    
  }
};
</script>

<style lang="less" scoped>
.invoicBoxP {
  width: 100%;
  height: 100%;
  background-color: #f5f9fc;
  flex: 1;
}
.pageIit {
  background-image: url("../../../static/images/wave_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 5.5rem;
}
.container {
  background-color: white;
}
.invoiceList {
  padding: 0 1rem;
}
.invoiceList .mint-cell:last-child {
  border-bottom: none;
}
.mint-cell {
  border-bottom: 1px solid #eeeeee;
}
</style>
