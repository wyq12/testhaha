<template>
    <div id="app">
        <transition :name="transitionName">

            <!-- <keep-alive> -->
            <!-- <div v-show="isLoading">加载中</div> -->
                <router-view/>
            <!-- </keep-alive> -->
        </transition>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk';
    import Util from '@/libs/util.js'
    import AppAxios from '@/api/App.js'
    import { Toast } from 'mint-ui';
    import { getSignaturePort } from '@/api/complainAndSuggest';
    // import router from './router/index'
    export default {
        name: 'App',

        data(){
            return {
                transitionName:''
            }
        },
        computed: {
            isLoading () {
                return this.$store.state.isLoading
            }
        },
        watch: {//使用watch 监听$router的变化
            $route(to, from) {
                //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
                if(to.meta.index > 0){
                    if( to.meta.index < from.meta.index){
                        this.transitionName = 'slide-right';
                    }else{
                        this.transitionName = 'slide-left';
                    }
                }else if(to.meta.index == 0 && from.meta.index > 0){
                    this.transitionName = 'slide-right';
                }
            }
        },
        mounted () {

        },
        created () {
            // document.ontouchmove = function(e){ e.preventDefault(); }; //移动端禁止滑动
            // var u = navigator.userAgerAgent;
            // console.log('u'+ u)
            // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            // var isiOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // //ios终端
            // if (isiOS) {
                let url=window.location.href.split("#")[0];
                if(window.location.href.indexOf("#")< window.location.href.indexOf("?")){
                    url=window.location.href.split("#")[0];
                }else{
                     url=window.location.href.split("?")[0];
                }
                getSignaturePort({url:url})
                .then(res => {
                    let rtnData = res.data
                    if (rtnData.info == 'success') {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wx2a5e764e09995af1', // 必填，公众号的唯一标识
                            timestamp: rtnData.data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: rtnData.data.nonceStr, // 必填，生成签名的随机串
                            signature: rtnData.data.signature,// 必填，签名，见附录1
                            jsApiList: ['chooseImage', 'getLocalImgData', 'uploadImage', 'downloadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'scanQRCode','getLocation','previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                })
                .catch(error => {});
            // }
        },
        methods: {

        }
    }
</script>

<style lang='less'>
@import 'assets/less/style-index.less';
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        // text-align: center;
        // color: #2c3e50;
        /* margin-top: 60px; */
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        flex:1;
        flex-direction: column;
        // background: #f0f2f5;
        width: 100%;
        height: 100%;
    }
    * {
        margin: 0;
        padding: 0;
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        font-family: arial;
        // color: #333;
        // -webkit-user-select: none;
    }

    html {
        font-family: arail;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 1;
        font-size: 20px;
        height:100%;
        overflow-x: hidden;
    }
    body{
        position: relative;
        overflow-x: hidden;
        // background: #f0f2f5;
        min-height:100%;
        display: flex;
        flex-direction: column;
    }
    ul,ol{
        list-style: none;
    }
    a{
        text-decoration: none;
        outline: none;
        font-size: 14px;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all .3s;
        position: absolute;
        width:100%;
        left:0;
    }
    .slide-right-enter {
        transform: translateX(-100%);
    }
    .slide-right-leave-active {
        transform: translateX(100%);
    }
    .slide-left-enter {
        transform: translateX(100%);
    }
    .slide-left-leave-active {
        transform: translateX(-100%);
    }
    .mint-toast-text {
        color:#fff
    }



</style>
