// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'; 
import 'es6-promise/auto'
import Util from '@/libs/util.js'
import AppAxios from '@/api/App.js'
import { Toast } from 'mint-ui';
Vue.config.productionTip = false
Vue.use(Mint);
/* eslint-disable no-new */
let openId=Util.GetUrlParam("openId");
let pathState=Util.GetUrlParam("pathState");
let repairAddr=Util.GetUrlParam("repairAddr");
if (repairAddr) {
    var url=decodeURI(location.href);
    var urlAll=url.split('?')[1]
    var urlItem=urlAll.split('&')[3]
    repairAddr=urlItem.split('=')[1]
}else{
    repairAddr=''
}
console.log('openId',openId)
let repairResCode=Util.GetUrlParam("resCode");
console.log(repairResCode)
store.commit('setPathState', pathState)
store.commit('setOpenId', openId)
if (repairAddr) {
    store.commit('setRepairAddr', repairAddr)
}
alert(location.href)
router.beforeEach((to, from, next) => {
    if (to.path=='/deviceState') {
            next()
    }else if(to.path == '/deviceSuccess'){
            next()
    }else if(to.path == '/deviceReport'){
            next()
    }else if(to.path == '/carNumber'){
            next()
    }else if(to.path == '/carPayMoney'){
            next();
    }else{
        console.log('main')
        runAsync(function(data){
            
            if (data=='ready') {
                if (to.path=='/') {
                    next({name:'index'})
                }else if (to.path=='/index') { 
                    if(repairAddr !='' && repairResCode !=null){//扫码
                        if(store.state.resUser && store.state.resUser.resMyhouse.length>0){
                            next({
                                name: 'repair',
                                query:{repairAddr:repairAddr,resCode:repairResCode,openId:openId}
                            })
                        }else{
                            console.log("111")
                            next()
                        }
                    }else if(pathState == 2){//报修
                        
                        if (store.state.resUser){
                            next({
                                name: 'repair'
                            })
                        }else{
                            next()
                        }
                    }else if(pathState == 3){ //缴费
                        if (store.state.resUser) {
                            next({
                                name: 'propertyPay'
                            })
                        }else{
                            next()
                        }
                    }else if(pathState == 4){ //投诉建议
                        if (store.state.resUser) {
                            next({
                                name: 'complainAndSuggest'
                            })
                        }else{
                            next()
                        }
                    }else{
                        next()
                    }
                }
                else if (to.path=='/repair') {
                    if (store.state.resUser) {
                        next()
                    }else{
                        next({
                            name: 'index'
                        })
                    }
                }else if (to.path=='/propertyPay') {
                    if (store.state.resUser) {
                        next()
                    }else{
                        next({
                            name: 'index'
                        })
                    }
                }else if (to.path=='/complainAndSuggest') {
                    if (store.state.resUser) {
                        next()
                    }else{
                        next({
                            name: 'index'
                        })
                    }
                }else if (to.path=='/myRepair') {
                    next()
                }else if (to.path=='/personRepairDetail') {
                    next()
                }else if (to.path=='/publicRepairDetail') {
                    next()
                }else if (to.path=='/personRepairPay') {
                    next()
                }else if (to.path=='/progressDetail') {
                    next()
                }else if (to.path=='/repairSuccess') {
                    next()
                }else if (to.path=='/myComplain'){
                    next()
                }else if (to.path=='/complainDetail') {
                    next()
                }else if (to.path=='/complainSuccess') {
                    next()
                }else if (to.path=='/ComProcessDetail') {
                    next()
                }else if (to.path=='/myPraise') {
                    next()
                }else if (to.path=='/myHouse') {
                    next()
                }else if (to.path=='/myInfo') {
                    next()
                }else if (to.path=='/chooseCommunity') {
                    next()
                }else if (to.path=='/chooseHouse') {
                    next()
                }else if (to.path=='/upLoadFace') {
                    next()
                }else{
                    next({
                        name:'index'
                    })
                }
            }
        })
    };
    function runAsync(callback){
        AppAxios.WXPuser({openId:store.state.openId}).then(res=>{
            if (res.data.data.resUser) {
                store.commit('setResUser', res.data.data.resUser)
            }else{
                store.commit('setResUser', '')
            }
            callback('ready');
        })
    }
})

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

