// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'es6-promise/auto'
import Util from '@/libs/util.js'
import { WXPuser } from '@/api/App.js'
import { Toast } from 'mint-ui'
import initRichText from './common/initHTMLEditor.js';
initRichText();
Vue.config.productionTip = false
Vue.use(Mint)
/* eslint-disable no-new */
let openId = Util.GetUrlParam('openId')
let pathState = Util.GetUrlParam('pathState')
let repairAddr = Util.GetUrlParam('repairAddr')
if (repairAddr) {
  var url = decodeURI(location.href)
  var urlAll = url.split('?')[1]
  var urlItem = urlAll.split('&')[3]
  repairAddr = urlItem.split('=')[1]
} else {
  repairAddr = ''
}
let repairResCode = Util.GetUrlParam('resCode')
store.commit('setPathState', pathState)
store.commit('setOpenId', openId)
if (repairAddr) {
  store.commit('setRepairAddr', repairAddr)
}
router.beforeEach((to, from, next) => {
  if (to.path == '/deviceState') {
    next()
  } else if (to.path == '/deviceSuccess') {
    next()
  } else if (to.path == '/deviceReport') {
    next()
  } else if (to.path == '/carNumber') {
    next()
  } else if (to.path == '/carPayMoney') {
    next()
  }else if(to.path == '/handDraw'){
    next()
  }else {
    if (store.state.resUser) {
      if (to.path == '/') {
        next({ name: 'index' })
      } else if (to.path == '/index') {
        if (repairAddr != '' && repairResCode != null) { // 扫码
          console.log(88)
          if (store.state.resUser && store.state.resUser.resMyhouse.length > 0) {
            next({
              name: 'repair',
              query: { repairAddr: repairAddr, resCode: repairResCode, openId: openId }
            })
          } else {
            next()
          }
        } else if (Util.GetUrlParam('pathState') == 2) { // 报修
          next({
            name: 'repair'
          })
        } else if (Util.GetUrlParam('pathState') == 3) { // 缴费
          next({
            name: 'propertyPay'
          })
        } else if (Util.GetUrlParam('pathState') == 4) { // 投诉建议
          next({
            name: 'complainAndSuggest'
          })
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      runAsync(function (data) {
        if (data == 'ready') {
          if (to.path == '/') {
            next({ name: 'index' })
          } else if (to.path == '/index') {
            if (repairAddr != '' && repairResCode != null) { // 扫码
              if (store.state.resUser && store.state.resUser.resMyhouse.length > 0) {
                next({
                  name: 'repair',
                  query: { repairAddr: repairAddr, resCode: repairResCode, openId: openId }
                })
              } else {
                next()
              }
            } else {
              next();
            }
          } else {
            next();
          }
        }
      })
    }

  }
  function runAsync(callback) {
    let REDIRECT_URI = window.location.href
    if (REDIRECT_URI.indexOf('scene') >= 0) {
      let splicIndex = REDIRECT_URI.indexOf('#');
      let startSp = REDIRECT_URI.indexOf('?')
      let left = REDIRECT_URI.substring(0, startSp);
      let right = REDIRECT_URI.substring(splicIndex);
      REDIRECT_URI = left + right
    }
    REDIRECT_URI = encodeURIComponent(REDIRECT_URI)
    let code = Util.GetUrlParam("code");
    // alert(code)
    if (!code && !openId) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2a5e764e09995af1&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=111#wechat_redirect'
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2a5e764e09995af1&redirect_uri=https%3a%2f%2fsq.ptnetwork001.com%2f%23%2findex%3ftext%3dtest&response_type=code&scope=snsapi_base&state=111#wechat_redirect'
    } else {
      let href = window.location.href;
      if (href.includes("/?code")) {  //url包括 /?code 证明为从微信跳转回来的
        var index = href.indexOf("#")
        var url = href.substring(0, index); //vue自动在末尾加了 #/ 符号，截取去掉
        var length = href.substring(index).length;
        var jingPosit = url.indexOf("?"); //获取域名结束的位置
        var urlLeft = url.substring(0, jingPosit);//url左侧部分
        var urlRight = url.substring(jingPosit, url.length); //url右侧部分
        if (href.substring(index).indexOf('?') >= 0) {
          urlRight = urlRight.substring(1);
          window.location.href = urlLeft + href.substring(index) + '&' + urlRight + '&request=1';//拼接跳转
        } else {
          window.location.href = urlLeft + href.substring(index) + urlRight + '&request=1';//拼接跳转 
        }
      }
      // alert(Util.GetUrlParam("code"))
      code = Util.GetUrlParam("code")
      let params = {};
      if (openId) {
        params = {
          openId: openId,
          redirect: ''
        }
        WXPuser(params).then(res => {
          store.commit('setOpenId', res.data.data.openId);
          openId = res.data.data.openId;
          if (res.data.data.resUser) {
            // 身份标识，1：物业人员；2：住户；3：访客
            if (res.data.data.resUser.tagId === '102') {
              res.data.data.resUser.identity = '2' // 住户
            } else if (res.data.data.resUser.tagId === '') {
              res.data.data.resUser.identity = '3' // 游客
            }
            store.commit('setResUser', res.data.data.resUser);
            store.commit('setAuto', true);
            code = '';
          } else {
            store.commit('setResUser', '')
            code = '';
          }
          callback('ready')
        }).catch(function (error) { })
      } else {
        params = {
          code: code,
          redirect: ''//测试test  正式为空
        }
        if (Util.GetUrlParam("request") == 1) {
          WXPuser(params).then(res => {
            store.commit('setOpenId', res.data.data.openId);
            openId = res.data.data.openId;
            if (res.data.data.resUser) {
              store.commit('setResUser', res.data.data.resUser);
              store.commit('setAuto', true);
              code = '';
            } else {
              store.commit('setResUser', '')
              code = '';
            }
            callback('ready')
          }).catch(function (error) { })
        }
      }
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
