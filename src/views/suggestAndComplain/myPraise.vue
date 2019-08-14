<template>
    <div>
        <header class="m-navbar">
            <a href="#" class="navbar-item">
                <i class="back-ico"></i>
            </a>
            <div class="navbar-center">
                <!-- <span class="navbar-title">公共报修</span> -->
            </div>
        </header>
        <div class="repair" >


            <div class="repairBox">
                <div>
                    <div class="comBox">
                        <div class="comBackground">表扬详情</div>
                        <div style="padding:0.5rem 1rem;">
                            <mt-cell title="表扬对象" :value="cmpTarget" class="publicRepair"></mt-cell>
                            <!-- <mt-field label="表扬对象" class="publicRepair"  v-model="cmpTarget"></mt-field>   -->
                            <div style="padding:0 10px;font-size:16px;">
                                <span>表扬内容:</span>
                                <span>{{praiseReason}}</span>
                            </div>
                            <div class='addPhoto'>
                                <div class="photoContent">
                                    <div class='photo' v-for="(item,index) in repairPhoto">

                                        <img :src="item"  @click="funcReadImgInfo(index,item)" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="praiseLog">
                            <img src="../../../static/images/praiseBg.png" alt="">
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
  infoDetailPort
} from "@/api/complainDetail";
export default {
  components: {
        Swipe, SwipeItem
    },
  data() {
    return {
        cmpTarget:'',
        praiseReason:'',
        repairPhoto:[],
        cmpOrderNo:'',
        defaultSrc:'',
        zzShow:false
    };
  },
  async created() {
        var that= this;
        var scmpOrderNo =Util.GetUrlParam('cmpOrderNo')
        if(scmpOrderNo!=null){ 
           var scmpOrderNo_ = decodeURIComponent(scmpOrderNo); 
           that.cmpOrderNo = scmpOrderNo_;
        }
        infoDetailPort({cmpOrderNo:that.cmpOrderNo}).then(res=>{
            var rtnDate = res.data;
            if(rtnDate.info == 'success'){
               var orderDetail = rtnDate.data.orderDetail;
               var cmpImgInfo =rtnDate.data.cmpImgInfo;
               that.cmpTarget=orderDetail.cmpTarget;
               that.praiseReason =orderDetail.cmpContent;
               for(let j = 0;j<cmpImgInfo.imgList.length;j++){
                     that.repairPhoto.push(cmpImgInfo.imagePath+cmpImgInfo.imgList[j]);
                       }
            }else{ Toast('网络请求失败') }
        }).catch(function(error){})
  },

  methods: {
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
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/complainDetail.less";
@import "../../assets/less/publicRepairDetail.less";
@import "../../assets/less/repair.less";
@import "../../assets/less/complainAndSuggest.less";
  select {
            width: 100%;
            -webkit-appearance: none;
            border: none;
            outline: none;
            /* text-align: right; */
            direction: rtl;
        }

        .mint-field-core {
            background-color: white;
            color: black;
        }

        .repairBody {
            width: 100%;
            height: 100%;
            background-image: url(../../../static/images/repairBg.png);
            background-size: 100% 100%;
        }
        　　.img-view{
    /* position: inherit; */
    width: 100%;
    height: 100%;
   }
   .img-view .img-layer{
       width: 100%;
       height: 100%;
       position: fixed;
       top: 0;
       left: 0;
       background: rgba(0, 0, 0, 0.7);
       z-index: 1000;
   }
   .img-view .imgs{
       width: 13rem;
       height: 13rem;
       display: block;
       position: absolute;
       left: calc(50% - 6.5rem);
       right: 0;
       top: calc(50% - 7.5rem);
       z-index: 1001;
   }
   .img-view .imgs img{
      width: 100%;
      height: 100%;
   }

        [v-cloak] {
            display: none
        }
        .mint-cell{
            background-color: #f8f8f8;
        }
        .praiseLog{
            width: 100%;
            height: 40%;
            text-align: center;
            padding: 16px 0;
            margin-bottom: 2rem;
        }
        .praiseLog img{
            width: 50%;
            height: 85%;
            margin: 0 auto;
        }
</style>
