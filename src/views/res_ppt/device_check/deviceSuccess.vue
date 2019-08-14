<template>
    <div class="deviceSuccessBg">
        <div class="deviceOne">
             <div style="height:10rem"></div>
             <div class="completeBtn" @click="completes">完 成</div>
             <div class="filtrate">
                 <div style="color:#888;">我的巡检报告</div>
                 <div class="line"></div>
             </div>

             <div class="reportLlist">
                  <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @translate-change="translateChange" @top-status-change="handleTopChange"
                            @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                            <div v-if="noData" style="text-align:center;">暂无数据....</div>
                                <ul v-if="!noData" >
                                    <li  v-for="(item,index) in deviceInfoList"  :key = 'index'>
                                        <div>
                                            <div style="margin:10px 0;">
                                                <span>任务编号 &nbsp;&nbsp;</span>
                                                <span>{{item.taskCode}}</span>
                                            </div>
                                            <div class="deviceInfo"> 
                                                <div  class="overflowHidden">
                                                    <span>设备名称 &nbsp;&nbsp;</span>
                                                    <span>{{item.deviceName}}</span>
                                                </div>
                                                <div  class="overflowHidden">
                                                    <span>小区 &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                    <span>{{item.areaNAme}}</span>
                                                </div>
                                                <div  class="overflowHidden">
                                                    <span>提交时间 &nbsp;&nbsp;</span>
                                                    <span>{{item.createTime}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img :src="item.feedbackStatus == 2?abnormit:normal" alt="">
                                    </li>
                                </ul>
                           </mt-loadmore>
                    </div>
             </div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
 import { Indicator } from 'mint-ui';
 import {reportListPort,reportUserPort} from "@/api/device";
export default { 
    data(){
        return{
            deviceStateBg:true,
            abnormit:require('../../../../static/images/abnormit.png'),
            normal:require('../../../../static/images/normal.png'),
            noData:false,
            deviceInfoList:[],
            page: 1,
            allLoaded: false,
            bottomStatus: "",
            wrapperHeight: 0,
            topStatus: "",
            tatol: "",
            // 路径携带
            userId:'',
            mphone:''
        }
    },
    created(){
        this.userId = Util.GetUrlParam('id');
        this.mphone = Util.GetUrlParam('mphone')
        this.getMyReport();
        // for (let i = 1; i <= 10; i++) {
        //     this.deviceInfoList.push(i);
        // }
        
    },
     mounted() {
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapper.getBoundingClientRect().top - 20;
    },
    methods:{
        async getMyReport(){
            let that = this
           reportUserPort({id:that.userId,mphone:that.mphone}).then(res=>{
                if(res.data){
                    let resData = res.data;
                    if(resData.info == 'success'){
                         this.deviceInfoList = resData.data.reportList.Rows
                    }else{
                        Toast(resData.message)
                    }
                }else{
                    Toast('网络请求失败')
                }
           }).catch(function(error){})
        },
        handleBottomChange(status) {
           this.bottomStatus = status;
        },
        async loadBottom() {
            var currentTotal = this.page * 10;
            if (currentTotal < this.tatol) {
                this.page++;
                await this.getMyReport();
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
        // console.log(this.moveTranslate)
        },
        async loadTop() {
        this.page = 1;
        this.myRepair = [];
        this.myRepairObj = [];
        this.$refs.loadmore.onTopLoaded();
            await this.getMyReport();
        },
        completes:function(){
            WeixinJSBridge.call('closeWindow');
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/loading.less';
.deviceOne{
    box-shadow:0px 1px 1px 1px #D4D4D4;
    
}
.deviceSuccessBg{
     background-color: white;
    background-image: url('../../../../static/images/complete.png');
    background-size: 100%;
    background-repeat:no-repeat;
    padding: 0 1rem;
}
.filtrate{
    display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
    display: -webkit-flex;     /* 新版本 - 适配Chrome */
    display: flex;  
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0 1rem 1rem;
    font-size: 14px;
    background-color: white;
}
.line{
   width: 61%;
   height: 1px;
   background-color: #9BC0F2;    
}
.stateBtn{
   width:25%;
   text-align: center;
   background-color: #f8f8f8;
   padding: 5px;
   border-top-left-radius: 10px;
   border-bottom-left-radius: 10px;
}
.reportLlist{
    font-size: 15px;
    
   & li{
        background-color: #f8f8f8;
        display: -webkit-box;  
        display: -webkit-flex;     
        display: flex; 
        align-items: center;
        justify-content: space-around; 
        padding: 0 1rem;
        margin-bottom: 0.3rem;
      & img{
           width: 1.2rem;
           height: 1.2rem;
       }
       & .deviceInfo{
          color: #888;
          font-size: 13px;
          width: 11.5rem;
          & div{
              margin-bottom:10px;
          }
       }
  }
}
.overflowHidden{
    display: inline-block;
    width: 95%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    
}
.completeBtn{
    width: 6rem;
    height: 1.5rem;
    background-image: linear-gradient(to right,#2196F3,#518dea);
    opacity: 0.7;
    color: white;
    line-height: 1.5rem;
    text-align: center;
    border-radius: 2rem;
    // margin-bottom: 0.6rem;
    margin: 0 auto;
    font-size:17px;
}
</style>


