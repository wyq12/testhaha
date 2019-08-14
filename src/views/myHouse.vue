<template>
    <div><back></back>
    <div style="padding: 0.5rem 1rem;">
            <div style="padding-bottom: 1rem;box-shadow: rgb(153, 153, 153) 0px 0px 5px">
            <div class="pageIit" style="display: flex;justify-content: center;align-items: center;font-size: 24px;">我的房屋</div>
            <div style='position: relative;'>
            <div v-if="noData" style="text-align:center;">暂无数据....</div>
            <div v-else class="houseList" v-for="(item, index) in myHouseList" :key="index" :class="item.isDefaultHouse==1 ? 'currentBind' : '' ">
                <div style="width: 50%;margin: 1rem;">
                    <div class="lineHeight">{{item.houseAddr.split(",")[1]}}</div>
                </div>
                <div class="toggleAddr currentHouses" v-show='item.isDefaultHouse==1' >当前房屋</div>
                <div class="toggleAddr"  v-show='item.isDefaultHouse==0' style="background-color: rgb(53, 137, 248);
                color: rgb(255, 255, 255);border: none;
                background-image: -webkit-linear-gradient(0deg, #b0d9fc, #95b9ef);font-size: 12px;margin-right:1rem" @click=changeHouse(item.id,item.resUserId)>切换房屋</div>
            </div>
            </div>
            <div class="loginMax" v-if="loginMaxIsShow">
                <div style="width: 90%; padding-bottom: 5rem;" v-if="boxTwoisShow">
                    <div class="loginBox">
                        <p class="loginTit">
                            房屋绑定
                            <span  @click='loginMaxIsShow=false;boxTwoisShow=false;updateUserInfo()'>跳过</span>
                        </p>
                        <div class="fieldBox">
                            <span style="width:30%;">选择小区</span>
                            <div style="width:70%;display: flex;justify-content: flex-end;">
                                <div v-on:click="dropChooseCommunity" class="select_bottom" style="width: 90%;padding-left: 0;"><span>{{communityValue}}</span><div class="goBtn"></div></div>
                            </div>
                        </div>
                        <div class="fieldBox" style="">
                            <span style="width:30%;">选择房屋</span>
                            <div style="width:70%;display: flex;justify-content: flex-end;">
                                <div v-on:click="dropChooseHouse" class="select_bottom" style="width: 70%;"><span>{{houseValue}}</span><div class="goBtn"></div></div>
                            </div>
                        </div>
                        <div class="fieldBox" style="">
                            <span style="width:30%;">身份</span>
                                <div style="width:70%;display: flex;justify-content: flex-end;">
                                    <div v-on:click="popupVisible = true" class="select_bottom" style="width: 100%;padding-left: 0;"><span>{{messageIden}}</span><div class="goBtn"></div></div>
                                </div>
                                <mt-popup v-model="popupVisible"
                                position="bottom" style="width:100%;background-color: #f1f1f1;">
                                <div class="pickerDiv"  v-on:click="messageIden = '业主（房产登记人）';idenValue = 1;popupVisible = false">业主（房产登记人）</div>
                                <div class="pickerDiv"  v-on:click="messageIden = '业主家属';idenValue = 2;popupVisible = false">业主家属</div>
                                <div class="pickerDiv"  style="margin-bottom:.2rem" v-on:click="messageIden = '租户';idenValue = 3;popupVisible = false">租户</div>
                                <div class="pickerDiv" v-on:click="popupVisible = false">取消</div>
                            </mt-popup>
                        </div>
                        <div class="loginCheck">
                            <div @click='boxTwoDrop'>下一步</div>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="footer">
                <div  @click='changeHouseBox'>添加房屋</div>
            </footer>
        </div>
        </div>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { bindingHousePort, WXPuserPort,changeDefaultHousePort } from "@/api/myHouse";
 import back from '../components/backHeader';
export default {
     components: {
        back
    },
  data() {
    return {
        userInfo:'',
        myHouseList:[],
        boxTwoisShow:true,
        communityValue:'',
        resCode:'PC0000103901A5',
        houseValue:'',
        houseIdNow:'',
        messageIden:'点击选择身份',
        idenValue:'',
        popupVisible:false,
        loginMaxIsShow:false,
        comAndSuggest:0,
        isPay:0,
        index:0,
        boxTwoisShow:true,
        isMask:false,
        noData:false
    };
  },
    created(){
        this.isMask=false;
        var that=this
        // that.updateUserInfo()
        console.log(this.$store.state.openId)
         if(that.$store.state.resUser == ''){
            that.noData =true
             return;
         }else{
        that.updateUserInfo().then(res => {
            // 执行成功的回调函数
        var router=Util.GetUrlParam("router");
        if (router=='chooseHouse') {
            var bindHouseInfo = that.$store.state.bindHouseInfo
            that.houseValue=bindHouseInfo.houseNumb
            that.houseIdNow=bindHouseInfo.houseId
            that.communityValue=that.$store.state.bindCommunityInfo.resiAreaName
            that.loginMaxIsShow=true
        }else if(router=='choosecommunity'){
            var bindCommunityInfo = that.$store.state.bindCommunityInfo
            var userInfoNow=that.$store.state.resUser
            console.log(that.$store.state)
            that.communityValue=bindCommunityInfo.resiAreaName
            that.resCode=bindCommunityInfo.resCode
            that.loginMaxIsShow=true
        }else if(router=='propertyPay'){
            // that.isPay=1
            that.$store.commit('setRromRouter','3')
        }else if(router=='complainAndSuggest'){
            // that.comAndSuggest=1
            that.$store.commit('setRromRouter','2')
        }else if (router=='index') {
            // that.index=1
            that.$store.commit('setRromRouter','1')
        }
         this.userInfo = that.$store.state.resUser;
        if(this.userInfo.resMyhouse.length!=0){
            this.myHouseList=this.userInfo.resMyhouse
        }else{
            Toast('暂无房屋信息，点击“添加房屋”可绑定房屋信息')
        }
    },
        error => { console.log(error); // 执行失败的回调函数
        })
        }
    },
  methods: {
       changeHouseBox:function(){
           if(this.$store.state.resUser == ''){
               this.$router.push({name:'index'})
           }else{
               this.loginMaxIsShow=true;this.boxTwoisShow=true;this.isMask=true;
               window.scrollTo(0,0);
           }
            
        },
        boxTwoDrop:function(){
            var that=this
            if(that.houseValue){
                if(that.idenValue){
                    var resUserId=that.$store.state.resUser.resUserId;
                    let params= {
                            resUserId:resUserId,
                            houseId:that.houseIdNow,
                            myStatus:that.idenValue
                        }
                    bindingHousePort(params).then(res=>{
                        if (res.data.info=="success") {
                            Toast('信息提交成功')
                            that.updateUserInfo().then(res =>{
                                that.userInfo = that.$store.state.resUser;
                                if(that.userInfo.resMyhouse.length!=0){
                                    that.myHouseList=that.userInfo.resMyhouse
                                }
                                 that.loginMaxIsShow=false
                            })
                        }else if (res.data.info=="101") {
                               Toast('该账户已被禁用，请联系物业管理员');
                            } else if (res.data.info=="102") {
                                Toast('用户已绑定了此房屋信息');
                            }  else {
                            Toast(res.data.message);
                        }
                    }).catch(function(error){})
                }else{
                   Toast('请选择身份信息')
                }
            }else{
                Toast('房屋信息不能为空')
            }
        },
        updateUserInfo:function(){
            let self=this
            self.openId=this.$store.state.openId;
          return new Promise((resolve, reject) => {
                 WXPuserPort({openId:self.openId}).then(res => {
                     self.userInfo=res.data.data
                    if(self.userInfo.resUser){
                        self.$store.commit('setResUser',self.userInfo.resUser)
                    }
                    resolve('ready');
                })
                .catch(function(error){
                    reject(error);
                })
            })
        },
        dropChooseHouse:function(){
            this.$router.push({name:'chooseHouse',query:{addHouseState:'addHouse',router:this.trouter}})
        },
        dropChooseCommunity:function(){
            this.$router.push({name:'chooseCommunity',query:{addHouseState:'addHouse',router:this.trouter}})
        },
        changeHouse:function(id,resUserId){
            var that=this
            changeDefaultHousePort({resUserId:resUserId,myHouseId:id}).then(res=>{
                if(res.data.info=='success'){
                    that.updateUserInfo().then(res => {
                        var userData= that.$store.state.resUser
                        var resUserId=that.$store.state.resUserId
                        // 执行成功的回调函数
                        that.$messagebox.alert('修改成功!').then(action => {
                            if(that.$store.state.fromRouter=='1'){
                                that.$router.push({name:'index'})
                            }else if(that.$store.state.fromRouter=='2'){
                                that.$router.push({name:'complainAndSuggest'})
                            }else if(that.$store.state.fromRouter=='3'){
                                that.$router.push({name:'propertyPay'})
                            }else {
                                that.$router.push({name:'myHouse'})
                            }
                        });
                    },
                    error => { console.log(error); // 执行失败的回调函数
                    })
                    
                }
            }).catch(function(error){})
        }
    }
    }
</script>

<style lang="less" scoped>
@import "../assets/less/index.less";
.m-navbar,
.navbar-item {
  height: 1.9rem;
  align-items: center;
}
.houseList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #fff;
  /* padding: 0.9rem 1rem; */
  font-size: 16px;
  background-color: #fafafa;
  color: #808080;
}
/* 切换房址 */
.toggleAddr {
  border: 1px solid #dddddd;
  border-radius: 20px;
  padding: 5px 10px;
}
.lineHeight {
  line-height: 1.2rem;
  font-size: 15px;
}
/* 当前房址 */
.currentAddr {
  background-color: silver;
  color: white;
}
/* 添加房屋 */
.footer {
  width: 100%;
  height: 2rem;
  position: relative;
  bottom: 0;
  z-index: 100;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.footer div {
  width: 90%;
  height: 100%;
  font-size: 16px;
  background-image: -webkit-linear-gradient(0deg, #aad7fe, #97bbf2);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.btn-block {
  margin: 0;
}
.pageIit {
  background-image: url(../../static/images/wave_bg.png);
  background-repeat: no-repeat;
  background-size: 100%;
  height: 5.5rem;
}
body {
  background-color: #fff;
}
.currentBind{
    background-image: url(../../static/images/myhousebg.png);
    padding-right: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%; 
    color: rgb(255, 255, 255);
}
.currentHouses{
   background-image: url(../../static/images/myhouseBtn.png); 
   background-repeat: no-repeat;
   background-size: 100% 100%;
   border-radius: 0;
   border: none;
   color: #808080;
   padding-right: 10px;
   padding-left: 10px;
   font-size: 12px    
}
</style>
