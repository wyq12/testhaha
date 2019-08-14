<template>
    <div class="deviceSuccessBg">
        <div class="deviceOne">
             <div style="height:12.1vh"></div>
             <div class="reportContain">
                 <div class="listleftBorder"></div>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                         <span>任务名称</span>
                         <span class="overflowHidden">{{scheduleLog.taskName}}</span>
                     </div>
                 </div>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                        <span>执行人</span>
                        <select name="" id=""  v-model="deviceCurrentLeader">
                            <option value="">请选择</option>
                            <option v-for="(item,index) in userList" :value="item[0]"  :key = 'index'>{{item[1]}}</option>
                        </select>
                     </div>
                 </div>
                 <!-- 替班人员 -->
                 <template v-if="deviceCurrentLeader=='0'">
                    <div class="listleftBorder">
                        <div class="reportDot"></div>
                        <div class="list">
                            <span>替班人员</span>
                            <input type="text" v-model="trueName" placeholder="请填写您的姓名" class="inputText">
                        </div>
                    </div>
                    <div class="listleftBorder">
                        <div class="reportDot"></div>
                        <div class="list">
                            <span>联系方式</span>
                            <input type="text" v-model="mphone" placeholder="请填写您的电话" class="inputText">
                        </div>
                    </div>
                 </template>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                         <span>所属物业</span>
                         <span class="overflowHidden">{{orgName}}</span>
                     </div>
                 </div>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                         <span>设备名称</span>
                         <span class="overflowHidden">{{deviceName}}</span>
                     </div>
                 </div>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                         <span>设备地址</span>
                         <span class="overflowHidden">{{deivceUrl}}</span>
                     </div>
                 </div>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div class="list">
                         <span>情况反馈</span>
                         <span class="overflowHidden">
                             <input type="radio" name="" id="" value="1" v-model = "caseState">正常 &nbsp;&nbsp;
                             <input type="radio" name="" id="" value="2"  v-model= "caseState">异常
                         </span>
                     </div>
                 </div>
                 <!-- <textarea name="" id="" cols="35" rows="6" placeholder="请您描述相关反馈内容" v-model="introduction" class="deviceContentTextarea"></textarea> -->
                  <mt-field placeholder="请您描述相关反馈内容" type="textarea" rows="3" v-model="introduction" class="deviceContentTextarea"></mt-field>
                 <div class="listleftBorder">
                     <div class="reportDot"></div>
                     <div style="width:95%;">
                         <span>巡检照片</span>
                     </div>
                 </div>
                 <div style="flex-wrap:wrap;">
                     <div class='photo' v-cloak v-for="(item,index) in devicePhoto">
                        <div class="removePhoto" @click="removePhoto(index)">
                            <img src="../../../../static/images/removePhoto.png" alt="">
                        </div>
                        <img :src="item" alt="">
                     </div>
                     <div class='photo' @click="addPhoto" v-if="devicePhoto.length<6">
                         <img src="../../../../static/images/addPhoto.png" alt="">
                     </div>
                 </div>
                 
             </div>
             <div class="submitBtn" @click="reportSubmit">完 成</div>      
        </div>
    </div>
</template>
<script>
 import wx from 'weixin-js-sdk';
 import { getSignature } from '@/api/repair';
 import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
 import { Indicator } from 'mint-ui';
 import {devicePagePort,reportSubmitPort,reportListPort,reportUserPort} from "@/api/device";
export default {
    data(){
        return{
           caseState:"",
           introduction:'',//反馈内容描述
           deviceCurrentLeader:'',//设备执行人
           deviceLeaderList:[
                {name:'张三',id:'1'},
                {name:'李四',id:'2'},
                {name:'其他',id:'0'},
           ],
           devicePhoto:[],
           serverId:[],
           id:'',
           mphone:'',
           trueName:'',
        //  接口返回
           deivceUrl:'',
           orgName:'',
           scheduleLog:{},
           userList:[],
           deviceId:'',
           deviceName:''
        }
    },
    created(){
        this.id = Util.GetUrlParam('id');
        Indicator.open({
            spinnerType: 'fading-circle'
        });
          // 　　　获取签名
        // var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端                                  
        // var isiOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // //ios终端
        // if (isAndroid) {
        //     let url=window.location.href.split("#")[0];
        //     getSignature({url:url})
        //         .then(res => {
        //             let rtnData = res.data
        //             if (rtnData.info == 'success') {
        //                 wx.config({
        //                     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //                     appId: 'wx2a5e764e09995af1', // 必填，公众号的唯一标识
        //                     timestamp: rtnData.data.timestamp, // 必填，生成签名的时间戳
        //                     nonceStr: rtnData.data.nonceStr, // 必填，生成签名的随机串
        //                     signature: rtnData.data.signature,// 必填，签名，见附录1
        //                     jsApiList: ['chooseImage', 'getLocalImgData', 'uploadImage', 'downloadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        //                 });
        //             }
        //         }).catch(error => {});
        // }
        // 加载页面
        devicePagePort({id:this.id}).then(res=>{
            let resData = res.data
            Indicator.close();
            if(resData.info == "success"){
               this.deivceUrl = resData.data.deivceUrl;
               this.orgName =  resData.data.orgName;
               this.scheduleLog =  resData.data.scheduleLog;
               this.userList =  resData.data.userList;
               this.userList.push(['0','其他']);
               this.deviceId = resData.data.device.id;
               this.deviceName = resData.data.device.deviceName
            }else{
                Toast('网络请求失败，请稍候再试！')
            }
        }).catch(function(error){})
    },
     
    methods:{
        //  上传图片
        addPhoto:function(){
            let that = this;
            if(that.devicePhoto.length<6){
                    wx.chooseImage({
                        count: 6-that.devicePhoto.length,
                        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                        success: function (res) {
                            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                            Indicator.open({
                                text:'正在上传图片中，请稍后...',
                                spinnerType: 'fading-circle'
                            });
                            that.uploadImages(localIds,0)
                            for(let i =0;i<localIds.length;i++){
                                that.devicePhoto.push(localIds[i]);
                            }
                        },
                    });
            }else{
                Toast('您最多可上传6张图片')
            }
        },
         uploadImages:function(localIds,i){
            let that = this;
            wx.uploadImage({
                localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId;
                    that.serverId.push(serverId); 
                    if(i<localIds.length-1){
                        setTimeout(function(){
                            i++;
                            that.uploadImages(localIds,i);
                        },100);
                    }else{
                        Indicator.close();  
                    }
                }
            })
        },
        // 移除图片
        removePhoto: function (index) {
            let that = this;
            this.serverId.splice(index,1);
            this.devicePhoto.splice(index,1)
        },
        // 提交
        reportSubmit:function(){
            let that = this;
            var mediaIdStr = that.serverId.join(',')
            let params ={
                scheduleId:this.scheduleLog.id,
                taskCode:this.scheduleLog.taskCode,
                taskName:this.scheduleLog.taskName,
                // deviceId:this.scheduleLog.deviceId,
                // deviceName:this.scheduleLog.deviceName,
                deviceId:this.deviceId,
                deviceName:this.deviceName,
                state:this.caseState,
                remark:this.introduction,
                userId:this.deviceCurrentLeader,
                trueName:this.trueName,
                mphone:this.mphone,
                mediaId:mediaIdStr
            }
            if(this.deviceCurrentLeader==''){
               Toast('请选择执行人员')
            }else if(this.deviceCurrentLeader=='0'){
                if(this.trueName == ''){
                    Toast('请输入替班人姓名')
                }else if(this.mphone == ''){
                    Toast('请输入替班人联系方式')
                }else if(this.caseState==''){
                    Toast('请选择设备情况')
                }else if(this.introduction == ''){
                    Toast('请填写设备相关反馈内容')
                }else{
                    reportSubmitPort(params).then(res=>{
                        
                        if(res.data.info="success"){
                            console.log(res.data.info)
                            that.$router.push({name:'deviceSuccess',query:{'id':that.deviceCurrentLeader,'mphone':this.mphone}})
                        }else{
                            Toast('网络异常，请稍后在试')
                        }
                    }).catch(function(error){})
                }
            }else if(this.caseState==''){
                Toast('请选择设备情况')
            }else if(this.introduction == ''){
                Toast('请填写设备相关反馈内容')
            }else{
                reportSubmitPort(params).then(res=>{
                     console.log(res)
                    if(res.data){
                       if(res.data.info="success"){
                          
                         that.$router.push({name:'deviceSuccess',query:{'id':that.deviceCurrentLeader,'mphone':this.mphone}})
                      } else{
                          Toast(res.data.message)
                      }
                    }else{
                        Toast('网络请求失败')
                    }
                    
                }).catch(function(error){})
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/loading.less';
@import '../../../assets/less/repair.less';
select {
    width: 60%;
    -webkit-appearance: none;
    border: none;
    outline: none;
    text-align: center;
    direction: rtl;
     background-color: white;
}
.deviceOne{
    box-shadow:0px 1px 1px 1px #D4D4D4;
    margin-bottom: 10px;
    padding-bottom: 0.6rem;
    
}
.deviceSuccessBg{
     background-color: white;
    background-image: url('../../../../static/images/deviceBg.png');
    background-size: 100%;
    background-repeat:no-repeat;
    padding: 0 1rem;
}
.listleftBorder{
    font-size: 15px;
    color: #888;
    border-left: 1px solid #e6e6e6;
    width: 100%;
    height: 2rem;
    display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
    display: -webkit-flex;     /* 新版本 - 适配Chrome */
    display: flex;  
    align-items: center;
    justify-content: space-between;
    & .addPhoto{
        
    }
}
.reportContain{
    padding: 1rem;
}
.reportDot{
    width: 5px;
    height: 5px;
    border: 1px solid #518dea;
    border-radius: 50%;
    margin-left: -4.5px;
}

.submitBtn{
    width: 12.5rem;
    height: 1.5rem;
    background-image: linear-gradient(to right,#2196F3,#518dea);
    opacity: 0.7;
    color: white;
    line-height: 1.5rem;
    text-align: center;
    border-radius: 2rem;
    margin: 0 auto;
    font-size:17px;
}
.list{
    display: inline-block;
    width: 95%;
    line-height: 1.5rem;
    display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
    display: -webkit-flex;     /* 新版本 - 适配Chrome */
    display: flex;  
    align-items: center;
    justify-content: space-between;
}
.overflowHidden{
    text-align:right;
    display: inline-block;
    width: 67%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
.mint-radiolist{
    display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
    display: -webkit-flex;     /* 新版本 - 适配Chrome */
    display: flex;  
    align-items: center;
    justify-content: space-between;
}
.deviceContentTextarea{
    border:1px solid #B6D7FB;
    font-size: 15px;
    outline: none;
}
.mint-radio-core{
    width: 16px;
    height: 16px;
}
.inputText{
    border: none;
    outline: none;
    text-align: right;
    width: 60%;
}
</style>


