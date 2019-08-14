<template>
    <div>
        <back></back>
        <div style="margin:8px;">

            <div class="chooseCommunityTit">选择小区</div>
            <div class="seacherBox">
                <mt-search
                v-model="seacherValue"
                cancel-text="取消"
                placeholder="请输入您所居住的小区">
                </mt-search>
            </div>
            <p style="margin:0.8rem 0;font-size:16px;">选择您所居住的小区</p>
            <div>
                <mt-index-list  v-show="!seacherState">
                    <mt-index-section  v-for="(item, index) in indexList"  :key="index" :index=item.index>
                        <!-- <mt-cell  v-for="(item1, index1) in item.list"  :key="index1"  :title='item1.resiAreaName' >
                            <div @click='communityDrop(item1.resCode,item1.resiAreaName)' style="left:0;width: 100%;height: 2rem;"></div>
                        </mt-cell> -->
                        <ul>
                            <li class="CommunityList" v-for="(item1, index1) in item.list" @click='communityDrop(item1.resCode,item1.resiAreaName)'>{{item1.resiAreaName}}</li>
                        </ul>
                    </mt-index-section>
                </mt-index-list>
                <div class="seacherItemBox" v-show="seacherState">
                    <div   v-for="(item, index) in seacherArr"  @click='communityDrop(item.resCode,item.resiAreaName)'  class="seacherItem">{{item.resiAreaName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import Util from "@/libs/util.js";
import { queryResAreaPort } from "@/api/chooseType";
 import back from '../components/backHeader';
export default {
      components: {
        back
    },
    data(){
        return{
             seacherValue:'',
        indexList:[
            {
            index: 'A',
            list: []
            },
            {
            index: 'B',
            list: []
            },
            {
            index: 'C',
            list: []
            },
            {
            index: 'D',
            list: []
            },
            {
            index: 'E',
            list: []
            },
            {
            index: 'F',
            list: []
            },
            {
            index: 'G',
            list: []
            },
            {
            index: 'H',
            list: []
            },
            {
            index: 'I',
            list: []
            },
            {
            index: 'J',
            list: []
            },
            {
            index: 'K',
            list: []
            },
            {
            index: 'L',
            list: []
            },
            {
            index: 'M',
            list: []
            },
            {
            index: 'N',
            list: []
            },
            {
            index: 'O',
            list: []
            },
            {
            index: 'P',
            list: []
            },
            {
            index: 'Q',
            list: []
            },
            {
            index: 'R',
            list: []
            },
            {
            index: 'S',
            list: []
            },
            {
            index: 'T',
            list: []
            },
            {
            index: 'U',
            list: []
            },
            {
            index: 'V',
            list: []
            },
            {
            index: 'W',
            list: []
            },
            {
            index: 'X',
            list: []
            },
            {
            index: 'Y',
            list: []
            },
            {
            index: 'Z',
            list: []
            }
        ],
        seacherArr:[],
        addHouseState:'',
        seacherState:false,
        }
    },
    created:function(){
        let self=this
        let resCode=''
        let router=Util.GetUrlParam("addHouseState");
        if(router=='addHouse'){
            this.addHouseState='addHouse'
        }
        let countId=Util.GetUrlParam("countId");
        queryResAreaPort({resiAreaName:''}).then(response=>{
            let rtnData = response.data.data;
            for(let i=0;i<rtnData.length;i++){
                for(let j=0;j<self.indexList.length;j++){
                    if(rtnData[i].remark.charAt(0)==self.indexList[j].index){
                        self.indexList[j].list.push(rtnData[i])
                    }
                }
            }
            for(let i=0;i<rtnData.length;i++){
                if(self.indexList[i].list.length==0){
                    self.indexList.splice(i--,1)
                }
            }
        }).catch(function(error){})
    },
     methods: {
        communityDrop: function(resCode,resiAreaName) {
            let bindCommunityInfo={
                resCode:resCode,
                resiAreaName:resiAreaName
            }
            // window.localStorage.setItem('bindCommunityInfo',JSON.stringify(bindCommunityInfo))
            this.$store.commit('setCommunityInfo', bindCommunityInfo)
            if(this.addHouseState!=''){
                this.$router.push({name:'myHouse',query:{'router':'choosecommunity'}})
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
                    console.log(repairAddrItem + '扫1')
                    this.$router.push({ name: "index",query:{resCode:reCodeWeb,openId:reOpenIds,router:'choosecommunity',repairAddr:repairAddrItem}});
                }else{
                     this.$router.push({name:'index',query:{'router':'choosecommunity'}})
                }

            }
        }
    },
     watch:{
        seacherValue(val, oldVal){
            let self=this
            this.seacherState=true
            if (val) {
                queryResAreaPort({resiAreaName:val}).then(response =>{
                     self.seacherArr=[];
                    let rtnData = response.data.data;
                    self.seacherArr=rtnData
                }).catch(function(error){})
            }else{
                self.seacherState=false
            }
        }
    }
}
</script>
<style lang="less">
//    .mint-cell-value{
//             color: #888;
//             display: -webkit-box;
//             display: -ms-flexbox;
//             display: flex;
//             -webkit-box-align: center;
//             -ms-flex-align: center;
//             align-items: center;
//             position:relative;
//             width: 50%;
//             left: 0;
//         }
   .mint-indexlist-nav {
            height: 85vh;
        }
        .seacherItem{
            display: flex;
            align-items: center;
            height: 3rem;
            padding-left: 10px;
            font-size:16px;
        }
        .mint-search-list {
            overflow: auto;
            padding-top: 44px;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            display: none;
        }
        .mint-indexlist {
            width: 100%;
            position: relative;
            overflow: scroll;
        }
        .mint-indexlist-content {
            margin: 0;
            padding: 0;
            overflow: auto;
            height:64vh!important;
        }
</style>

 <style lang="less" scoped>
@import '../assets/less/chooseCommunity.less';
   .mint-cell-wrapper {
            position: relative;
        }
        .chooseCommunityTit{
            background-image: url('../../static/images/wave_bg.png');
            background-repeat: no-repeat;
            background-size: 100%;
            height: 5.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        }
     .CommunityList{
       height: 2rem;
       line-height:2rem;
       font-size:16px;
     }
</style>


