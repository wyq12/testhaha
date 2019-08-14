<template>
     <div  style="position: relative;overflow: hidden;">
            <div class="loginMax">
                <div class="loginBox boxOne">
                    <p class="loginTit">物业登录</p>
                    <div class="fieldBox">
                        <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
                    </div>
                    <div class="fieldBox">
                        <mt-field label="验证码" placeholder="请输入验密码" type="code" v-model="code" style="width: 70%;float: left;"></mt-field>
                        <mt-button size="small" v-show="show" type="primary" style="width: 28%;" class="getCode" @click="getCode">获取验证码</mt-button>
                        <mt-button size="small" v-show="!show" type="primary" style="width: 28%;color:#fff;background-color:#999" class="getCode count" >{{count}} s</mt-button>
                    </div>
                    <div class="loginCheck">
                        <mt-button size="normal" type="primary" @click='boxOneDrop'>立即登录</mt-button>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import {
  WXnickPort,bindingPhonePort
} from "@/api/serviceLogin";
export default {
  data() {
    return {
        cityData:[],
        phone:'',
        code:'',
        show: true,
        count: '',
        timer: null,
        boxOneisShow:true,
        boxTwoisShow:false,
        boxThrisShow:false,
        trueName:'',
        popupVisible:false,
        idenValue:'',
        loginMaxIsShow:true,
        openMaxIsShow:false,
        openId:"",
        headImage:'1',//测试暂时写死
        nickName:'1'//测试暂时写死
    };
  },
  created:function() {
        var self=this
        var countId=Util.GetUrlParam("countId");
        this.openId=this.$store.state.openId;
        WXnickPort({openId:this.openId}).then(response =>{
            console.log(response.data.data)
            if (response.data.info=='success') {
                self.headImage=response.data.data.headimgurl
                self.nickName=response.data.data.nickname
            }
        }).catch(function(error){})
  },

  methods: {
        dropChooseHouse:function(){
                // window.location.href='chooseHouse.html'
                this.$router.push({name:'chooseHouse'})
            },
        boxOneDrop:function(){
            var that=this
            if(!that.code){
                Toast('验证码不能为空不能为空');
            }else if(!that.phone){
                Toast('手机号码不能为空不能为空');
            }else{
                var self=this
                let params={
                        userName:that.phone,
                        code:that.code,
                        openId:that.openId,
                        headImage:that.headImage,
                        nickName:that.nickName,
                        loginType:2
                    }
                bindingPhonePort(params).then(response=>{
                    if(response.data.info=='success'){
                        // window.localStorage.setItem('resUserId',response.data.data.smnUserId)
                        this.$store.commit('alterResUserId',response.data.data.smnUserId)
                        this.$store.state.userInfo_smn = JSON.stringify(response.data.data)
                        this.$store.state.serviceIsOk = 'true'
                        // window.localStorage.setItem('userInfo_smn',JSON.stringify(response.data.data))
                        // window.localStorage.setItem('serviceIsOk','true')
                        // window.location.href='index.html'
                    }else{
                        Toast(response.data.message);
                    }
                }).catch(function(error){})
            }
        },
        boxTwoDrop:function(){
            this.boxThrisShow=true
            this.boxTwoisShow=false
        },
        boxThrDrop:function(){
            this.boxThrisShow=false
        },
        getCode(){//验证码倒计时
            const TIME_COUNT = 60;
            if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                }
            }, 1000)
            }
        },
        openDoorBtn:function(){
            this.openMaxIsShow=true
        }
    }
   
};
</script>

<style lang="less" scoped>
@import '../assets/less/serviceLogin.less';
</style>

