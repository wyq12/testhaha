<template>
      <div>
        <div class="repairBox">
            <div class="comBox">
                <div class="comBackground">我的报修</div>
                <div class="RepairDEtailContent">

                    <div class='personRepairPay perPingjia'>

                        <!-- 评价 -->
                        <div style="margin-bottom:15px;" class="">
                            <div class="start">
                                <span>评价：</span>
                                <ul ref="foodsWrapper">
                                    <li v-for="(item,index) in startList" :key="index" @click='showStart(index)' v-bind:class="item.current?'active':''"></li>
                                </ul>
                            </div>
                            <div>
                                <mt-field placeholder=" 请为物业工作人员做出评价，谢谢!(0-200)" type="textarea" rows="3" v-model="introduction" class="repairContentTextarea"></mt-field>
                            </div>

                            <div class='addPhoto'>
                                    <div class='addBtn' v-cloak @click="addPhoto1" v-if="addRaisePhoto.length<=0">添加图片</div>
                                    <div class="photoContent">
                                        <div class='photo' v-cloak v-for="(item,index) in addRaisePhoto"  :key="index">
                                            <div class="removePhoto" @click="removePhoto1(index)">
                                                <img src="../../../static/images/removePhoto.png" alt="">
                                            </div>
                                            <img :src="item" alt="">
                                        </div>
                                        <!-- <template v->

                                        </template> -->
                                        <div class='photo' v-cloak @click="addPhoto1" v-if="addRaisePhoto.length>0 && addRaisePhoto.length<3">
                                            <img src="../../../static/images/addPhoto.png" alt="">
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div class='personRepairPay' style="margin-top:1rem;" v-if="isNeedInvoice==1">
                        <div class="invoice">
                            <p>发票抬头及送达方式</p>
                            <mt-radio v-model="value" :options="invoiceList" @change="check"> </mt-radio>
                            <mt-tab-container v-model="value">
                                <mt-tab-container-item id="person">
                                    <input type="text" v-model="unitsCon" placeholder="请填写个人名称" style="width:98%;height:2rem;text-align:left !important;border:1px solid #bde2fe;">
                                </mt-tab-container-item>
                                <mt-tab-container-item id="units">
                                    <input type="text" v-model="unitsCon" placeholder="请填写单位名称" style="width:98%;height:2rem;text-align:left !important;border:1px solid #bde2fe;">
                                </mt-tab-container-item>
                            </mt-tab-container>
                            <div class="invoiceSend">
                                <div class="sendWayBox">
                                    <div class="sendWay" v-bind:class="selsetClass=='1'?'selectSend':''" @click="choiceSend('1')">发票自取</div>
                                </div>
                                <div class="sendWayBox">
                                    <div class="sendWay" v-bind:class="selsetClass=='3'?'selectSend':''" @click="choiceSend(3)">
                                    送到您家</div>
                                </div>
                                <div class="sendWayBox">
                                    <div class="sendWay" v-bind:class="selsetClass=='4'?'selectSend':''" @click="choiceSend(4)">送到信箱</div>
                                </div>
                                <div class="sendWayBox">
                                    <div class="sendWay" v-bind:class="selsetClass=='2'?'selectSend':''" @click="choiceSend(2)">
                                        快递发票 邮费到付
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="payFooter" style="text-align:center;">
                <div style="line-height:40px;margin-right:10px;">
                    合计：
                    <span>{{money}}</span>
                </div>
                <div class="perPays" @click="submitEvaluates">确认支付</div>
            </div>
        </div>
    </div>
    
   
</template>

<script>
import wx from 'weixin-js-sdk';
import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
import {
  infoDetailPort,
  submitEvaluatesPort,
} from "@/api/repairDetail";
import { Indicator } from 'mint-ui';
export default {
    data() {
      return {
         startList: [
            { current: false },
            { current: false },
            { current: false },
            { current: false },
            { current: false }
        ],
        introduction: '',
        value: 'person',
        invoiceList: [{
            label: '个人',
            value: 'person'
        }, {
            label: '单位',
            value: 'units'
        }
        ],
        personCon: '',
        unitsCon: '',
        orderNo: '',
        resCode:'',
        evaluate: 0,
        money: '',
        isNeedInvoice: '',
        selectY: '',
        selsetClass: '',
        openId: '',
        app_username:'',
        app_userId:'',
        serverId:[],
        addRaisePhoto:[],
        dictId:''
      }},
    async created() {
       let that = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        });
        var sperOrderNo = Util.GetUrlParam('orderNo');
        if (sperOrderNo != null) {
            var sperOrderNo_ = decodeURIComponent(sperOrderNo);
            this.orderNo = sperOrderNo_;
            this.resCode = Util.GetUrlParam('resCode');
            this.dictId = Util.GetUrlParam('dictId');
        }
        var userData = this.$store.state.resUser
        that.app_userId = userData.resUserId;
        that.app_username = userData.userName;
        that.openId = userData.openId;
        await that.infodetail();

    },

    methods: {
         async infodetail() {
            let that = this;
           await infoDetailPort({
                    type: 'person',
                    orderNo:that.orderNo
                }).then(res=>{
                   Indicator.close()
                let rtnData = res.data;
                if (rtnData.info == 'success') {
                    let rtnTypeJson = rtnData.data[1];
                    let rtnInfo = rtnData.data[0];
                    that.money = rtnInfo.amount;
                    that.introduction=rtnInfo.remark;
                    that.evaluate = rtnInfo.evaluate;
                    that.isNeedInvoice = rtnInfo.isNeedInvoice;
                    if(that.evaluate.length>0){
                        for (var i = 0; i < 5; i++) {
                            let startList = that.$refs.foodsWrapper.getElementsByTagName('li')
                            if (i < parseInt(that.evaluate)) {
                                that.startList[i].current = true;
                            } else {
                                that.startList[i].current = false;
                            }
                        }
                    }
                    
                } else {
                    Toast('网络请求失败')
                }
                }).catch(function(error){})
        },
        showStart: function (num) {
            this.evaluate = num + 1;
            let startList = this.$refs.foodsWrapper.getElementsByTagName('li')
            for (var i = 0; i < startList.length; i++) {
                if (i <= num) {
                    this.startList[i].current = true;
                } else {
                    this.startList[i].current = false;
                }
            }
        },
        check: function (value) {
            this.selectY = value
            this.unitsCon = ''
        },
        async submitEvaluates() {
            let that = this;
            if (that.evaluate != '0') {
                if (that.introduction.length < 120) {
                    if (that.isNeedInvoice == '1') {
                        if (that.selectY == 'units') {
                            if (that.unitsCon == "") {
                                Toast('请为填写单位名称')
                            } else {
                                if (that.selsetClass == '') {
                                    Toast('请为选择送达方式')
                                } else {
                                    await that.askPost();
                                }
                            }
                        } else {
                            if (that.selsetClass == '') {
                               Toast('请为选择送达方式')
                            } else {
                                await that.askPost();
                            }
                        }
                    } else {
                        await that.askPost();
                    }
                } else {
                    Toast('评价内容不多于120个字！')
                }
            } else {
                Toast('请为物业工作人员打星，谢谢！')
            }
        },
        choiceSend: function (i) {
            this.selsetClass = i;
        },
        async askPost() {
            let that = this;
            var mediaIdStr = that.serverId.join(',')
            let params={
                    type: 'person',
                    orderNo: that.orderNo,
                    orderStatus: '3',//评价固定为3
                    remark: that.introduction,
                    evaluate: that.evaluate,
                    invoiceTitle: that.unitsCon,//发票抬头，选择单位则必填
                    payMode: '2',//缴费方式，1:支付宝,2:微信,3:银联,4:电信e支付,5:现金,9:其他
                    invoiceSendMode: that.selsetClass,//发票寄送方式,:0:不需要发票,1:到管理处领取,2:快递到付,3:送到家里,4:送到信箱
                    payWay: '1',//缴费途径:1:在线支付, 2:管理处缴费, 3:上门收取（默认为1）
                    amount: that.money,//金额
                    app_username:that.app_username,
                    app_userId:that.app_userId,
                    mediaId:mediaIdStr
                }
            console.log(params)
            submitEvaluatesPort(params).then(res=>{
                let rtnData = res.data;
                if (rtnData.info == 'success') {
                    window.location.href = '/cisp_res/wxp/WXP070200Pay.do?method=paySourceWay&openId=' + that.openId + '&type=WXBX&feeNos=' + that.orderNo + '&totalFee=' + that.money * 100+'&resCode='+that.resCode+'&dictId='+that.dictId
                   
               } else {
                    Toast('网络请求失败')
                }
            }).catch(function(error){})
            


        },
            // 添加图片
        addPhoto1() {
            this.btnShow = false;
            let that = this;
            if(that.addRaisePhoto.length<3){
                    wx.chooseImage({
                        count: 3-that.addRaisePhoto.length,
                        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有  
                        success: function (res) {
                            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                            Indicator.open({
                                text:'正在上传图片中，请稍后...',
                                spinnerType: 'fading-circle'
                            });
                            that.uploadImages(localIds,0,'public')
                            for(let i =0;i<localIds.length;i++){
                                that.addRaisePhoto.push(localIds[i]);
                            }
                        },
                        fail:function(error){
                           console.log(error)
                        }
                    });
            }else{
                Toast('您最多可上传3张图片')
            }
        },
         uploadImages:function(localIds,i,type){
            let that = this;
            // alert('uploadImages1')
            wx.uploadImage({
                localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId;
                     that.serverId.push(serverId); 
                    if(i<localIds.length-1){
                        setTimeout(function(){
                            i++;
                            that.uploadImages(localIds,i,type);
                        },100);
                    }else{
                        Indicator.close();  
                    }
                }
            })
        },   
        removePhoto1: function (index) {
            let that = this;
            this.serverId.splice(index,1);
           this.addRaisePhoto.splice(index,1)
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/personRepairPay.less";
@import "../../assets/less/complainAndSuggest.less"; 
@import "../../assets/less/publicRepairDetail.less"; 
@import "../../assets/less/repair.less";  
 .start ul {
            list-style: none;
            height: 100%;
            padding: 0;
            margin: 0;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
        } 
</style>
