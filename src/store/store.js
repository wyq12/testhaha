import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        resUser:'',
        openId:'',
        pathState:'',
        resUserId:'',
        bindCommunityInfo:{},
        bindHouseInfo:'',
        repairAddr:'',
        isAuto:false,
        smnUser:'',
        resCode_repair:'',//扫码获得的
        repairAddr:'',  //扫码获得的报修地址
        userInfo_smn:'',
        serviceIsOk:'',
        fromRouter:'',
        trueName:'',
        sex:''

    },
    mutations:{
        setAuto(state,params){
            state.isAuto=params
        },
        setOpenId(state,params){
            state.openId=params
        },
        setPathState(state,params){
            state.pathState=params
        },
        setResUser(state,params){
            state.resUser=params
        },
        setCommunityInfo(state,params){
            state.bindCommunityInfo = params;
        },
        bindHouseInfo(state,params){
            state.bindHouseInfo = params;
        },
        resCode_repair(state,params){
            state.resCode_repair = params;
        },
        setRepairAddr(state,params){
            state.repairAddr = params;
        },
        alterResUserId(state,params){
            state.resUserId = params;
        },
        alterResUser(state,params){
            state.resUser = params;
        },
        setRromRouter(state,params){
            state.fromRouter = params;
        },
        setTrun(state,params){
            state.trueName = params.trueName;
            state.sex = params = params.sex;
        }
    },
    getters: {
        isAuto:state => state.isAuto,
        openId: state => state.openId,
        pathState: state => state.pathState,
        resUser: state => state.resUser,
        bindCommunityInfo: state => state.bindCommunityInfo,
        bindHouseInfo: state => state.bindHouseInfo,
        resCode_repair: state => state.resCode_repair,
        repairAddr: state => state.repairAddr,
        fromRouter:state => state.fromRouter,
        trueName:state =>state.trueName,
        sex:state=>state.sex
    }
})
export default store