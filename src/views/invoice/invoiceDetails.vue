<template>
  <div class="invoicBox">
    <div class="invoiceDetail">
      <div class="list">
        <mt-cell title="电子发票已开票" :label="invoiceTime"></mt-cell>
      </div>
      <div class="title">接收信息</div>
      <div class="list">
        <mt-cell title="电子邮箱" :value="email"></mt-cell>
      </div>
      <div class="title">发票信息</div>
      <div class="list">
        <mt-cell title="发票抬头" :value="invoiceTitle"></mt-cell>
        <mt-cell title="税号" :value="paragraph"></mt-cell>
        <mt-cell title="发票金额" :value="money"></mt-cell>
        <mt-cell title="发票代码" :value="code"></mt-cell>
        <mt-cell title="发票号码" :value="number"></mt-cell>
      </div>
    </div>

    <div class="footerBtncal">
      <button @click="add()">添加为我的发票</button>
      <button @click="retransmit()">重新发送电子发票</button>
      <button @click="downloadpdf()">下载PDF</button>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { WXnickPort } from "@/api/myInfo";
import { esReSendInvoice, queryInvoiceDetail } from "@/api/invoice.js";
export default {
  data() {
    return {
      invoiceTime: "2019-01-12 10:10", //开票时间
      email: "1231456@qq.com",
      invoiceTitle: "厦门纵横集团科技股份有限公司", //发票抬头
      paragraph: "356654554547874545454", //税号
      money: "￥1100.00", //发票金额
      code: "454654545645454", //发票代码
      number: "5687457454567454654", //发票号码
      detailObj: [],
      feeId: "",
      pdf: ""
    };
  },
  created: function() {
    queryInvoiceDetail({ id: this.$route.query.id }).then(res => {
      console.log(res.data.data);
      this.email = res.data.data.email;
      this.invoiceTitle = res.data.data.CName;
      // this.invoiceTime = Util.fmDayMin(res.data.data.invoiceTime);
      this.invoiceTime = res.data.data.invoiceTime;
      this.paragraph = res.data.data.CTaxpayerNo;
      this.money = res.data.data.totalAmount;
      this.code = res.data.data.fpDm;
      this.number = res.data.data.fpHm;
      this.feeId = res.data.data.feeId;
      this.pdf = res.data.data.pdf;
      // console.log("ccc",res.data.data.CName)
    });
  },

  methods: {
    check() {
      // 调用微信预览图片接口查看发票
      wx.previewImage({
        current:
          "https://sq.ptnetwork001.com/cisp_admin/upload/wxpImgFile/bg001.png", // 当前显示图片的http链接
        urls: [
          "https://sq.ptnetwork001.com/cisp_admin/upload/wxpImgFile/bg001.png"
        ] //必填 需要预览的图片http链接列表
      });
    },
    //重新发送电子票
    retransmit() {
      esReSendInvoice({
        openId: this.$store.state.openId,
        feeId: this.feeId,
        email: this.email
      }).then(res => {
        console.log(res.data);
        if (res.data.info === "success") {
          Toast("发送成功");
          return;
        } else {
          Toast("发送失败");
          return;
        }
      });
    },
    //pdf下载
    downloadpdf() {
      queryInvoiceDetail({ id: this.$route.query.id }).then(res => {
        this.pdf = res.data.data.pdf;
      });
      window.location.href = this.pdf;
    },
    add() {
      window.location.href = "https:\/\/mp.weixin.qq.com\/bizmall\/authinvoice?action=list&s_pappid=d3gyYTVlNzY0ZTA5OTk1YWYxX2uihMZvKiYQo33uzjvRQhNo1lcJLc7_B1_xWEJlY2et&appid=wx2a5e764e09995af1&num=1&o1=504CC382C0A856CE27D7CFB753E83AC2&m1=59&t1=2019080900&source=web&type=2&redirect_url=http%3A%2F%2Fwww.iis.cn%2Fcisp_admin%2Fmain%2FMain.do&signature=ac6d0969f9bea044cba13b45c193ac5d447952b9#wechat_redirect";

    }
  }
};
</script>
<style lang="less"  >
.invoiceDetail .mint-cell {
  border: 1px solid #fafcfe;
}
.invoiceDetail .mint-cell-text {
  color: #888888;
}
.invoiceDetail .mint-cell-value {
  color: black;
  font-size: 14px;
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
.list {
  width: 100%;
  // padding: 0 .5rem;
  background-color: #ffffff;
}
.title {
  padding: 0.6rem 0.5rem;
}

.footerBtncal {
  text-align: center;
  margin-top: 30px;
  & button {
    background-color: #26a2ff;
    color: white;
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 5px;
  }
}
</style>
