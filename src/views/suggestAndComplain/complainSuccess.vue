<template>
        <div>
           <div class="repairSuccess">
               <div :style="{backgroundImage: 'url('+ bg +')'}" class="comsuccess repairSuccess_header">
                    <div class="containBtn">
                        <router-link :to="{name:'index'}">完成</router-link>
                    </div>
                    <div  class="containBtn">
                         <router-link :to="{name:'complainAndSuggest'}">再次提交</router-link>
                    </div>
               </div>
            </div>
            <div class="history">
                <div class="comhistory">&nbsp;&nbsp;历史记录</div>
                <div class="page-loadmore-wrapper " ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @translate-change="translateChange" @top-status-change="handleTopChange"
                        @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                        <div class="repairContain" v-for="(item,index) in myConplain" :key='index' @click="repairDetail(item.cmpOrderNo,item.type)">
                            <div style="display: -webkit-box;display: -webkit-flex;display: flex;justify-content:space-between;">
                                <span class="repairDescribe repairAddr" v-cloak>
                                    {{item.cmpContent}}
                                </span>
                                <div  class="statess"  v-cloak>
                                        <span v-bind:class="item.state=='0'?'state waiting':item.state=='1'?'state dealing':item.state=='2'?'state dealedState':item.state=='3'?'state like':'state cancelState'"></span>
                                        <span class="fontBlu">
                                                {{item.orderStatus}}
                                        </span>         
                                </div>
                            </div>
                            <div style="display: -webkit-box;display: -webkit-flex;display: flex;align-items:center;">
                                <div style="width:60%;"  class="repairDescribe fontColor">
                                    <span>小区地址：</span>
                                    <span v-cloak>{{item.resiAreaName}}</span>
                                </div>
                                <div style="font-size:10px;width:40%;text-align:right;margin-right:0.5rem;" class="fontColor" v-cloak>{{item.createTime}}</div>
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
 import {getMyRepairPort} from '@/api/complainAndSuggest';
 import { Indicator } from 'mint-ui';
export default {
    data() {
      return {
          bg:require('../../../static/images/compSuccess.png'),
       myConplain: [],
        page: 1,
        myRepairObj:[],
        topStatus: '',
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        topStatus: '',
        tatol: '',
        comItemDict:'',
        comTypeDict:'',
        resUserId:''
      }
    },
    created :function() {
       let that = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        });
        for (let i = 1; i <= 20; i++) {
            this.myConplain.push(i);
        }
        var resUserIdWeb=Util.GetUrlParam("resUserId");
        if(resUserIdWeb){
            that.resUserId=resUserIdWeb
        }
        that.getMyRepair();
    },
   mounted() {
         this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        //   alert( document.documentElement.clientHeight+';'+this.$refs.wrapper.getBoundingClientRect().top)
  },
    methods: {
       repairDetail: function (cmpOrderNo,type) {
            if(type==3){
                this.$router.push({path:'/myPraise',query:{cmpOrderNo:cmpOrderNo}})
            }else{
                this.$router.push({path:'/complainDetail',query:{cmpOrderNo:cmpOrderNo}})
                }     
        },
        async getMyRepair() {
            var that = this;
            var obary = this.myRepairObj;
            let params={
                    resUserId:that.resUserId,
                    cmpContent:'',
                    page: this.page,
                    pagesize: '10'
                }
            getMyRepairPort(params).then(res=>{
                let rtnData = res.data;
                Indicator.close();
                if (rtnData.info == 'success') {
                    let rows = rtnData.data.rowsData;
                    let complainItemDict = rtnData.data.complainItemDict;
                    let complainTypeDict = rtnData.data.complainTypeDict;
                    let orderStatusDict = rtnData.data.orderStatusDict;
                    for (let i = 0; i < rows.Rows.length; i++) {
                        let myComArr = {
                            resiAreaName: rows.Rows[i].resiAreaName,
                            createTime: rows.Rows[i].createTime,
                            cmpOrderNo: rows.Rows[i].cmpOrderNo,
                            type: rows.Rows[i].cmpType,
                            cmpTarget:rows.Rows[i].cmpTarget,
                            cmpContent:rows.Rows[i].cmpContent,
                            orderStatus: Util.getTypeJsonText(orderStatusDict, rows.Rows[i].orderStatus),
                            comTypeDict: Util.getTypeJsonText(complainTypeDict, rows.Rows[i].cmpType),
                            comItemDict: Util.getTypeJsonText(complainItemDict, rows.Rows[i].cmpItem),
                            state: rows.Rows[i].orderStatus
                        }
                        obary.push(myComArr)
                    }
                    
                    that.tatol = rows.Total;
                    that.myConplain = obary;
                    if(that.tatol<=that.page * 10){
                            that.allLoaded = true;
                    }
                } else {
                    Toast('网络请求失败')
                    that.allLoaded = true;
                    that.$refs.loadmore.onBottomLoaded();
                }
            }).catch(function(error){})
           
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
                this.myConplain=[],
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
@import "../../assets/less/complainDetail.less"; 
a{
    color: white;
}
</style>
