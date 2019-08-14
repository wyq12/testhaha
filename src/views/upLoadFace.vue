<template>
    <div  style="text-align: center;">
            <div class="maskTishi" v-show="maskTishi">
                <div style="width: 90%;
                margin: 0 auto;
                background-color: #fff;
                border-radius: 10px;
                padding: 10px;padding-bottom: 15px;"><img src="../../static/images/tishiGif.gif" alt="" style="width:100%">
                <p>点击确定添加人脸照片</p>    
                <div  @click='tishiClose' class="tishiClose">确       定</div>
            </div>
            </div>
            <div class="mask" v-show="maskState"></div>
            <div class="max">
                <div class="photoBox">
                    <div style="text-align: center;
                    width: 100%;
                    margin: 0 auto;
                    height: 1rem;">
                        <div class="photoBor" @click=uploadBtn>
                            <img :src=photoUrl alt="" style='max-height: 14rem;'>
                            <!-- <img src="../../static/images/addPhoto.png" alt="" style='height: 6rem;'> -->
                        </div>
                        <div class="photoBtnBox">
                            <span ><img src="../../static/images/faceBtn1.png" alt="" @click=returnBtn style="width:40%"></span>
                            <span><img src="../../static/images/faceBtn2.png" @click=uploadImg alt=""  style="width:40%"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
 import { getSignature} from '@/api/repair';
 import {WXPfacePort,faceUrlPort,lockApplyFace} from '@/api/upLoadFace'
  import { Toast } from 'mint-ui';
 import Util from '@/libs/util.js'
 import wx from 'weixin-js-sdk';
export default {
    data(){
        return{
                seacherValue:'',
                value:[],
                options:['2017-88-88'],
                localIds:'',
                photoUrl:require('../../static/images/addPhoto.png'),
                isphoto:false,
                resUserId:'',
                maskState:false,
                maskTishi:false,
                type:1//0:未审核前上传人脸   1：审核后上传人脸图片
        }
    },
    created(){
        this.resUserId=this.$store.state.resUser.resUserId;
        this.type = Util.GetUrlParam('type')
        var self=this
        // 　　　获取签名
        // var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端                                  
        // var isiOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // //ios终端
        // if (isAndroid) {
        //     let urls=window.location.href.split("#")[0];
        //     getSignature({url:urls})
        //         .then(response => {
        //             let rtnData = response.data
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
        //         })
        //         .catch(error => {});
        // }
        var countId=Util.GetUrlParam("countId");
        faceUrlPort({resUserId:this.resUserId}).then(response=>{
            var rtnData = response.data
            if (rtnData.info == 'failure') {  
                Toast(rtnData.message)
            }else if (rtnData.info == 'success') {
                self.photoUrl=rtnData.data.imagePath+rtnData.data.fileName
            }
        }).catch(function(){})
    },
    methods:{
        uploadBtn: function(){
            this.maskTishi=true
        },
        tishiClose:function(){
            this.maskTishi=false
            var self=this
            if (this.isphoto==false) {
                wx.ready(function () {
                    wx.chooseImage({  
                        count: 1,  
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
                        success: function (res) {  
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                            self.localIds=res.localIds[0];
                            self.photoUrl=res.localIds;
                            self.isphoto = true;
                        }  
                    });
                })
            }else{
                this.$messagebox.confirm('是否覆盖之前认证的图片?').then(action => {
                    wx.ready(function () {
                        wx.chooseImage({  
                            count: 1,  
                            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
                            success: function (res) {  
                                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                                self.localIds=res.localIds[0];
                                self.photoUrl=res.localIds;
                                self.isphoto = true;
                            },
                            fail:function(error){console.log(error)}
                        });
                    })
                });
            }
        },
        returnBtn:function(){
            // window.location.href='index.html?pathState=1'
            if(self.type == 0){
                self.$router.push({name:'index',query:{pathState:'1',type:0}})
            }else{
               this.$router.push({name:'index',query:{pathState:'1'}})
            }
            
        },
        //具体上传图片  
        uploadImg: function (newlocalIds) {  
             var self=this
             console.log(self.resUserId) 
           
            if(self.localIds==''){
                self.$messagebox.confirm('是否上传图片?').then(action => {
                    self.uploadBtn()
                });
            }else{
                
                self.maskState=true;
                wx.uploadImage({
                    localId: self.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        self.$indicator.open('正在提交信息，请稍后...');
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        if(self.type == 0){
                            lockApplyFace({mediaId: serverId,resUserId:self.resUserId}).then(response =>{
                                if (response.data.info == 'success') {
                                    self.$indicator.close();
                                    self.$messagebox.alert('上传成功!').then(action => {
                                        self.maskState=false;
                                        // window.location.href='index.html?pathState=01'
                                        self.$router.push({name:'index',query:{pathState:'1',type:0}})
                                    });
                                } else {
                                    self.$toast(response.data.info)
                                    self.$indicator.close();
                                    self.maskState=false;
                                }
                            }).catch(function (error) {
                                alert(error)
                                self.$toast('上传图片出现错误')
                                self.$indicator.close();
                                self.maskState=false;
                            });
                        }else{
                            WXPfacePort({mediaId: serverId,resUserId:self.resUserId}).then(response =>{
                                if (response.data.info == 'success') {
                                    self.$indicator.close();
                                    self.$messagebox.alert('上传成功!').then(action => {
                                        self.maskState=false;
                                        // window.location.href='index.html?pathState=01'
                                        self.$router.push({name:'index',query:{pathState:'1'}})
                                    });
                                } else {
                                    self.$toast(response.data.info)
                                    self.$indicator.close();
                                    self.maskState=false;
                                }
                            }).catch(function (error) {
                                alert(error)
                                self.$toast('上传图片出现错误')
                                self.$indicator.close();
                                self.maskState=false;
                            });
                        }
                      
                    },fail:function(res){
                        alert('上传图片出现问题')
                        self.$indicator.close();
                        self.maskState=false;
                    }
                }); 
            }  
        }
    }
}
</script>
<style lang="less" scoped>
   .payTit{
            height: 2rem;
            display: flex;
            align-items: center;
            font-size: 16px;
            background-color: #f1f1f1;
        }
        .mint-cell-wrapper {
            background-image: none;
            background-color: #d7f1ff;
            font-weight: bold;
            padding-left: 0;
        }
        .mint-cell:last-child {
            background-image: none;
        }
        .max{
            background-image: url(../../static/images/uploadFace_bg.png);
            height: 100vh;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .photoBox{
            background-image: url(../../static/images/faceBorder.png);
            background-repeat: no-repeat;
            background-position-y: 2rem;
            height: 28rem;
            background-size: 100%;
            position: relative;
            padding-top: 6rem;
        }
        .photoBor{
            width: 60%;
            height: 14rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
        }
        .photoBtnBox{
            width: 60%;
            margin: 0 auto;
            height: 3rem;
            display: flex;
            justify-content: center;
            margin-top: 3rem;
            
        }
        .photoBtnBox span{
            width: 50%;
        }
        .mask{
            height: 100vh;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
        }
        .maskTishi{
            height: 100vh;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
        }
        .tishiClose{
            width: 40%;
            height: 2rem;
            font-size: 20px;
            background-image: -webkit-linear-gradient(0deg, #aad7fe, #97bbf2);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
        }
</style>


