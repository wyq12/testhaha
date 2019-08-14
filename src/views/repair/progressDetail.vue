<template>
    <div>
        <div class="repairBox">
            <div class="comBox">
              <div class="comBackground">进度详情</div>
                <div class="processDetail">
                    <div class="processLine"></div>
                    <div class="processText">
                        <div class="processTextList" v-for="(item,index) in processData">
                          <div class="processList">
                              <div>
                                <span v-if="item.orderStatus==0">工单已生成，待工作人员接单中...</span> 
                                <template v-if="item.orderStatus==1">
                                    <span v-if="item.dealInfo==''">物业工作人员{{item.dealName}}已接单</span> 
                                </template>
                                <template v-if="item.orderStatus==1">
                                  <span v-if="item.dealInfo!=''">{{item.dealName}}：{{item.dealInfo}}</span> 
                                </template>
                                <template v-if="item.orderStatus==2">
                                  <span v-if="item.dealInfo==''">工单处理完毕，期待您的评价，谢谢！</span> 
                                </template>
                                <template v-if="item.orderStatus==2">
                                  <span v-if="item.dealInfo!=''">{{item.dealInfo}}</span> 
                                </template>
                                <span v-if="item.orderStatus==3">住户已对工单进行评价！</span>
                                <span v-if="item.orderStatus==4">工单已取消</span> 
                              </div>
                              <div class="dot dot-circle"></div>
                              <div class="orderStatusTime">{{item.orderStatusTime}}</div>
                              
                          </div>
                         
                      </div>
                    </div>
                </div>
              </div>
        </div>
    </div>  
   
</template>

<script>
import back from '../../components/backHeader';
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { myRepair } from "@/api/repair";
import {processPort} from '@/api/repairDetail'
import { Indicator } from 'mint-ui';
export default {
   components: {
        back
    },
  data() {
    return {
      processData:[
        // {content:"XXX师傅已接单XXX师傅",dealTime:'20XX-XX-XX 10:10'},
        // {content:"XXX师傅已接单",dealTime:'20XX-XX-XX 10:10'},
        // {content:"XXX师傅已接单",dealTime:'20XX-XX-XX 10:10'},
        // {content:"XXX师傅已接单",dealTime:'20XX-XX-XX 20:10'}
      ],
      repairType:'',
      orderNo:''
    };
  },
  created: function() {
     let that = this;
       Indicator.open({
            spinnerType: 'fading-circle'
        });
        var srepairType = Util.GetUrlParam("repairType"); 
        var sperOrderNo =Util.GetUrlParam('orderNo')
        if(srepairType!=null){ 
           var srepairType_ = decodeURIComponent(srepairType); 
           that.repairType = srepairType_;
        }
        if(sperOrderNo!=null){ 
           var sperOrderNo_ = decodeURIComponent(sperOrderNo); 
           that.orderNo = sperOrderNo_;
        }
        processPort({
                repairType:that.repairType,
                orderNo:that.orderNo
            }).then(res=>{
              Indicator.close()
              let rtnData = res.data;
              // console.log(rtnData)
              if(rtnData.info == 'success'){
                that.processData=rtnData.data;   
                  
              }else{
                  Toast('网络请求失败') 
              }
            }).catch(function (error) {});
        
  },

  methods: {}
};
</script>

<style lang="less" scoped>
@import "../../assets/less/complainAndSuggest.less";
@import "../../assets/less/repair.less";
@import "../../assets/less/progressDetail.less";
</style>
