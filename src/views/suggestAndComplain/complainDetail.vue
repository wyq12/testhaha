<template>
     <div>
        <div class="repairBox">
            <div class="comBox">
                <div class="comBackground">投诉建议详情</div>
                <div class="RepairDEtailContent">
                    <div class="header dealStateBox">
                        <div class="headerBtn">
                            <div v-if="state>=2" style="background-color:white;width:4rem;"></div>
                            <div v-if="state<2"  style="background-color:white;width:4rem;" class="containBtn fontSize" @click="remind">提醒物业</div>
                            <div>待接单</div>
                            <div class="containBtn fontSize">
                                 <router-link :to="{path:'/ComProcessDetail',query:{cmpOrderNo:this.cmpOrderNo}}">进度明细</router-link> 
                            </div>
                        </div>
                        <div class='dealTime'>
                            <span>处理时间</span>
                            <span v-cloak>{{dealTimes}}</span>
                        </div>
                        <div class="step">
                            <div class="allStep" ref="allStep">
                                <div style="width:33.3%;" v-bind:class="state>0?'currentStep':''"></div>
                                <div style="width:33.3%;" v-bind:class="state>1?'currentStep':''"></div>
                                <div style="width:33.3%;" v-bind:class="state>2?'currentStep':''"></div>
                            </div>
                            <div class="stepDot" ref="stepDot">
                                <div class="currentStepDot" v-bind:class="state>=0?state==0?'dot-circle selectStepDot':'selectStepDot':''"></div>
                                <div v-if="state<4" class="currentStepDot" v-bind:class="state>=1?state==1?'dot-circle selectStepDot':'selectStepDot':''"></div>
                                <div v-if="state<4" class="currentStepDot" v-bind:class="state>=2?state==2?'dot-circle selectStepDot':'selectStepDot':''"></div>
                                <div class="currentStepDot" v-bind:class="state>=3?state==3?'dot-circle selectStepDot':'dot-circle selectStepDot':''"></div>
                            </div>
                            <div class="allStepText">
                                <div v-bind:class="state==0?'allStepTextColor':''">待接单</div>
                                <div v-if="state<4" v-bind:class="state==1?'allStepTextColor':''">处理中</div>
                                <div v-if="state<4" v-bind:class="state==2?'allStepTextColor':''">已处理</div>
                                <div v-if="state<4" v-bind:class="state==3?'allStepTextColor':''">已评价</div>
                                <div v-if="state == 4" v-bind:class="state==4?'allStepTextColor':''">已取消</div>
                            </div>

                        </div>
                    </div>
                    <div class="relation">
                        <a :href="'tel:'+relations">
                            联系物业
                        </a>
                    </div>
                    <div class='repairInfo'>
                        <div>
                            <span>投诉人：</span>
                            <span v-cloak>{{submitName}}</span>
                        </div>
                        <div>
                            <span>联系电话：</span>
                            <span v-cloak>{{mphone}}</span>
                        </div>
                        <div>
                            <span>事项：</span>
                            <span v-cloak>{{complainItemDict}}</span>
                        </div>
                        <div>
                            <span>处理人员：</span>
                            <span v-cloak>{{dealName}}</span>
                        </div>
                        <div>
                            <span>投诉时间：</span>
                            <span v-cloak>{{createTime}}</span>
                        </div>
                        <div>
                            <span>内容：</span>
                            <span v-cloak>{{comContent}}</span>
                        </div>
                        <div class='addPhoto'>
                            <div v-if="repairPhoto.length>0">图片：</div>
                            <div class="photoContent">
                                <div class='photo' v-for="(item,index) in repairPhoto">
                                    <img :src="item" @click="funcReadImgInfo(index,item)" alt="">
                                </div>
                            </div>
                        </div>
                        <!-- 评价 -->
                        <template v-if="state>1">
                            <div style="margin-bottom:15px;" v-if="state<4">
                                <div class="start">
                                    <span>评价：</span>
                                    <ul ref="foodsWrapper" v-if="state == 2">
                                        <li v-for="(item,index) in startList" @click='showStart(index)' v-bind:class="item.current?'active':''"></li>
                                    </ul>
                                    <ul v-if="state==3">
                                        <li v-for="(item,index) in startList2" class="active"></li>
                                    </ul>
                                </div>
                                <div>
                                    <mt-field v-if="state==2" placeholder=" 请为物业工作人员做出评价，谢谢！" type="textarea" rows="3" v-model="introduction" class="repairContentTextarea"></mt-field>
                                    <div v-if="state==3" v-cloak>{{remark}}</div>
                                </div>

                            </div>
                        </template>
                        <div style="text-align:center;display: -webkit-box;display: -webkit-flex;display: flex;justify-content:space-around;">
                            <div type="default" v-if="state==2" @click="submitEvaluates" class="containBtn">提交</div>
                            <div type="default" v-if="state==2" class="containBtn">
                               <router-link :to="{path:'/myComplain'}">返回</router-link> 
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
       <div v-show="zzShow" class="mint-msgbox-wrapper" style="position: absolute; z-index: 2005;" @click= "viewImg" v-cloak >
    　　　　 <!-- 遮罩层 -->
    　　　　 <div class="v-modal" @touchmove.prevent></div>
    　　　　 <div class="imgs ">
                <!-- <mt-swipe :auto="0" > -->
                    <img :src="defaultSrc" alt="">
                <!-- </mt-swipe> -->
    　　　　 </div>
        </div>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { Swipe, SwipeItem } from 'mint-ui'
import {
  infoDetailPort,
  relationWyPort,
  submitEvaluatesPort,
  zhuHuRemindPort
} from "@/api/complainDetail";
 import back from '../../components/backHeader';
 import { Indicator } from 'mint-ui';
export default {
  components: {
        Swipe, SwipeItem,back
    },
  data() {
    return {
       zzShow:false,
        repairPhoto: [
        ],
        startList: [
            { current: false },
            { current: false },
            { current: false },
            { current: false },
            { current: false }
        ],
        startList2: [],
        introduction: '',
        evaluateTime: '',
        state: '',
        cmpOrderNo: '',
        submitName: '',
        mphone: '',
        dealName: '',
        createTime: '',
        comContent: '',
        remark: '',
        dealTimes: '',
        relations: '',
        resCode: '',
        complainItemDict:'',
        evaluate:0,
        defaultSrc:'',
        remindTime:'',//上一次提醒成功的时间
        fastRemindTime:'',
    };
  },
  async created() {
    var that = this;
        Indicator.open({
                spinnerType: 'fading-circle'
            });
        var cmpOrderNoWeb = Util.GetUrlParam("cmpOrderNo");
         var openIds = Util.GetUrlParam("openId");
        if (cmpOrderNoWeb) {
            that.cmpOrderNo = cmpOrderNoWeb
        }
        var userData = this.$store.state.resUser
        var paramsresCode = '';
        for (var i = 0; i < userData.resMyhouse.length; i++) {
            if (userData.resMyhouse[i].isDefaultHouse == 1) {
                paramsresCode = userData.resMyhouse[i].resCode
                break;
            }
        }
        that.resCode = paramsresCode;
        await that.infodetail();
        await that.relationWy();
  },

  methods: {
    async infodetail() {
            let that = this;
            that.repairPhoto = [];
          await infoDetailPort({cmpOrderNo: that.cmpOrderNo}).then(res=>{
               Indicator.close()
                let rtnData = res.data;
                if (rtnData.info == 'success') {
                    let rtnInfo = rtnData.data.orderDetail;
                    let orderStatusDict = rtnData.data.orderStatusDict;
                    let complainItemDict = rtnData.data.complainItemDict;
                    let complainTypeDict = rtnData.data.complainTypeDict;
                    let cmpImgInfo = rtnData.data.cmpImgInfo;
                    that.submitName = rtnInfo.submitName;
                    that.mphone = rtnInfo.mphone;
                    that.dealName = rtnInfo.lastModUser;
                    that.createTime = rtnInfo.createTime;
                    that.comContent = rtnInfo.cmpContent;
                    that.state = rtnInfo.orderStatus;
                    that.complainItemDict = Util.getTypeJsonText(complainItemDict, rtnInfo.cmpItem);
                    that.orderStatus = Util.getTypeJsonText(orderStatusDict, rtnInfo.orderStatus);
                    that.dealTimes = Util.getDealTimes(rtnInfo.createTime, rtnInfo.lastModTime, rtnData.data.currentTime, rtnInfo.orderStatus)
                    that.remark = rtnInfo.remark;
                    that.evaluate = rtnInfo.evaluate;
                    if(rtnInfo.remindTime !=''){
			        	that.remindTime =Util.remindTimes(rtnInfo.remindTime).minute;
                        that.fastRemindTime = Util.remindTimes(rtnInfo.remindTime).lastTime;		        		
		        	}
                    var evaluateArr = []
                    for (let i = 0; i < rtnInfo.evaluate; i++) {
                        evaluateArr.push('current')
                    }
                    that.startList2 = evaluateArr;
                    for (let j = 0; j < cmpImgInfo.imgList.length; j++) {
                        that.repairPhoto.push(cmpImgInfo.imagePath + cmpImgInfo.imgList[j]);
                    }
                } else {
                    Toast('网络请求失败')
                }
            }).catch(function(){})
        },
        async relationWy() {
            let that = this;
           await relationWyPort({resCode: that.resCode}).then(res=>{
                let rtnData = res.data;
                if (rtnData.info == 'success') {
                    that.relations = rtnData.data;
                } else {
                    Toast('网络请求失败')
                }
            }).catch(function(error){})
        },
        showStart: function (num) {
            var that =this;
            that.evaluate = num + 1;
            let startList = this.$refs.foodsWrapper.getElementsByTagName('li')
            for (var i = 0; i < startList.length; i++) {
                if (i <= num) {
                    this.startList[i].current = true;
                } else {
                    this.startList[i].current = false;
                }
            }
        },
             //提醒物业
             remind:function(){
                var that =this;
                if(!that.fastRemindTime){
                    that.$options.methods.zhuHuRemind(that)
            }else{
                if(that.remindTime>600){
                    that.$options.methods.zhuHuRemind(that)
                }else{
                    that.$options.methods.formatRemingTime(that.fastRemindTime,that);
                    Toast('十分钟内不能重复提醒')
                 }
             }
            },
            zhuHuRemind:function(that){
                zhuHuRemindPort({cmpOrderNo: that.cmpOrderNo}).then(res=>{
                    let rtnData = res.data;
                    if (rtnData.info == 'success') {
                        Toast('提醒成功')
                        that.$options.methods.formatRemingTime('1',that);
                    } else {
                       Toast('网络请求失败')
                    }
                }).catch(function(error){})
            },

        // 评价
        submitEvaluates: function () {
            let that = this;
            let params={
                        cmpOrderNo: that.cmpOrderNo,
                        remark: that.introduction,
                        evaluate: that.evaluate
                    }
            if (that.evaluate != '0') {
                submitEvaluatesPort(params).then(res=>{
                    let rtnData = res.data;
                    if (rtnData.info == 'success') {
                        that.infodetail()
                    } else {
                        Toast('网络请求失败')
                    }
                }).catch(function(error){})
               
            } else {
                Toast('请为物业工作人员打星，谢谢！')
            }

        },
 // 点击放大图
        /*调用微信预览图片的方法*/
        funcReadImgInfo:function(index,src){   
            this.zzShow =true;
            this.defaultSrc = src;
            window.scrollTo(0,0);
            document.documentElement.style.overflow='hidden';
        },
        viewImg:function(){
            this.zzShow = false;
            document.documentElement.style.overflow='auto';
        },
       formatRemingTime:function (lastTime,that){
             var tDate = new Date();
             var year = tDate.getFullYear();
             var month = tDate.getMonth()+1>=10?(tDate.getMonth()+1):'0'+(tDate.getMonth()+1);
             var day = tDate.getDate()>=10?tDate.getDate():'0'+tDate.getDate();
             var hour = tDate.getHours()>=10?tDate.getHours():'0'+tDate.getHours();
             var minute = tDate.getMinutes()>=10?tDate.getMinutes():'0'+tDate.getMinutes();
             var second = tDate.getSeconds()>=10?tDate.getSeconds():'0'+tDate.getSeconds();
              if(lastTime == '1'){
                      lastTime = year +'/'+ month +'/'+ day +' '+ hour+':'+minute+':'+second;
                 }
                 that.remindTime =Util.remindTimes(lastTime).minute;
                 that.fastRemindTime = Util.remindTimes(lastTime).lastTime;
         }
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/complainDetail.less";
@import "../../assets/less/publicRepairDetail.less";
@import "../../assets/less/repair.less";
@import "../../assets/less/complainAndSuggest.less";
a{
    color: white;
}
</style>
