<template>
   <div>
       <back></back>
        <div style="margin:8px">

            <div class="chooseHouseTit">选择房屋</div>
            <!-- <mt-search
            v-model="seacherValue"
            cancel-text="取消"
            placeholder="搜索门牌号">
            </mt-search> -->
            <div class="main-chooseHouse">
                <div class="left">
                    <p style="padding: 1.6rem;background-color: #fafafa;">楼栋</p>
                    <p  style="background-color: #fafafa;" v-bind:class="{ activeBtn:index==current}" v-for="(item, index) in building"  :key="index" :index=item.index @click='queryHouse(item.id,index,item.buildingName)'>{{item.buildingName}}</p>
                </div>
                <div class="right">
                    <div style="padding: 1.6rem;background-color: #fafafa;padding-left: 1rem;padding-right: 1rem;font-size:17px;">{{nowHouse+nowHouseLast}}</div>
                    <p style="background-color: #fafafa;font-size:17px;" v-for="(item, index) in house"  :key="index" :index=item.index  @click='bindingHouse(item.id,item.houseNumb)'>{{(item.unitNumb&&item.unitNumb!='0'?item.unitNumb+'单元':'')+item.houseNumb}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { queryBuilding,queryHousePort } from "@/api/chooseType";
 import back from '../components/backHeader';
export default {
     components: {
        back
    },
    data(){
        return{
            seacherValue:'',
            building:[],
            house:[],
            addHouseState:'',
            current:-1,
            nowHouse:'',
            nowHouseLast:''
      }
    },
    created(){
        let self=this
        let resCode=''
        let router=Util.GetUrlParam("addHouseState");
        if(router=='addHouse'){
            this.addHouseState='addHouse'
        }
        if(this.$store.state.bindCommunityInfo.resCode){
            let bindCommunityInfo=this.$store.state.bindCommunityInfo
            resCode=bindCommunityInfo.resCode
            this.nowHouse=bindCommunityInfo.resiAreaName
        }else{
            resCode='PC0000103901A5'
            this.nowHouse='禹州华侨海景城'
        }
        console.log(resCode)
        queryBuilding({resCode:resCode}).then(response=>{
            console.log(response.data.data)
            self.building=response.data.data
        }).catch(function(error){})
    },
    methods: {
        queryHouse: function(buildingId,index,buildingName) {
             var self=this
            this.current=index;
            this.nowHouseLast=buildingName
            queryHousePort({buildingId: buildingId}).then(response=>{
                self.house=response.data.data
            }).catch(function(error){})
        },
        bindingHouse:function(houseId,houseNumb) {
            let bindHouseInfo={
                houseId:houseId,
                houseNumb:houseNumb
            }
            // window.localStorage.setItem('bindHouseInfo',JSON.stringify(bindHouseInfo))
            this.$store.commit('bindHouseInfo', bindHouseInfo)
            if(this.addHouseState!=''){
                this.$router.push({name:'myHouse',query:{'router':'chooseHouse'}})
            }else{

                let repairAddrItem=Util.GetUrlParam("repairAddr");
                if (repairAddrItem) {
                    var url=decodeURI(location.href);
                    var urlAll=url.split('?')[1]
                    var urlItem=urlAll.split('&')[0]
                    console.log(urlItem.split('='))
                    repairAddrItem=urlItem.split('=')[1]
                }else{
                    repairAddrItem=''
                }
                let reCodeWeb = Util.GetUrlParam('resCode')
                let reOpenIds = Util.GetUrlParam('openId')
                console.log("dd"+repairAddrItem+reCodeWeb)
                if(repairAddrItem != '' && reCodeWeb != null){
                    console.log(repairAddrItem + '扫2')
                    this.$router.push({ name: "index",query:{repairAddr:repairAddrItem,resCode:reCodeWeb,openId:reOpenIds,router:'chooseHouse'}});
                }else{
                    this.$router.push({name:'index',query:{'router':'chooseHouse'}})
                }


            }
        }
    }
}
</script>
<style lang="less" scoped>
@import '../assets/less/chooseHouse.less';
.chooseHouseTit{
    background-image: url(../../static/images/wave_bg.png);
    background-repeat: no-repeat;
    background-size: 100%;
    height: 5.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
.mint-searchbar {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 1rem;
    display: none;
}
.activeBtn{
    background-image: -webkit-linear-gradient(0deg, #aad7fe, #97bbf2);
    color: #fff;
}
</style>


