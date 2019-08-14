<template>
    <div v-bind:class="deviceStateBg == '1'?'deviceBoxNormal':'deviceBoxAbnormity'" style="padding-bottom:15px;">
        <div class="deviceOne">
             <div style="height:13rem"></div>
             <div class="filtrate">
                 <div class="calendar">
                     <img src="../../../../static/images/devicecalendar.png" alt="" @click="openPicker">&nbsp;至&nbsp;今天
                 </div>
                 <div class="line"></div>
                &nbsp; &nbsp; <div class="stateBtn">
                    <select name="" id="" class="mint-cell-value" v-model="deviceStateValue"  @change="gradeChange">
                        <option value="">请选择</option>
                        <option v-for="(item,index) in deviceState" :value="item.id"  :key = 'index'>{{item.text}}</option>
                    </select>
                </div>
             </div>

             <div class="reportLlist">
                  <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @translate-change="translateChange" @top-status-change="handleTopChange"
                            @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                            <div  v-if="noData" style="text-align:center;">暂无数据....</div>
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
                                                <span>{{item.taskName}}</span>
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
        <template>
            <mt-datetime-picker ref="picker" type="date" :start-date="startDate" :end-date="endDate" @confirm="handleConfirm">
            </mt-datetime-picker>
        </template>
    </div>
</template>
<script>
import Util from "@/libs/util.js";
import { DatetimePicker } from 'mint-ui';
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import {reportListPort} from "@/api/device";
export default {
    components:{DatetimePicker},
    data(){
        return{
            deviceStateBg:'1',
            noData:false,
            abnormit:require('../../../../static/images/abnormit.png'),
            normal:require('../../../../static/images/normal.png'),
            deviceState:[
                {id:'1',text:'设备正常'},
                {id:'2',text:'设备异常'}
            ],
            deviceStateValue:'',
            deviceInfoList:[
                // {
                //     id:'c1',
                //     name:'设备设备设备设备设备设备',
                //     areaNAme:'禹州华侨海景城',
                //     time:'2018.10.30 10:20',
                //     state:1
                // },
                // {
                //     id:'c2',
                //     name:'设备设备设备设备设备设备备设备设备设备',
                //     areaNAme:'禹州华侨海景城',
                //     time:'2018.10.30 10:20',
                //     state:2
                // }
            ],
            page: 1,
            allLoaded: false,
            bottomStatus: "",
            wrapperHeight: 0,
            topStatus: "",
            tatol: "",
            setD:'',
            startDate:{},
            endDate:new Date(),
            deviceId:'',
            startTime:''
           
        }
    },
    created(){
        this.deviceId = Util.GetUrlParam('id');
        // for (let i = 1; i <= 10; i++) {
        //     this.deviceInfoList.push(i);
        // }
        this.getMyReport();
          this.startDate = this.getBeforeTime()
            
      
        
    },
     mounted() {
        this.wrapperHeight =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().top-15;
    },
    methods:{
        async getMyReport(){
            let that = this;
             reportListPort({id:that.deviceId,state:that.deviceStateValue,startTime:that.startTime}).then(res=>{
                  if(res.data){
                     let resData = res.data
                     if(resData.info == 'success'){
                         that.deviceStateBg = resData.data.device.deviceStatus;
                        if(resData.data.reportList.Total>0){
                           that.deviceInfoList = resData.data.reportList.Rows
                        }else{
                            // 没有数据
                            that.noData = true;
                        }
                     }else{
                         Toast(resData.info)
                     }
                     
                  }else{
                     Toast('网络请求失败')
                  }
             }).catch(function(error){})
        },
        gradeChange(){
            this.getMyReport();
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
        openPicker: function () {
            this.$refs.picker.open();
        },
         handleConfirm: function (value) {
            let das = Util.parseDateTime(Util.handleConfirm(value))
            this.startTime = das.substr(0,8);
             this.getMyReport();
            // console.log( das.substr(0,8))
        },
        getBeforeTime:function(){
            var dd = new Date(); 
            dd.setYear(dd.getFullYear()-4);//获取AddMonthCount月后的日期 
            var y = dd.getFullYear(); 
            var m = dd.getMonth()+1;//获取当前月份的日期 
            var d = dd.getDate(); 
            //判断 月
            if(m < 10){
               m = "0" + m;
            }else{
               m = m;
            }
            //判断 日n     
            if(d < 10){//如果天数<10
               d = "0" + d;
            }else{
               d = d;
            }
            return new Date(y+"/"+m+"/"+d);
        }
       
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/loading.less';
select {
    width: 100%;
    -webkit-appearance: none;
    border: none;
    outline: none;
    text-align: center;
    direction: rtl;
    background-color: #f8f8f8;
}
.deviceOne{
    box-shadow:0px 1px 1px 1px #D4D4D4;
    
}
.deviceBoxNormal{
    background-color: white;
    background-image: url('../../../../static/images/deviceNormal.png');
    background-size: 100%;
    background-repeat:no-repeat;
    padding: 0 1rem;
}
.deviceBoxAbnormity{
     background-color: white;
    background-image: url('../../../../static/images/deviceAbnormity.png');
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
   width: 42%;
   height: 1px;
   background-color: #9BC0F2;    
}
.calendar{
    width: 45%;
    display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
    display: -webkit-flex;     /* 新版本 - 适配Chrome */
    display: flex;  
    align-items: center;
    color: #888;
    font-size:12px;
    img{
        width: 46%;
    }
}
.stateBtn{
   width:20%;
   text-align: center;
   background-color: #f8f8f8;
   padding: 8px;
   border-top-left-radius: 14px;
   border-bottom-left-radius: 14px;
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
       }
  }
}
.overflowHidden{
    display: inline-block;
    width: 95%;
    line-height: 22px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    
}

</style>


