<template>

            <div class="repairBox">
                <div class="comBox">
                    <div class="comBackground">我的报事报修</div>
                    <div class="page-loadmore-wrapper" ref="wrapper" style="height:95vh;">
                        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @translate-change="translateChange" @top-status-change="handleTopChange"
                            @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                            <div v-if="noData" style="text-align:center;">暂无数据....</div>
                            <div v-if="!noData" class="repairContain" v-for="(item,index) in myRepair" :key="index" @click="repairDetail(item.orderNo,item.type,item.repairTypeId)"  v-cloak>
                            <div style="margin-bottom:25px;">
                                <div style="display: -webkit-box;display: -webkit-flex;display: flex;justify-content:space-between;height:1rem;line-height:1rem;">
                                    <span class="repairDescribe repairAddr" v-cloak>
                                        {{item.repairContent}}
                                    </span>
                                    <div  class="statess"  v-cloak>
                                        <span v-bind:class="item.state=='0'?'state waiting':item.state=='1'?'state dealing':item.state=='2'?'state dealedState':item.state=='3'?'state like':'state cancelState'"></span>
                                        <span class="fontBlu">
                                            {{item.orderStatus}}
                                        </span>
                                        
                                    </div>
                                </div>
                                <div class="flexs">
                                    <div style="width:60%;"  class="repairDescribe fontColor">
                                        <span>地址：</span>
                                        <span v-cloak>{{item.repairAddr}}</span>
                                    </div>
                                    <div style="font-size:10px;width:40%;text-align:right;margin-right:0.5rem;" class="fontColor" v-cloak>{{item.createTime}}</div>
                                </div>
                                <div class="flexs">
                                  <span>处理人员：</span>
                                  <div class="flexs">
                                     <span>{{item.dealName}}</span>
                                      <a :href="'tel:'+item.dealUserPhone">
                                          <div class="flexs" style="color:#3da1fe;"><img v-if ="item.dealName !='--'" src="../../../static/images/tel.png" style="width:23px;" alt="">{{item.dealUserPhone}}</div>
                                      </a>
                                  </div>
                                </div>
                            </div>
                            <div class="progress" :style="{background:item.backgroundColor}">
                                  <div class="progress-bar" :style="{width:item.dealTimePercent+'%',background:'#72BDFF'}">

                                      <div class="progress-value" style="position:absolute;top: -20px;left:60%;">{{item.dealTimeText}}</div>
                                  </div>
                            </div>
                            <div class="progress-header"><span class="progress-title">{{starT}}</span><span class="progress-title">{{item.totalTimg}}<span style="color:rgb(216, 76, 41)">{{item.overTime}}</span></span></div>
                            </div>
                        </mt-loadmore>
                    </div>
                </div>
            </div>
</template>

<script>
import { Toast } from "mint-ui";
import { Indicator } from 'mint-ui';
import Util from "@/libs/util.js";
import { myRepair } from "@/api/repair";
import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from 'constants';
export default {
  data() {
    return {
      myRepair: [],
      page: 1,
      myRepairObj: [],
      allLoaded: false,
      bottomStatus: "",
      wrapperHeight: 0,
      topStatus: "",
      tatol: "",
      app_userId: "",
      noData: false,
      dictId:'',
      starT:0
    };
  },
  created: function() {
    let that = this;
    var userData = this.$store.state.resUser;
    if(userData ==''){
       this.noData = true;
       return;
    }
      Indicator.open({
        spinnerType: 'fading-circle'
    });
    that.app_userId = userData.resUserId;
    that.getMyRepair();
    for (let i = 1; i <= 20; i++) {
      this.myRepair.push(i);
    }
  },
  mounted() {
    this.wrapperHeight =
      document.documentElement.clientHeight -
      this.$refs.wrapper.getBoundingClientRect().top;
  },
  methods: {
    repairDetail: function(orderNo, repairType,repairTypeId) {
      if (repairType == "public") {
        this.$router.push({path:'/publicRepairDetail',query:{repairType:repairType,orderNo:orderNo,dictId:repairTypeId}})
      } else if (repairType == "person") {
        this.$router.push({path:'/personRepairDetail',query:{repairType:repairType,orderNo:orderNo,dictId:repairTypeId}})
      }
    },
    async getMyRepair() {
      var that = this;
      let obary = this.myRepairObj;
      let myRepairparams = {
        app_userId: that.app_userId,
        page: this.page,
        pagesize: "10"
      };
      myRepair(myRepairparams)
        .then(res => {
          let rtnData = res.data;
          let rows = JSON.parse(rtnData.data);
          if (rtnData.info == 'success') {
                Indicator.close();
                let rows = JSON.parse(rtnData.data)
                 that.tatol = rows.Total;
                if(rows.Total == 0){
                   that.noData = true;
                   that.allLoaded = true;
                }else{
                that.noData = false;
                 if(that.tatol<=that.page * 10){
                    that.allLoaded = true;
                 }
                // console.log(rows.Rows);
                for (let i = 0; i < rows.Rows.length; i++) { 
                    // console.log(rows.Rows[i].hopeDealTime)
                   that.starT=0;
                  var totalTimg = '';//各个状态的总时长 下
                  var dealTimePercent = '';//处理时间总时间百分比（控制进度条显示）
                  var dealTimeText = '';//处理时间（进度条显示）上
                  var textPosition = '80';
                  var overTime = '';//超时时长
                  var backgroundColor = 'silver';//超时改变进度条颜色
                   if(rows.Rows[i].orderStatus == 0){
                       totalTimg = '15分钟'//待接单
                       dealTimeText = Util.processTime( rows.Rows[i].createTime,'process','','','').totalDay;
                       dealTimePercent =  (Util.processTime( rows.Rows[i].createTime,'process','','','').totalMIn / 15)*100;
                        if(dealTimePercent>80){
					    		textPosition = 70;
					    	}
                       if(dealTimePercent>100){
                           backgroundColor = '#D84C29';
                           dealTimeText = '15分钟(计划结束)';
                           totalTimg = Util.processTime(rows.Rows[i].createTime,'process','','','').totalDay;
                           overTime='(超时'+ Util.processTime(rows.Rows[i].createTime,'overTime',15,60000,'').totalDay +')'
                          dealTimePercent =  (15/Util.processTime( rows.Rows[i].createTime,'process','','','').totalMIn)*100;
                     }
                   }else if(rows.Rows[i].orderStatus == 1){//处理中
                       if(rows.Rows[i].type =='person' && rows.Rows[i].hopeDealTime!=''){
                           let nowDate = new Date();
                           let d= new Date(Date.parse(rows.Rows[i].hopeDealTime.replace(/-/g,"/")));
                           let l = new Date(Date.parse(rows.Rows[i].lastModTime.replace(/-/g,"/")));
                           if(nowDate>=d){
                                let residueTime = rows.Rows[i].autoTime-Math.abs(Util.processTime(rows.Rows[i].hopeDealTime,'process','','',rows.Rows[i].lastModTime).totalMIn);
                               
                                if(residueTime<0 && d<l){    
                                    //待接单超时且超过总时长
                                        // residueTime = Util.processTime(rows.Rows[i].createTime,'','','',rows.Rows[i].lastModTime).totalMIn-rows.Rows[i].autoTime;
                                        totalTimg = Util.processTime(rows.Rows[i].hopeDealTime,'process','','','').totalDay;
                                        overTime ='(超时'+ Util.processTime(rows.Rows[i].hopeDealTime,'overTime',rows.Rows[i].autoTime,60000,'').totalDay+')';
                                        dealTimeText = Util.tranTime(rows.Rows[i].autoTime)+'(计划结束)'
                                        dealTimePercent = (rows.Rows[i].autoTime/Util.processTime(rows.Rows[i].hopeDealTime,'','','','').totalMIn )*100;
                                        backgroundColor = '#D84C29';
                                   }else{
                                     
                                    //    待接单未超过总时长  处理中时长-处理中的处理时长
                                        let noOverResidue=0;
                                        let t = 0;
                                        if(l>d){  
                                            //超过预约时间才接单
							    			residueTime=rows.Rows[i].autoTime-Math.abs(Util.processTime(rows.Rows[i].hopeDealTime,'','','',rows.Rows[i].lastModTime).totalMIn); 
                                            noOverResidue = residueTime - Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn
							    		    t = residueTime;
                                        }else{
                                            noOverResidue=rows.Rows[i].autoTime-Util.processTime(rows.Rows[i].hopeDealTime,'','','','').totalMIn;
                                            t = rows.Rows[i].autoTime;
                                        }
                                        if(noOverResidue<0){
                                            //处理中超时 
                                            backgroundColor = '#D84C29';
                                            dealTimeText =  Util.tranTime(t)+'(计划结束)'
                                            totalTimg = Util.processTime(rows.Rows[i].lastModTime,'process','','','').totalDay;
                                            overTime='(超时'+ Util.processTime(rows.Rows[i].lastModTime,'overTime',t,60000,'').totalDay +')'
                                            dealTimePercent =  (Math.abs(t)/Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn)*100;
                                        }else{
                                            //处理中未超时 
                                            dealTimeText = Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalDay;
                                            dealTimePercent =  (Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn / t)*100;
                                            totalTimg = Util.tranTime(t)
                                        }
                                    
                                }
                                if(dealTimePercent>80){
                                            textPosition =70;
                                    }
                           }else{that.starT='未到预约时间'}
                       }else{
                            let residueTime = rows.Rows[i].autoTime-Util.processTime(rows.Rows[i].createTime,'process','','',rows.Rows[i].lastModTime).totalMIn;
                            if(residueTime<0){    
                                //待接单超时且超过总时长
                                    // residueTime = Util.processTime(rows.Rows[i].createTime,'','','',rows.Rows[i].lastModTime).totalMIn-rows.Rows[i].autoTime;
                                    totalTimg = Util.processTime(rows.Rows[i].createTime,'process','','','').totalDay;
                                    overTime ='(超时'+ Util.processTime(rows.Rows[i].createTime,'overTime',rows.Rows[i].autoTime,60000,'').totalDay+')';
                                    dealTimeText = Util.tranTime(rows.Rows[i].autoTime)+'(计划结束)'
                                    dealTimePercent = (rows.Rows[i].autoTime/Util.processTime(rows.Rows[i].createTime,'','','','').totalMIn )*100;
                                    backgroundColor = '#D84C29';
                            }else{
                                //    待接单未超过总时长  处理中时长-处理中的处理时长
                                    let noOverResidue = residueTime - Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn
                                    if(noOverResidue<0){
                                        //处理中超时 
                                        backgroundColor = '#D84C29';
                                        dealTimeText =  Util.tranTime(residueTime)+'(计划结束)'
                                        totalTimg = Util.processTime(rows.Rows[i].lastModTime,'process','','','').totalDay;
                                        overTime='(超时'+ Util.processTime(rows.Rows[i].lastModTime,'overTime',residueTime,60000,'').totalDay +')'
                                        dealTimePercent =  (Math.abs(residueTime)/Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn)*100;
                                    }else{
                                        //处理中未超时 
                                        dealTimeText = Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalDay;
                                        dealTimePercent =  (Util.processTime( rows.Rows[i].lastModTime,'process','','','').totalMIn / residueTime)*100;
                                        totalTimg = Util.tranTime(residueTime)
                                    }
                                
                            }
                            if(dealTimePercent>80){
                                        textPosition = 70;
                                }
                        }
                     
                      
                   }else{
                       totalTimg = Util.tranTime(rows.Rows[i].autoTime)//已处理
                       dealTimeText = Util.processTime( rows.Rows[i].createTime,'process','','',rows.Rows[i].lastModTime).totalDay;
                       dealTimePercent =  (Util.processTime( rows.Rows[i].createTime,'process','','',rows.Rows[i].lastModTime).totalMIn / rows.Rows[i].autoTime)*100;
                        if(dealTimePercent>80){
					    		textPosition = 70;
					    	}
                       if(dealTimePercent>100){
                           backgroundColor = '#D84C29';
                           dealTimeText = Util.tranTime(rows.Rows[i].autoTime)+'(计划结束)';
                           totalTimg = Util.processTime(rows.Rows[i].createTime,'process','','',rows.Rows[i].lastModTime).totalDay;
                           overTime='(超时'+ Util.processTime(rows.Rows[i].createTime,'overTime',rows.Rows[i].autoTime,60000,rows.Rows[i].lastModTime).totalDay +')'
                          dealTimePercent =  (rows.Rows[i].autoTime/Util.processTime(rows.Rows[i].createTime,'process','','',rows.Rows[i].lastModTime).totalMIn)*100;
                       }
                   }
                   
                    let myRepairArr = {
                        type: rows.Rows[i].type,
                        repairType: rows.Rows[i].repairType,
                        repairAddr: rows.Rows[i].repairAddr,
                        createTime: rows.Rows[i].createTime,
                        orderNo: rows.Rows[i].orderNo,
                        repairContent:rows.Rows[i].repairContent,
                        orderStatus: Util.getTypeJsonText(rows.orderStatusDict, rows.Rows[i].orderStatus),
                        state:rows.Rows[i].orderStatus,
                        dealUserPhone:rows.Rows[i].dealUserPhone,
                        dealName:rows.Rows[i].dealName==''?'--':rows.Rows[i].dealName,
                        lastModTime:rows.Rows[i].lastModTime,
                        totalTimg:totalTimg,
                        dealTimePercent:dealTimePercent,
                        dealTimeText:dealTimeText,
                        overTime:overTime,
                        backgroundColor:backgroundColor,
                        textPosition:textPosition,
                        repairTypeId:rows.Rows[i].repairTypeId
                    }
                   
                    obary.push(myRepairArr);
                     
                }
                that.tatol = rows.Total;
                that.myRepair = obary;
                }
            } else {
                that.$toast("网络请求失败");
                that.allLoaded = true;
                that.$refs.loadmore.onBottomLoaded();
          }
        })
        .catch(error => {});
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    async loadBottom() {
      var currentTotal = this.page * 10;
      if (currentTotal < this.tatol) {
        this.page++;
        await this.getMyRepair();
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
      this.allLoaded = false;
      await this.getMyRepair();
    },
   
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/loading.less";
@import "../../assets/less/myRepair.less";
@import "../../assets/less/repairSuccess.less";
@import "../../assets/less/complainAndSuggest.less";
.flexs{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items:center;
  height:1.3rem;
  line-height:1.3rem;
  color: #818181;
}
  .progress-header{
	display: flex;
	justify-content: space-between;
}
.progress-title{
    font-size: 15px;
    /*font-weight: 700;*/
    color:#818181;
    /*margin: 0 0 20px;*/
}

.progress{
    height: 2px;
    background: silver;
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 10px;
    overflow: visible;
}
.progress .progress-bar{
    position: relative;
    -webkit-animation: animate-positive 2s;
    animation: animate-positive 2s;
}
.progress .progress-bar:after{
    content: "";
    position: absolute;
    top: -3px;
    bottom: -14px;
    right: -3px;
   background-color: #72BDFF;
   ;border-radius: 50%;
   height: 8px;
   width: 8px;
   display: inline-block;
   box-shadow: 0 0 0 3px rgba(114,189,255,.4);
}
.progress .progress-value{
    display: block;
    font-size: 14px;
    /*font-weight: 600;*/
    color: #818181;
    white-space:nowrap;
 
}
.progress-bar{
	height: 100%;
}
@-webkit-keyframes animate-positive{
    0%{ width: 0; }
}
@keyframes animate-positive {
    0%{ width: 0; }
}
</style>
