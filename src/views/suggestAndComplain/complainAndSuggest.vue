<template>
     <div>
        <div class="repair" style="margin-top:20px;">
            <div class="toggleComType" @click="check" v-cloak>{{options}}</div>
            <mt-tab-container>
                <mt-tab-container-item v-if="boxShow">
                    <div class="repairBox">
                        <div class="comBox">
                            <div class="comBackground">投诉建议</div>
                            <div style="padding:0.5rem 1rem;">
                                <div class="publicRepair" style="display: -webkit-box;display: -webkit-flex;display: flex;align-items:center;justify-content:space-between;">
                                    <mt-cell title="小区" v-model="areaName"  :to="{path:'/myHouse',query:{addHouseState:'addHouse',router:'complainAndSuggest'}}" value="" style="width:100%">
                                    </mt-cell>
                                    <img src="../../../static/images/jiantou.png" alt="" style="width:0.6rem;height:1.2rem;">
                                </div>
                                <div class="publicRepair mint-cell mint-field" style="display: -webkit-box;display: -webkit-flex;display: flex;align-items:center;justify-content:space-between;">
                                    <div class="mint-cell-wrapper">
                                        <div class="mint-cell-title">
                                            <span class="mint-cell-text">事项</span>
                                        </div>
                                        <select name="" id="" class="mint-cell-value" v-model="cmpItem">
                                            <option value="">请选择</option>
                                            <option v-for="(item,index) in getTSdic" :key='index' :value="item.id">{{item.text}}</option>
                                        </select>
                                    </div>
                                    <img src="../../../static/images/jiantou.png" alt="" style="width:0.6rem;height:1.2rem;">
                                </div>
                                <mt-field placeholder="请描述您的投诉建议内容" type="textarea" rows="3" v-model="cmpContent" class="repairContentTextarea" style="margin-top:1rem;"></mt-field>
                                <div class='addPhoto'  v-cloak>
                                    <div class='addBtn' @click="addPhoto1" v-if="repairPhoto1.length<=0">添加图片</div>
                                    <div class="photoContent">
                                        <div class='photo' v-for="(item,index) in repairPhoto1"  :key='index'>
                                            <div class="removePhoto" @click="removePhoto1(index)">
                                                <img src="../../../static/images/removePhoto.png" alt="">
                                            </div>
                                            <img :src="item" alt="">
                                        </div>
                                        <div class='photo' @click="addPhoto1" v-if="repairPhoto1.length>0 && repairPhoto1.length<6" >
                                            <img src="../../../static/images/addPhoto.png" alt="">
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <mt-button class="next" type="primary" size="large" @click="submitCom"  v-cloak>提交</mt-button>
                    </div>
                </mt-tab-container-item>
                <!-- 表扬 -->
                <mt-tab-container-item v-if="!boxShow"  v-cloak>
                    <div class="repairBox">
                        <div class="comBox">
                            <div class="comBackground">表扬</div>
                            <div style="padding:0.5rem 1rem;">
                                 <div class="publicRepair reAddr marginBto mint-cell" style="padding:0 10px;">
                                        <span>表扬对象</span>
                                        <div style="width:70%;">
                                            <input type="text" v-model="cmpTarget" placeholder="请输入表扬对象" style="width:100%;">
                                        </div>
                                        
                                    </div>
                                <!-- <mt-field label="表扬对象" class="publicRepair" placeholder="请输入表扬对象" v-model="cmpTarget"></mt-field> -->
                                <mt-field placeholder="请输入表扬原因" type="textarea" rows="3" :attr="{ maxlength: 200}" v-model="praiseReason" class="repairContentTextarea" style="margin-top:1rem;"></mt-field>
                                <div class='addPhoto'>
                                    <div class='addBtn' @click="addPhoto2" v-if="repairPhoto2.length<=0">添加图片</div>
                                    <div class="photoContent">
                                        <div class='photo' v-for="(item,index) in repairPhoto2"  :key='index'>
                                            <div class="removePhoto" @click="removePhoto2(index)">
                                                <img src="../../../static/images/removePhoto.png" alt="">
                                            </div>
                                            <img :src="item" alt="">
                                        </div>
                                        <div class='photo' @click="addPhoto2" v-if="repairPhoto2.length>0 && repairPhoto2.length<6">
                                            <img src="../../../static/images/addPhoto.png" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <mt-button class="next" type="primary" size="large" @click="submitPraise">提交</mt-button>
                    </div>

                </mt-tab-container-item>
            </mt-tab-container>
        </div>
    </div>
</template>

<script>
 import wx from 'weixin-js-sdk';
 import { getSignaturePort,getcurrentAreaPort,getSdicPort,comSubmitPort } from '@/api/complainAndSuggest';
import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
 import { Indicator } from 'mint-ui';
export default {
    data() {
      return {
        boxShow: true,
        btnShow: true,
        btnShow2: true,
        repairPhoto1: [],
        repairPhoto5: [
            '../../../static/images/addPhoto.png',
             '../../../static/images/addPhoto.png',
              '../../../static/images/addPhoto.png',
               '../../../static/images/addPhoto.png'
        ],
        repairPhoto2: [],
        options: '表扬',
        //    投诉建议
        getTSdic: [],
        resCode: '',
        resUserId: '',
        buildingId: '',
        cmpItem: '',
        cmpTarget: '',
        cmpContent: '',
        // 表扬原因
        praiseReason: '',
        //  当前小区
        areaName: '',
        serverId1:[],
        serverId2:[]
      }
    },
    async created() {
         var that = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        });

         var userData = this.$store.state.resUser 
         if(userData){
            for (let i = 0; i < userData.resMyhouse.length; i++) {
                if (userData.resMyhouse[i].isDefaultHouse == '1') {
                    that.buildingId = userData.resMyhouse[i].buildingId;
                    that.resCode = userData.resMyhouse[i].resCode;
                }
            } 
            that.resUserId = userData.resUserId
        }
        
        //  获取当前小区
        await that.getcurrentArea();
        //  获取报修事项
        await that.getSdic();
        // 获取签名
    //    var u = navigator.userAgent;
    //     var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端                                  
    //     var isiOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // //ios终端
    //     if (isAndroid) {
    //         let url=window.location.href.split("#")[0];
    //         getSignaturePort({url:url})
    //             .then(res => {
    //                 Indicator.close();
    //                 let rtnData = res.data
    //                 if (rtnData.info == 'success') {
    //                     wx.config({
    //                         debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //                         appId: 'wx2a5e764e09995af1', // 必填，公众号的唯一标识
    //                         timestamp: rtnData.data.timestamp, // 必填，生成签名的时间戳
    //                         nonceStr: rtnData.data.nonceStr, // 必填，生成签名的随机串
    //                         signature: rtnData.data.signature,// 必填，签名，见附录1
    //                         jsApiList: ['chooseImage', 'getLocalImgData', 'uploadImage', 'downloadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //                     });
    //                 }
    //             })
    //             .catch(error => {});
    //     }

    },

    methods: {
         // 获取当前小区
       async getcurrentArea(){
            var that = this;
            getcurrentAreaPort({
                resUserId: that.resUserId,
                resCode: that.resCode
            }).then(res=>{
               var rtnDate = res.data;
                Indicator.close();
                if (rtnDate.info == 'success') {
                    that.areaName = rtnDate.data[0].resiAreaName;
                } else { Toast('网络请求失败') }
            }).catch(function(error){})
        },
        // 获取投诉事项
        async getSdic(){
            var that = this;
            getSdicPort({resCode: that.resCode}).then(res=>{
                 var rtnDate = res.data;
                if (rtnDate.info == 'success') {
                    that.getTSdic = rtnDate.data;
                } else {Toast('网络请求失败') }
            }).catch(function(erroer){})
        },
        // 选择投诉还是表扬
        check: function () {
            this.repairPhoto1 = [];
            this.repairPhoto2 = [];
            if (this.boxShow == true) {
                this.boxShow = false;
                this.options = '投诉建议'
            } else {
                this.boxShow = true;
                this.options = '表扬'
            }
        },
        addPhoto1: function () {
            if (this.repairPhoto1.length > 0) {
                this.btnShow = false;
            } else {
                this.btnShow = true;
            }
            var that = this;
            if(that.repairPhoto1.length<6){
                 console.log('即将调用')
                wx.chooseImage({
                    count: 6-that.repairPhoto1.length,
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                    success: function (res) {
                        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                        console.log(localIds)
                        // that.repairPhoto1.push(res.localIds);
                        Indicator.open({
                            text:'正在上传图片，请稍后...',
                            spinnerType: 'fading-circle'
                        });
                        that.uploadImages(localIds,0,'complain')
                        for(let i =0;i<localIds.length;i++){
                            that.repairPhoto1.push(localIds[i]);
                        }
                    },
                    fail:function(error){
                        alert(error)
                    }
               })
            }else{
                Toast('您最多可上传6张图片')
            }
        },
        uploadImages:function(localIds,i,type){
                let that = this;
                wx.uploadImage({
                    localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId;
                        if(type =='complain'){
                            that.serverId1.push(serverId); 
                        }else if(type =='parise'){ 
                            that.serverId2.push(serverId);
                        }
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
       
        addPhoto2: function () {
            if (this.repairPhoto2.length > 0) {
                this.btnShow2 = false;
            } else {
                this.btnShow2 = true;
            }
            var that = this;
            if(that.repairPhoto1.length<6){
            wx.ready(function () {
                wx.chooseImage({
                    count: 6-that.repairPhoto1.length,
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                    success: function (res) {
                        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                        Indicator.open({
                            text:'正在上传图片，请稍后...',
                            spinnerType: 'fading-circle'
                        });
                        that.uploadImages(localIds,0,'parise')
                        for(let i =0;i<localIds.length;i++){
                            that.repairPhoto2.push(localIds[i]);
                        }
                
                    },
                });
            })
        }else{
                that.$toast('您最多可上传6张图片')
            }
        },
        removePhoto1: function (index) {
            this.serverId1.splice(index,1)
            this.repairPhoto1.splice(index, 1);
        },
        removePhoto2: function (index) {
            this.serverId2.splice(index,1)
            this.repairPhoto2.splice(index, 1);
        },
        async publicSubmit(cmpType, cmpItem, cmpContent, cmpTarget, mediaId) {
            var that = this;
            var mediaIdStr = mediaId.join(',')
            let params={
                    resUserId: that.resUserId,//
                    resCode: that.resCode,
                    buildingId: that.buildingId,//
                    cmpType: cmpType,//投诉类别:1:投诉建议, 3:表扬
                    cmpItem: cmpItem,//投诉事项
                    cmpContent: cmpContent,//投诉内容
                    cmpTarget: cmpTarget,//投诉（表扬）对象
                    mediaId:mediaIdStr
                }
            Indicator.open({
                text:'正在提交中，请稍后...',
                spinnerType: 'fading-circle'
            });
            comSubmitPort(params).then(res=>{
                 let rtnData = res.data;
                if (rtnData.info == 'success') {
                    that.cmpItem = '';
                    that.cmpContent ='';
                    that.boxShow=true;
                    that.btnShow= true;
                    that.btnShow2= true;
                    that.repairPhoto1=[];
                    that.repairPhoto2= [];
                    that.cmpTarget='';
                    that.praiseReason = '';
                    that.serverId1=[];
                    that.serverId2=[];
                    Indicator.close();
                    that.$router.push({path:'/complainSuccess',query:{resUserId:that.resUserId}})
                } else { that.$toast('网络请求失败') }
            }).catch(function(){})
        },
        

        // 投诉提交
        async  submitCom() {
            if (this.cmpItem == '') {
                this.$toast('请选择投诉建议事项');
                return;
            } else if (this.cmpContent == '') {
                this.$toast('请描述您的投诉建议内容');
                return;
            }else if(this.cmpContent.length >200){
                this.$toast('请输入少于200字的投诉建议内容');
            }else {
                await this.publicSubmit('1', this.cmpItem, this.cmpContent, '', this.serverId1)
            }

        },
        // 表扬提交
        async  submitPraise() {
            if (this.praiseReason == '') {
                this.$toast('请输入表扬原因')
                return
            } else if (this.praiseReason.length < 10) {
                this.$toast('请输入不少于10字的表扬原因')
            }else if(this.cmpContent.length >200){
                this.$toast('请输入少于200字的表扬原因');
            } else {
                await this.publicSubmit('3', '', this.praiseReason, this.cmpTarget, this.serverId2)
            }

        }

    }
};
</script>
<style lang="less">
.mint-cell-wrapper,.mint-cell:last-child {
        background-image: none !important;
         background-color: white !important;
    }
</style>

<style lang="less" scoped>
@import "../../assets/less/repair.less";
@import "../../assets/less/complainAndSuggest.less";
   select {
            width: 100%;
            -webkit-appearance: none;
            border: none;
            outline: none;
            /* text-align: right; */
            direction: rtl;
            background-color: white;
        }
    
        [v-cloak] {
            display: none
        }
</style>
