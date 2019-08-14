<template>
    <div class="box">
        <!-- 图 -->
        <div class="carImgBox">
            <div class="carImg">
                <img :src="imgStr" alt="">
            </div>
        </div>
        <!-- 信息 -->
        <div class="carInfo">
            <ul>
                <li style="display:flex;justify-content:space-between;">
                    <div style="width:75%;display:flex;align-items:center;">
                        <img src="../../static/images/carNumber.png" alt="">
                        <span>车牌号码：</span>
                        <span class="info">{{carNumber}}</span>
                    </div>
                    
                    <span style="color:#3da1fe;" @click="choiceCar">选择车牌</span>
                </li>
                <li>
                    <img src="../../static/images/park.png" alt="">
                    <span>停&nbsp; 车&nbsp; 场：</span>
                    <span>{{park}}</span>
                </li>
                 <li>
                    <img src="../../static/images/carTime.png" alt="">
                    <span>入场时间：</span>
                    <span>{{inTime}}</span>
                </li>
                 <li>
                    <img src="../../static/images/parkingFee.png" alt="">
                    <span>停&nbsp; 车&nbsp; 费：</span>
                    <span>{{totalFee}}</span>
                </li>
            </ul>
        </div>
        <!-- 按钮 -->
        <div v-bind:class="isPay?'payBtn':'noPayBtn'" @click="pay()">缴费</div>
        <div v-if="isPay2" style="color:silver;text-align:center;font-size:16px;margin-top:10px;">请在 <span style="color:red;">{{validTimeLen}}</span> 秒内完成支付，谢谢!</div>
        <!-- 弹出层 -->
        <div>
            <Popup  v-model="popupVisible" position="right">
               <div class="popubMain">
                   <div class="add" >
                       <div class="addCarBtn" @click="addCar">
                           <img src="../../static/images/addCar.png" alt="">
                           <span>添加车辆</span>
                       </div>
                   </div>
                   <div class="myCar">
                       <ul>
                           <li v-for="(item,index) in myCar" class="carList"  >
                               <span class="CarNum" @click = 'selectCar(item.submitCarNumber)'>{{item.carNumber}}</span>
                               <div @click="amend(item.id,item.submitCarNumber)" class="amend">
                                   <img src="../../static/images/amend.png" alt="">
                               </div>
                               <div @click="delect(item.id)" class="delect">
                                   <img src="../../static/images/delects.png" alt="">
                               </div>
                               
                            </li>
                       </ul>
                   </div>
               </div>
            </Popup>
        </div>
    </div>
</template>
<script>
import { Popup,MessageBox} from 'mint-ui';
import Util from '@/libs/util.js';
import { Toast } from "mint-ui";
import { delectVehiclePort, getVehicleInfoPort,getParkOrderPort} from "@/api/carPayMoney";
import { Indicator } from 'mint-ui';
export default {
    components:{Popup},
    data(){
        return{
            popupVisible:false,
            myCar:[],
            openId:'',
            parkCode:'',
            carNumber:'',
            inTime:'',
            totalFee:'',
            park:'',
            orderNo:'',
            isPay:false,
            isPay2:false,
            validTimeLen:'',
            submitCarNum:'',
            totalFee2:'',
            timer:null,
            imgStr:''
        }
    },
    created(){
        this.openId = Util.GetUrlParam("openId");
        this.parkCode = Util.GetUrlParam("parkCode");
        let carNumbers = Util.GetUrlParam("carNumber");
        if(carNumbers){
          let url = decodeURI(location.href);
          let urlAll = url.split('?')[1];
          let urlItem=urlAll.split('&')[2];
          this.submitCarNum = urlItem.split('=')[1];
          this.carNumber = urlItem.split('=')[1].replace('-','');
          console.log(this.carNumber)

        }
        
        this.getInfoPark(this.submitCarNum,this.parkCode,this)
        
    },
    methods:{
        getInfoPark:function(carNumber,parkCode,that){
         let params = {
             carNumber:carNumber,
             parkCode:parkCode
         } 
          Indicator.open({
            spinnerType: 'fading-circle'
          });
         getParkOrderPort(params).then(res => {
             let resData = res.data;
             if(resData.info = 'success'){
                 Indicator.close();
                  that.timer = null;
                  that.carNumber = resData.data.carNumber.replace('-','');
                  console.log('a：'+that.carNumber)
                 if(resData.data.inTime){
                    that.inTime  = Util.fmDayMin(resData.data.inTime);
                    that.totalFee = resData.data.totalFee/100 +'元';
                    that.totalFee2 = resData.data.totalFee
                    that.orderNo = resData.data.orderNo;
                    that.park = resData.data.parkName;
                    that.validTimeLen = resData.data.validTimeLen;
                    that.imgStr = resData.data.image != "" ? resData.data.image : require('../../static/images/noCarInfo.png');
                     if(resData.data.totalFee >0){
                        that.isPay = true;
                        that.isPay2= true;
                    }else{
                        that.isPay = false; 
                        that.isPay2 = false; 
                    }
                 }else{
                     that.imgStr = require('../../static/images/noCarInfo.png');
                     that.carNumber = resData.data.carNumber.replace('-','');
                     that.park = '未查到入场信息';
                     that.inTime = '暂无';
                     that.totalFee = '暂无';
                     that.isPay = false; 
                     that.isPay2 = false; 
                 }
                that.$options.methods.countTime(that.validTimeLen,that);
             }else{
                 Toast(resData.message)
             }
         }).catch(function(error){})
        },
        choiceCar:function(){
            this.popupVisible = true;
            let that = this;
            getVehicleInfoPort({openId:that.openId}).then(res=>{
                let resData = res.data;
                if(resData.info == 'success'){
                    // that.myCar = resData.data.vehicleList
                       let myCarInfo = [];
                       console.log(resData.data.vehicleList[0].carNumber.substring(1))
                    for(var i in resData.data.vehicleList){
                       var carInfo ={
                           carNumber:resData.data.vehicleList[i].carNumber,
                           id:resData.data.vehicleList[i].id,
                           submitCarNumber:resData.data.vehicleList[i].carNumber.slice(0,1)+'-'+resData.data.vehicleList[i].carNumber.substring(1)
                       }
                       myCarInfo.push(carInfo)
                    }
                    that.myCar = myCarInfo

                }else{
                    Toast('网络请求错误，请稍候再试')
                }
            }).catch(function(error){})
        },
        selectCar:function(carNumber){
            let that = this;
             clearInterval(that.timer);
            that.$options.methods.getInfoPark(carNumber,that.parkCode,that);
            that.popupVisible = false; 
        },
        addCar:function(){
            this.$router.push({name:'carNumber',query:{openId:this.openId,parkCode:this.parkCode}})
        },
        amend:function(id,number){
            this.$router.push({name:'carNumber',query:{carNumber:number,openId:this.openId,carId:id,parkCode:this.parkCode}})
        },
        delect:function(id,index){
            let that = this;
            MessageBox.confirm('确定删除该车牌号?').then(action => {
                 this.myCar.splice(index,1)
                 delectVehiclePort({id:id}).then(res=>{
                     let resData = res.data;
                     if(resData.info == 'success' ){
                         console.log(resData.info)
                         that.popupVisible = false;
                         Toast('删除成功')
                     }else{
                         Toast('网络请求错误，请稍后重试')
                     }
                 }).catch(function(error){})
           });    
        },
        pay:function(){
            let that = this;
            clearInterval(that.timer);
            if(this.totalFee2 > 0){
                if(this.validTimeLen >0){
                    // window.location.href = '/cisp_res/apps/wxPay.jsp?openId='+this.openId+'&type=WXTC&carNumber='+that.submitCarNum +'&parkCode='+that.parkCode+'&feeNos='+this.orderNo+'&totalFee='+this.totalFee2
                    // window.location.href = '/cisp_res/apps/xmyhWxPay.jsp?openId='+this.openId+'&type=WXTC&carNumber='+that.submitCarNum +'&parkCode='+that.parkCode+'&feeNos='+this.orderNo+'&totalFee='+this.totalFee2
                    // window.location.href = '/cisp_res/apps/wxPay.jsp?openId='+this.openId+'&type=WXTC&carNumber='+that.submitCarNum +'&parkCode='+that.parkCode+'&feeNos='+this.orderNo+'&totalFee=1'
                    window.location.href = '/cisp_res/wxp/WXP070200Pay.do?method=paySourceWay&openId='+this.openId+'&type=WXTC&carNumber='+that.submitCarNum +'&parkCode='+that.parkCode+'&feeNos='+this.orderNo+'&totalFee='+this.totalFee2+'&resCode=PC0000103901A5'
              }else{
                    Toast('支付超时，请重试')
                    setTimeout( that.$options.methods.getInfoPark(that.submitCarNum,that.parkCode,that),1500)
                }
               
            }else{
                 Toast('暂无支付信息')
            }
           
        },
        countTime:function(time,that){
             console.log(that.timer)
             if (!that.timer && that.isPay) {
                  console.log(11)
                that.timer = setInterval(() => {
                  if (that.validTimeLen > 0) {
                    that.validTimeLen--;
                  } else {
                    that.isPay = false;   
                    that.validTimeLen = 0;
                    that.isPay2= false;
                    clearInterval(that.timer);
                    that.timer = null;
                  }
                }, 1000);
              }else{
                    that.isPay2= false;
              }
        }
    }
}
</script>
<style lang="less" scoped>
    .box{
        width: 100%;
        height: 100vh;
        background-color: #F4F4F6;
    }
  .carImgBox{
     height: 10rem; 
     padding: 0.7rem 0.7rem 0 0.7rem;
  }
  .carImg{
    //   width: 100%;
      height: 8rem;
      box-shadow:1px 1px 5px #D4D4D4;
      -webkit-box-shadow:1px 1px 5px #D4D4D4;
      background-color: white;
      padding: 0.5rem;
      & img{
          width: 100%;
          height: 100%;
      }
  }
  .carInfo{
      font-size: 14px;
      & li{
           background-color: white;
           display: -webkit-box;      /* 老版本 - 适配iOS 6-, Safari 3.1-6 */
           display: -webkit-flex;     /* 新版本 - 适配Chrome */
           display: flex;             /* 新版本,- 适配Opera 12.1, Firefox 20+ */
           align-items: center; 
           padding: 0 1rem;
           margin:0 0 0.6rem 0;
           height: 2rem;
           & img{
                width: 1rem;
                height: 1rem;
                margin-right: 0.4rem;
          }
          & .info{
              display: inline-block;
              width: 47%;
          }
      }
  }
  .payBtn{
      background-image:linear-gradient(to right, #72bdff, #518dea);
      color: white;
      line-height:2rem;
      text-align: center;
      margin: 2rem 1rem 0 1rem;
  }
  .noPayBtn{
      background-color: silver;
      color: white;
      line-height:2rem;
      text-align: center;
      margin: 2rem 1rem 0 1rem;  
  }
  .popubMain{
       background-color: #F4F4F6; 
       width: 11rem;
       height: 100vh;
       font-size: 16px;   

  }
   .add{
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .addCarBtn{
        font-size: 14px;
        width: 6rem;
        height: 2rem;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        & img{
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.4rem;
        }
    }
    .myCar{
        width: 100%;
        height: 84vh;
        overflow: scroll;
        background-color: white;
        & ul{
            width:100%;
            height: 100%;
        }
    }
    .carList{
        width: 100%;
        height: 4rem;
        border-bottom: 1px solid #F4F4F6;
        display: flex;
        justify-content: space-around;
        align-items: center;
        & .delect img{
            width: 1.2rem;
            height: 1.2rem;
        }
        & .amend img{
             width: 1rem;
            height: 1rem;
        }
        & .CarNum{
            width: 6rem;
            height: 1.6rem;
            line-height: 1.6rem;
            background-image:linear-gradient(to right, #72bdff, #518dea); 
            text-align: center;
            font-size: 14px;
            border-radius: 10px;
            color: white;
        }
    }
</style>


