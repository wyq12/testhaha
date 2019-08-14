<template>
        <div>
            <div :style="{backgroundImage: 'url('+ bg +')'}"  class="repairsuccess repairSuccess_header" >
                <div class="containBtn">
                    <router-link :to="{name:'index'}">完成</router-link>
                </div>
                <div class="containBtn">
                    <router-link :to="{name:'repair'}">继续报修</router-link>
                </div>
            </div>
            <div class="history">
                <div class="comhistory">历史记录</div>
                <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @translate-change="translateChange" @top-status-change="handleTopChange"
                        @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                        <div class="repairContain" v-for="(item,index) in myRepair" :key='index' @click="repairDetail(item.orderNo,item.type,item.repairTypeId)">
                            <div style="display: -webkit-box;display: -webkit-flex;display: flex;justify-content:space-between;">
                                <span class="repairDescribe repairAddr">
                                    {{item.repairContent}}
                                </span>
                                <div  class="statess" style="margin-right:0;" v-cloak>
                                        <span  v-bind:class="item.state=='0'?'state waiting':item.state=='1'?'state dealing':item.state=='2'?'state dealedState':item.state=='3'?'state like':'state cancelState'"></span>
                                        <span class="fontBlu">
                                                {{item.orderStatus}}
                                        </span>    
                                </div>
                            </div>
                            <div style="display: -webkit-box;display: -webkit-flex;display: flex;align-items:center;">
                                <div style="width:60%" class="repairDescribe  fontColor">
                                    <span>报修地址：</span>
                                    <span>{{item.repairAddr}}</span>
                                </div>
                                <div style="font-size:10px;width:40%;text-align:right;" class="fontColor">{{item.createTime}}</div>
                            </div>
                        </div>
                    </mt-loadmore>

                </div>
           </div>
        </div>
</template>

<script>
import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
 import {myRepair} from '@/api/repair';
 import { Indicator } from 'mint-ui';
export default {
    data() {
      return {
        bg:require('../../../static/images/repairSuccess.png'),
        myRepair: [],
        page: 1,
        myRepairObj: [],
        topStatus: '',
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        topStatus: '',
        tatol: '',
        app_username:'',
        app_userId:'',
        openIds:''
      }
    },
    created :function() {
        let that = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        });
         that.openIds = Util.GetUrlParam('openId');
        var userData = this.$store.state.resUser;
        that.app_username = userData.userName;
        that.app_userId = userData.resUserId;
        that.getMyRepair();
        for (let i = 1; i <= 20; i++) {
            this.myRepair.push(i);
        }

    },
   mounted() {
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    methods: {
       repairDetail: function (orderNo, repairType,repairTypeId) {
             if (repairType == "public") {
                this.$router.push({path:'/publicRepairDetail',query:{repairType:repairType,orderNo:orderNo,dictId:repairTypeId}})
            } else if (repairType == "person") {
                this.$router.push({path:'/personRepairDetail',query:{repairType:repairType,orderNo:orderNo,dictId:repairTypeId}})
            }
        },
        async getMyRepair() {
            var that = this;
            let obary = this.myRepairObj;
            let myRepairparams ={
                app_userId:that.app_userId,
                page: this.page,
                pagesize: '10'
            }
            myRepair(myRepairparams).then(res=>{ 
                let rtnData = res.data;
                let rows = JSON.parse(rtnData.data)
                if (rtnData.info == 'success') {
                    Indicator.close();
                    for (let i = 0; i < rows.Rows.length; i++) {
                        let myRepairArr = {
                            type: rows.Rows[i].type,
                            repairType: rows.Rows[i].repairType,
                            repairAddr: rows.Rows[i].repairAddr,
                            createTime: rows.Rows[i].createTime,
                            orderNo: rows.Rows[i].orderNo,
                            repairContent:rows.Rows[i].repairContent,
                            orderStatus: Util.getTypeJsonText(rows.orderStatusDict, rows.Rows[i].orderStatus),
                            state:rows.Rows[i].orderStatus,
                            repairTypeId:rows.Rows[i].repairTypeId
                        }
                        obary.push(myRepairArr)
                    }
                    console.log(888888)
                    that.tatol = rows.Total;
                    that.myRepair = obary;
                    if(that.tatol<=that.page * 10){
                        that.allLoaded = true;
                    }
                } else {
                    Toast('网络请求失败')
                    that.allLoaded = true;
                    that.$refs.loadmore.onBottomLoaded();
                }
                }).catch(error => {});     
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        async loadBottom() {
            var currentTotal = this.page * 10
            if (currentTotal < this.tatol) {
                this.page++;
                await this.getMyRepair()
                this.$refs.loadmore.onBottomLoaded();
            } else {
                this.allLoaded = true; // 若数据已全部获取完毕
            }
        },
        handleTopChange(status) {
            this.moveTranslate = 1;
            this.topStatus = status;
        },
        translateChange(translate) {
            const translateNum = +translate;
            this.translate = translateNum.toFixed(2);
            this.moveTranslate = (1 + translateNum / 70).toFixed(2);
        },
        async loadTop() {
                this.page = 1;
                this.myRepair=[];
                this.myRepairObj=[];
                this.$refs.loadmore.onTopLoaded();
                await this.getMyRepair()
        },   
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/loading.less";
@import "../../assets/less/myRepair.less";
@import "../../assets/less/repairSuccess.less";   
a{
    color: white;
}
</style>
