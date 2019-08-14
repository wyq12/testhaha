<template>
    <div>
        <div class="pageIit" style="display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;">个人信息</div>
        <div class="container">
            <div class="infoItem">
                <div class="myInfoList">
                   <img slot="icon" src="../../static/images/headImg_icon.png" style="width:2rem;height:2rem">
                   <span>头像</span>
                </div>
                <div class="HeaderImg" style="height:4rem;display: flex;align-items: center;">
                        <img  :src='headImage' alt="">
                </div>
                <!-- <mt-cell title="头像">
                    <div class="HeaderImg" style="height:4rem;display: flex;align-items: center;">
                        <img  :src=headImage alt="">
                    </div>
                    
                </mt-cell> -->
            </div>
            <div class="infoItem">
                <!-- <mt-cell title="性别">
                    <span>{{sex}}</span>
                    <img slot="icon" src="../../static/images/sexIcon.png" style="width:2rem;height:2rem">
                </mt-cell> -->
                <div class="myInfoList">
                   <img slot="icon" src="../../static/images/sexIcon.png" style="width:2rem;height:2rem">
                   <span>性别</span>
                </div>
                <span>{{sex}}</span>
            </div>
            <div class="infoItem">
                <!-- <mt-cell title="昵称">
                    <span>{{nickName}}</span>
                    <img slot="icon" src="../../static/images/nickname_icon.png" style="width:2rem;height:2rem">
                  </mt-cell> -->
                  <div class="myInfoList">
                   <img slot="icon" src="../../static/images/nickname_icon.png" style="width:2rem;height:2rem">
                   <span>昵称</span>
                </div>
                <span>{{nickName}}</span>
            </div>
            <div class="infoItem">
                <!-- <mt-cell title="姓名">
                    <span>{{name}}</span>
                    <img slot="icon" src="../../static/images/message_icon.png" style="width:2rem;height:2rem">
                  </mt-cell> -->
                 <div class="myInfoList">
                   <img slot="icon" src="../../static/images/message_icon.png" style="width:2rem;height:2rem">
                   <span>姓名</span>
                </div>
                 <span>{{name}}</span> 
            </div>
            <div class="infoItem">
                <!-- <mt-cell title="电话">
                    <span>{{phone}}</span>
                    <img slot="icon" src="../../static/images/phone_icon.png" style="width:2rem;height:2rem">
                  </mt-cell> -->
                  <div class="myInfoList">
                   <img slot="icon" src="../../static/images/phone_icon.png" style="width:2rem;height:2rem">
                   <span>电话</span>
                </div>
                 <span>{{phone}}</span>
            </div>
        </div>
    </div>

</template>

<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import {
  WXnickPort
} from "@/api/myInfo";
export default {
  data() {
    return {
        userInfo:'',
        name:'',
        nickName:"",
        sex:'',
        phone:'',
        headImage:'',
        openId:''
    };
  },
  created:function() {
       var self=this
        self.openId=this.$store.state.openId;
        WXnickPort({openId:self.openId}).then(response=>{
             if (response.data.info=='success') {
                self.headImage=response.data.data.headimgurl
                self.nickName=response.data.data.nickname
            }else{
                 self.headImage=require("../../static/images/headImg_icon.png")
            }
        }).catch(function(error){})
        this.userInfo = this.$store.state.resUser;
        this.name=this.userInfo.trueName
        this.nickName=this.userInfo.nickName
        this.sex=this.userInfo.sex
        this.phone=this.userInfo.userName
        if(this.userInfo.sex=='M'){
            this.sex='男'
        }else if(this.userInfo.sex=='F'){
            this.sex='女'
        }
        if(this.userInfo.trueName==''){
            this.name='未实名认证'
        }
  },

  methods: {
       
    },
   
};
</script>

<style lang="less" scoped>
     .container{
            padding:0.5rem 1rem;
        }
      .container .HeaderImg{
       width: 2.5rem;
       height: 2.5rem;     
    }
    .container .HeaderImg img{
       width: 100%;
       /* height: 100%;    */
    }
   
    .pageIit{
        background-image: url("../../static/images/wave_bg.png");
        background-repeat: no-repeat;
        background-size: 100%;
        height: 5.5rem;
        
    }
    body{
        background-color: #fff;
    }
    .infoItem{
        font-size: 18px;
        /* border-bottom: 1px solid #bde2fe; */
        // margin-bottom: .3rem;
         display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
        display: -webkit-flex;     /* 新版本 - 适配Chrome */
        display: flex;             /* 新版本,- 适配Opera 12.1, Firefox 20+ */
        justify-content: space-between;
        align-items: center;
        background-color: #f8f8f8;
        margin-bottom: 5px;
        padding: 0.4rem 0.5rem 0.4rem 0;
    }
    .myInfoList{
        // height: 5rem;
        // line-height: 5rem;
        display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
        display: -webkit-flex;     /* 新版本 - 适配Chrome */
        display: flex;             /* 新版本,- 适配Opera 12.1, Firefox 20+ */
        align-items: center;
    }
</style>
