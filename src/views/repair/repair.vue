<template>
      <div v-bind:class="personisShow ==true?'':'repairBody'">

        <div class="repair" style="margin-top:20px;">
            <!-- <mt-radio v-model="value" :options="options" @change="check"> </mt-radio> -->
            <div class="toggleComType" @click="check" v-cloak>{{options}}</div>
            <mt-tab-container>
                <mt-tab-container-item v-if="boxShow">
                    <div class="repairBox">
                        <div class="comBox">
                            <div v-if="!publicisShow" class="comBackground">报事报修</div>
                            <div v-if="publicisShow" class="comBackground" v-cloak>报事报修内容</div>
                            <div style="padding:0.5rem 1rem;">
                                <div v-if="!publicisShow">
                                    <div class="publicRepair reAddr mint-cell">
                                        <span>地址</span>
                                        <div style="width:70%;">
                                            <input type="text" v-model="repairAddr"  style="width:100%;">
                                        </div>

                                    </div>
                                    <!-- <mt-field label="报修地址" class="publicRepair" v-model="repairAddr" style="margin-bottom:1rem;"></mt-field> -->
                                    <!-- </div> -->
                                    <div class="publicRepair mint-cell" style="margin-bottom:1rem;display: -webkit-box;display: -webkit-flex;display: flex; align-items: center; justify-content: space-between;">
                                        <div style="width:93%; display: -webkit-box;display: -webkit-flex;display: flex;justify-content: space-between; ">
                                           <span>类型</span>
                                            <!-- <select name="" id=""  v-model="repairTypesId" v-cloak>
                                                <option value="">请选择</option>
                                                <option v-for="(item,index) in repairTypes" :key="index" :value="item.id+';'+item.pId">{{item.text}}</option>
                                            </select> -->
                                            <div @click="selectType()">{{dictName}}</div>
                                        </div>
                                        <img src="../../../static/images/jiantou.png" alt="" style="width:0.6rem;height:1.2rem;">
                                    </div>
                                    <div class="againScan" @click="scan">扫一扫</div>

                                </div>

                                <div v-if="publicisShow">
                                    <!-- <p>报修内容</p> -->
                                    <div class="repairTypeContent">
                                        <span class="repairContent" v-for="(item,index) in repairContant"  :key="index" v-bind:class="item.active ==true?'selectContent':''" @click="selectContent($event,index)"
                                            v-cloak>{{item.text}}</span>
                                    </div>
                                    <mt-field placeholder="请描述您的报事报修内容" type="textarea" rows="3" :attr="{ maxlength: 200}" v-model="introduction" class="repairContentTextarea"></mt-field>
                                    <div class='addPhoto'>
                                        <div class='addBtn' v-cloak @click="addPhoto1" v-if="repairPhoto1.length<=0">添加图片</div>
                                        <div class="photoContent">
                                            <div class='photo' v-cloak v-for="(item,index) in repairPhoto1"  :key="index">
                                                <div class="removePhoto" @click="removePhoto1(index)">
                                                    <img src="../../../static/images/removePhoto.png" alt="">
                                                </div>
                                                <img :src="item" alt="">
                                            </div>
                                            <!-- <template v->

                                            </template> -->
                                            <div class='photo' v-cloak @click="addPhoto1" v-if="repairPhoto1.length>0 && repairPhoto1.length<6">
                                                <img src="../../../static/images/addPhoto.png" alt="">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <mt-button v-if="!publicisShow" v-cloak class="next" type="primary" size="large" @click="nextRepair">下一步</mt-button>
                        <mt-button v-if="publicisShow" v-cloak class="next" type="primary" size="large" @click="submit">提交</mt-button>
                    </div>
                </mt-tab-container-item>
                <!-- 个人报修 -->
                <mt-tab-container-item v-if="!boxShow">
                    <div class="repairBox" v-cloak>
                        <div class="comBox">
                            <div v-if="!personisShow" class="comBackground">个人报修</div>
                            <div v-if="personisShow" class="comBackground">报修内容</div>
                            <div style="padding:0.5rem 1rem;">
                                <div v-if="!personisShow">
                                    <div class="publicRepair mint-cell mint-field" style="margin-bottom:1rem;display: -webkit-box;display: -webkit-flex;display: flex; align-items: center; justify-content: space-between;">
                                        <div class="mint-cell-wrapper">
                                            <div class="mint-cell-title">
                                                <span class="mint-cell-text">报修地址</span>
                                            </div>
                                            <select name="" id="" class="mint-cell-value" v-model="personRepairAddrId">
                                                <option value="">请选择</option>
                                                <option v-for="(item,index) in personRepairAddrData" :value="item.houseId" :key="index">{{item.houseAddr}}</option>
                                            </select>
                                        </div>
                                        <img src="../../../static/images/jiantou.png" alt="" style="width:0.6rem;height:1.2rem;">
                                    </div>
                                    <div class="publicRepair mint-cell mint-field" style="margin-bottom:1rem;display: -webkit-box;display: -webkit-flex;display: flex; align-items: center; justify-content: space-between;">
                                        <div class="mint-cell-wrapper">
                                            <div class="mint-cell-title">
                                                <span class="mint-cell-text">报修类型</span>
                                            </div>
                                            <select name="" id="" class="mint-cell-value" v-model="personRepairtypeId">
                                                <option value="">请选择</option>
                                                <option v-for="(item,index) in personRepairtypeData" :value="item.id+';'+item.pId" :key="index">{{item.text}}</option>
                                            </select>
                                        </div>
                                        <img src="../../../static/images/jiantou.png" alt="" style="width:0.6rem;height:1.2rem;">
                                    </div>
                                    <mt-button class="next" type="primary" size="large" @click="personNextRepair">下一步</mt-button>
                                </div>

                                <div v-if="personisShow">

                                    <div class="publicRepair reAddr marginBto mint-cell" style="padding:0 10px;">
                                        <span>联系人</span>
                                        <div style="width:70%;">
                                            <input type="text" v-model="relationName"  style="width:100%;">
                                        </div>

                                    </div>
                                    <div class="publicRepair reAddr marginBto mint-cell" style="padding:0 10px;">
                                        <span>联系电话</span>
                                        <div style="width:70%;">
                                            <input type="tel" v-model="relationPhone"  style="width:100%;">
                                        </div>

                                    </div>
                                    <!-- <mt-field label="联系人" class="publicRepair marginBto" v-model="relationName"></mt-field> -->
                                    <!-- <mt-field label="联系电话" class="publicRepair marginBto" type="tel" v-model="relationPhone"></mt-field> -->

                                    <div class="publicRepair marginBto" @click="openPicker">
                                        <mt-cell title="预约时间" is-link>
                                            <span>{{date}}</span>
                                        </mt-cell>
                                    </div>
                                    <div class="publicRepair marginBto">
                                        <mt-cell title="发票信息">
                                            <input type="checkbox" v-model="isNeedInv">
                                            <label>需要开发票</label>
                                        </mt-cell>
                                    </div>
                                    <div>
                                        <mt-cell title="报修内容"></mt-cell>
                                    </div>
                                    <mt-field placeholder="请描述您的报修内容" type="textarea" rows="3" v-model="personIntroduction" class="repairContentTextarea"></mt-field>
                                    <div class='addPhoto'>
                                        <div class='addBtn' @click="addPhoto2" v-if="repairPhoto2.length<=0">添加图片</div>
                                        <div class="photoContent">
                                            <div class='photo' v-for="(item,index) in repairPhoto2" :key="index">
                                                <div class="removePhoto" @click="removePhoto2(index)">
                                                    <img src="../../../static/images/removePhoto.png" alt="">
                                                </div>
                                                <img :src="item" alt="">
                                            </div>
                                            <div class='photo' @click="addPhoto2" v-if="repairPhoto2.length>0 && repairPhoto2.length<6">
                                                <img src="../../../static/images/addPhoto.png" alt="">
                                            </div>
                                        </div>
                                    </div>

                                    <mt-button class="next" type="primary" size="large" @click="personSubmit">提交</mt-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </mt-tab-container-item>

            </mt-tab-container>


            <!-- <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet> -->
            <!-- <mt-actionsheet :actions="personRepairAddrData" v-model="personRepairAddrShow"></mt-actionsheet> -->
            <!-- <mt-actionsheet :actions="personRepairtypeData" v-model="personRepairtypeShow"></mt-actionsheet> -->
            <template>
                <mt-datetime-picker ref="picker" type="datetime" :start-date="startDate" @confirm="handleConfirm">
                </mt-datetime-picker>
            </template>
            <!-- <template> -->
                <!-- <mt-popup v-model="repairTypeVisit" position="bottom" closeOnClickModal style="width:100%">
                    <mt-picker :slots="slots" @change="onValuesChange" value-key="text"></mt-picker>
                <mt-popup> -->
            <!-- </template> -->
            <mt-popup v-model="repairTypeVisit"  position="bottom" style=width:100%;>
                <div class="applyVisit-picker-header">
                    <mt-button type="default" size="small" class="button-mini" @click="cancelRepairType">取 消</mt-button>
                    <mt-button type="primary" size="small" class="button-mini" @click="sureRepairType">确 定</mt-button>
                </div>
                <mt-picker :slots="slots" @change="onValuesChange" value-key="text" ></mt-picker>
           </mt-popup>
        </div>
     </div>
</template>

<script>
 import wx from 'weixin-js-sdk';
 import { getSignature,getPubRepairType,getPubRepairAdd,nextPubRepair,subPublish,
 personAddr,personRepairType,subpersonRepair } from '@/api/repair';
 import { Toast,Popup } from 'mint-ui';
 import Util from '@/libs/util.js'
 import { Indicator } from 'mint-ui';
export default {
    data() {
      return {
        boxShow: true,
        btnShow: true,
        btnShow2: true,
        publicisShow: false,
        personisShow: false,
        // 公共报修
        repairTypes: [],
        // 公共类型id
        repairTypesId: '',
        publicPId:'',
        publicCode:'',
        publicCId:'',
        requestTime:'',
        dictName:'请选择类型',
        sheetVisible: false,
        introduction: '',
        introductionArr: [],
        repairContant: [],
        repairPhoto1: [
        ],
        repairPhoto2: [
        ],
        options: '个人报修',
        // 报修地址
        repairAddr: "",
        // 个人报修
        // 报修地址id
        personRepairAddrId: '',
        // 报修类型id
        personRepairtypeId: '',
        personRepairAddrData: [],
        personisShow: false,
        personRepairtypeData: [],
        relationName: '',
        submitName: '',
        relationPhone: '',
        mphone: '',
        startDate: new Date(),
        date: '',
        isNeedInv: '',
        personIntroduction: '',
        resCode: '',
        resUserId: '',
        defaultPerId: '',
        couponSelected: '',
        userName: '',
        // 调用微信jdk所需参数
        timestamp: '',
        nonceStr: '',
        signature: '',
        city: '',
        // 图片id
        localIds: '',
        fileName:[],
        serverId:[],
        serverId2:[],
        openIds:'',
        repairTypeVisit:false,
        slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'right'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values:[],
          className: 'slot3',
          textAlign: 'left'
        }
      ]
      }
    },
    created :function() {
        // var str = [{id:"2000EC1DC0A8C78348FF4B6E11676102",pId:"",text:"报修类",code:"01",
        // children:[{id:"2001E08FC0A8C78354A66B87FD252A72",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"公告照明",code:"010001"},
        // {id:"20027C5FC0A8C78367199F5E8CDD4A61",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"门禁",code:"010002"},
        // {id:"2002F26EC0A8C783796D763FE66E8A04",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"视频监控",code:"010003"},
        // {id:"20215697C0A8C7831E01E82D62552460",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"给排水",code:"010004"}]},
        //  {id:"2000EC1DC0A8C78348FF4B6E11676102",pId:"",text:"秩序",code:"01",children:[{id:"20215697C0A8C7831E01E82D62552460",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"巡查",code:"010004"}]},
        //   {id:"2000EC1DC0A8C78348FF4B6E11676102",pId:"",text:"投诉",code:"01",children:[{id:"20215697C0A8C7831E01E82D62552460",pId:"2000EC1DC0A8C78348FF4B6E11676102",text:"巡查2",code:"010004"}]},
        //  ]
        // this.slots[0].values = str;
        //  this.slots[2].values =  str[0].children;
        // wx.getLocation({
        //     type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        //     success: function (res) {
        //         var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        //         var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        //         var speed = res.speed; // 速度，以米/每秒计
        //         var accuracy = res.accuracy; // 位置精度
        //         alert('纬度:'+latitude+';经度:'+longitude)
        //    }
        // });
        var that = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        });
        var userData = this.$store.state.resUser
        var resUserId = userData.resUserId
        if (userData) {
            if (userData.resMyhouse[0]) {
                that.resUserId = resUserId;
                that.submitName = userData.trueName;
                that.relationName = userData.trueName;
                that.relationPhone = userData.mphone;
                that.mphone = userData.mphone;
                that.userName = userData.userName;
            } else {
                Toast('没有绑定房屋信息');
            }
        } else {
            Toast('请先注册');
        }
        let repairAddrItem=Util.GetUrlParam("repairAddr");
        if (repairAddrItem) {
            var url=decodeURI(location.href);
            var urlAll=url.split('?')[1]
            var urlItem=urlAll.split('&')[0]
            repairAddrItem=urlItem.split('=')[1]
        }else{
            repairAddrItem=''
        }
        var reCodeWeb = Util.GetUrlParam('resCode')
        that.openIds = Util.GetUrlParam('openId')
        if(repairAddrItem != '' && reCodeWeb != null){
            that.resCode=reCodeWeb;
            that.repairAddr=repairAddrItem;
            if(reCodeWeb == "PC0000103901A7" && userData){
                for (var i = 0; i < userData.resMyhouse.length; i++) {
                    if (userData.resMyhouse[i].isDefaultHouse == 1) {
                        that.resCode  = userData.resMyhouse[i].resCode
                        break;
                    }
                }

            }
        }else{
            if(userData){
                var paramsresCode = '';
                for (var i = 0; i < userData.resMyhouse.length; i++) {
                    if (userData.resMyhouse[i].isDefaultHouse == 1) {
                        paramsresCode = userData.resMyhouse[i].resCode
                        break;
                    }
                }
                that.resCode = paramsresCode;
            }
            that.getRepairAdd();
        }

            // console.log(window.location.href.split("#")[0])
        // 获取公共报修类型
        that.getRepairType(that.resCode);
        // 　　　获取签名
        // var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        // var isiOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // //ios终端
        // if (isAndroid) {

        // }
    },
    mounted(){

    },
    methods: {
        onValuesChange:function(picker, values){
            var that = this;
           that.repairTypesId = values[1];
            if (!values[0]) {
                this.$nextTick(() => {
                if (that.repairTypes) {
                    // 赋默认值
                } else {
                    // picker.setValues([that.repairTypes[0],that.repairTypes[0].children])
                }
                })
            } else {
                picker.setSlotValues(1, values[0].children)
                let town = []
                if (values[1]) {
                   town = values[1].children
                }
                picker.setSlotValues(2, town)
            }
        },
        selectType:function(){
             this.repairTypeVisit=true;
        },
        cancelRepairType() {
            this.repairTypeVisit=false;
        },
        sureRepairType:function(){
            this.repairTypeVisit=false;
            this.dictName = this.repairTypesId.text;
            this.publicPId = this.repairTypesId.pId;
            this.publicCId = this.repairTypesId.id;
            this.publicCode = this.repairTypesId.code;
        },
        // 获取公共报修默认地址
          getRepairAdd: function () {
            var that = this;
            getPubRepairAdd({app_userid: that.resUserId}).then(response => {
                 Indicator.close();
                let rtnData = response.data
                if (rtnData.info == 'success') {
                    if(rtnData.data.defaultAddr){
                        that.repairAddr = rtnData.data.defaultAddr
                    }

                }
            })
            .catch(error => {});

        },
        // 获取公共报修类型
        getRepairType:function(){
            var that =this;
            getPubRepairType({resCode:that.resCode,file:''}).then(res => {
                Indicator.close();
                    let rtnData = res.data
                    let repairType = JSON.parse(rtnData.data)
                    if (rtnData.info == 'success') {
                        that.repairTypes = repairType;
                         this.slots[0].values = that.repairTypes;
                         this.slots[2].values =  that.repairTypes[0].children;
                    }
            })
            .catch(error => {});
        },
          //  下一步
        nextRepair: function () {
            let that = this;
            if (this.repairAddr != '') {
                if(this.repairAddr.length<50){
                if (this.publicCId != '') {

                    // that.dictName = that.repairTypesId.split(';')[0]
                    // that.publicPId = that.repairTypesId.split(';')[1]
                    nextPubRepair({resCode:that.resCode,parentId:that.publicCId,code:that.publicCode}).then(res=>{
                        let rtnData = res.data;
                            if (rtnData.info == 'success') {
                                that.repairContant = rtnData.data[0];
                                let time = rtnData.data[1];
                                that.requestTime = time[0].requestTime;
                                this.publicisShow = true;
                            } else {
                               Toast('网络请求失败')
                            }
                    }).catch(function (error) { });
                }else {
                    Toast('请选择类型')
                }
                }else{
                    Toast('请输入少于50字的地址')
                }
            } else {
                Toast('请输入地址')
            }
        },
        async submit() {
            let that = this;
            if (that.introduction.length > 0) {
                if(that.introduction.length<200){
                    await this.publish(that.publicPId, that.introduction,that.publicCId)
                }else{
                    Toast('请输入少于200字报事报修内容')
                }
            } else {
                Toast('请输入报事报修内容')
            }

        },
         // 提交公共报修
        async publish(dictName, introduction,repairTypeId) {
            let that = this;
            Indicator.open({
                 text:'正在提交中，请稍后...',
                spinnerType: 'fading-circle'
            });
            var mediaIdStr = that.serverId.join(',')
            let params={
                    resCode: that.resCode,
                    buildingId: '',
                    repairAddr: that.repairAddr,
                    repairType: dictName,
                    repairTypeId:repairTypeId,
                    repairContent: introduction,
                    orderStatus: '0',
                    orderFrom: '2',//默认为2
                    resUserId: that.resUserId,
                    createUser: that.userName,
                    submitName: that.submitName,
                    mphone: that.mphone,
                    fileName: 'null',
                    mediaId:mediaIdStr,
                    requestTime:that.requestTime
                }
            subPublish(params).then(res=>{
                let rtnData = res.data;
                if (rtnData.info == 'success') {
                    // window.localStorage.setItem('repairAddr','');//清除扫码缓存
                    // window.localStorage.setItem('resCode_repair','');
                    Indicator.close();
                    if(that.openIds != ''){
                        that.$router.push({name:'repairSuccess', query:{openId:that.openIds}})
                    }else{
                         that.$router.push({name:'repairSuccess'})
                    }

                } else {
                    Toast('网络请求失败')
                }
                }).catch(function (error) { });

        },
          // 选择公共还是个人
        check: function () {
            this.personIntroduction = '';
            this.introduction = '';
            this.personisShow = false;
            this.fileName = [];
            this.repairPhoto1=[];
            this.repairPhoto2=[];
            var that = this;
            if (this.boxShow == true) {
                // 个人
                this.boxShow = false;
                this.options = '报事报修'
                this.personisShow = false;
                var nowDate =  new Date();
                nowDate =new Date(nowDate.setHours(nowDate.getHours()+1));
                this.startDate = nowDate;
                // 查询个人报修地址
                personAddr({
                        app_userid: that.resUserId,
                        resCode: that.resCode
                    }).then(res=>{
                        Indicator.close();
                        let rtnData = res.data;
                        if (rtnData.info == 'success') {
                            var arr = [];
                            for (let i = 0; i < rtnData.data.length - 1; i++) {
                                var personRepairAddrObj = {
                                    houseAddr: rtnData.data[i].houseAddr,
                                    houseId: rtnData.data[i].houseId,
                                    buildingId: rtnData.data[i].id
                                };
                                arr.push(personRepairAddrObj);
                            }
                            var length = rtnData.data.length - 1
                            that.personRepairAddrData = arr;
                            that.personRepairAddrId = rtnData.data[length].defaultHouseId;
                        } else {
                            Toast('网络请求失败')
                        }
                }).catch(function (error) { });

                // 查询个人报修类型
               personRepairType({
                        resCode:that.resCode
                    }).then(res=>{
                          console.log('0000')
                        let rtnData = res.data;

                      if (rtnData.info == 'success') {
                          console.log(JSON.parse(rtnData.data.repairTypeDict))
                        that.personRepairtypeData = JSON.parse(rtnData.data.repairTypeDict)[0].children;

                    } else {
                        Toast('网络请求失败')
                    }
                    }).catch(function (error) { });
            } else if (this.boxShow == false) {
                // 公共
                this.boxShow = true;
                this.options = '个人报修'
                this.publicisShow = false;
                this.$options.methods.getRepairType(that.resCode);
            }
        },
         //    公共报修内容
        selectContent: function (e, index) {
            this.introduction = [];
            if (this.introductionArr.indexOf(e.target.innerHTML) < 0) {
                this.introductionArr.push(e.target.innerHTML)
                this.repairContant[index].active = true;
            } else {
                this.introductionArr.splice(this.introductionArr.indexOf(e.target.innerHTML), 1)
                this.repairContant[index].active = false;
            }
            for (let i = 0; i < this.introductionArr.length; i++) {
                this.introduction += this.introductionArr[i] + ';'
            }
        },
        // 添加图片
        addPhoto1() {
            this.btnShow = false;
            let that = this;
            if(that.repairPhoto1.length<6){
                    wx.chooseImage({
                        count: 6-that.repairPhoto1.length,
                        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            Indicator.open({
                                text:'正在上传图片中，请稍后...',
                                spinnerType: 'fading-circle'
                            });
                            that.uploadImages(localIds,0,'public')
                            for(let i =0;i<localIds.length;i++){
                                that.repairPhoto1.push(localIds[i]);
                            }
                        },
                        fail:function(error){
                           console.log(error)
                        }
                    });
            }else{
                Toast('您最多可上传6张图片')
            }
        },
         uploadImages:function(localIds,i,type){
            let that = this;
            wx.uploadImage({
                localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId;
                    if(type =='public'){
                        that.serverId.push(serverId);
                    }else if(type =='person'){
                        that.serverId2.push(serverId);
                    }
                    if(i<localIds.length-1){
                        setTimeout(function(){
                            i++;
                            that.uploadImages(localIds,i,type);
                        },100);
                    }else{
                        Indicator.close();
                    }
                }
            })
        },
        removePhoto1: function (index) {
            let that = this;
            this.serverId.splice(index,1);
           this.repairPhoto1.splice(index,1)
        },
        // 个人
        addPhoto2: function () {
            this.btnShow2 = false;
            let that = this;
            if(that.repairPhoto2.length<6){
            wx.ready(function () {
                wx.chooseImage({
                    count: 6-that.repairPhoto2.length,
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        Indicator.open({
                            text:'正在上传图片中，请稍后...',
                            spinnerType: 'fading-circle'
                        });
                        that.uploadImages(localIds,0,'person')
                        for(let i =0;i<localIds.length;i++){
                            that.repairPhoto2.push(localIds[i]);
                        }
                    },
                });
            })
            }else{
                Toast('您最多可上传6张图片')
            }
        },
        removePhoto2: function (index){
            this.serverId2.splice(index,1);
             this.repairPhoto2.splice(index,1)
        },
        scan: function () {
            wx.scanQRCode({
                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                },
                fail:function(error){
                    alert(error)
                    console.log(error)
                }
            });
        },
        // 个人

        // 下一步
        personNextRepair: function () {
            if (this.personRepairAddrId == '') {
                Toast('请选择报修地址')
                return;
            } else if (this.personRepairtypeId != '') {
                this.personisShow = true;
            } else {
               Toast('请选择报修类型')
                return;
            }

        },
        openPicker: function () {
            this.$refs.picker.open();
        },
        //   个人报修提交
        personSubmit: function () {
            var that = this;
            var mediaIdStr = that.serverId2.join(',')
            var housAddress = Util.getTypeJsonText(this.personRepairAddrData, this.personRepairAddrId);
            var InVio = '';
            // if (this.date == '') {
            //     Toast('请选择时间');
            //     return;
            // } else
             if (this.personIntroduction == '') {
                Toast('请描述您的报修内容');
                return;
            } else if(this.personIntroduction.length >200){
                Toast('请输入少于200字的报修内容');
                return;
            } else {
                if (this.isNeedInv == '') {
                    InVio = '0';
                } else if (this.isNeedInv == true) {
                    InVio = '1';
                }
                let dates = Util.parseDateTime(that.date);
                Indicator.open({
                    text:'正在提交中，请稍后...',
                    spinnerType: 'fading-circle'
                });
                let personParams = {
                        resCode: that.resCode,
                        houseId: that.personRepairAddrId,
                        repairAddr: housAddress,
                        repairType: that.personRepairtypeId.split(';')[1],
                        repairTypeId:that.personRepairtypeId.split(';')[0],
                        repairContent: that.personIntroduction,
                        orderStatus: '0',
                        orderFrom: '2',
                        resUserId: that.resUserId,
                        createUser: that.userName,
                        submitName: that.relationName,
                        mphone: that.relationPhone,
                        hopeDealTime: dates,
                        isNeedInvoice: InVio,
                        payStatus: '0',
                        fileName: 'null',//图片路径
                        mediaId:mediaIdStr
                }
                subpersonRepair(personParams).then(res=>{
                     let rtnData = res.data;
                    if (rtnData.info == 'success') {
                        // window.localStorage.setItem('repairAddr','');//清除扫码缓存
                        // window.localStorage.setItem('resCode_repair','');

                        Indicator.close();
                         that.$router.push({name:'repairSuccess'})

                    } else {
                        Toast('网络请求失败')
                    }
                }).catch(function (error) { })

            }
        },
        handleConfirm: function (value) {
            this.date = Util.handleConfirm(value)
        }
    }
};
</script>
<style lang="less">
   .mint-cell-wrapper,.mint-cell:last-child {
        background-image: none !important;
        background-color: white !important;
    }
    .picker-item{
        color: silver ;
        font-size: 16px ;
    }
    .picker-item.picker-selected{
        font-size: 19px;
    }
</style>

<style lang="less" scoped>
@import "../../assets/less/repair.less";
@import "../../assets/less/complainAndSuggest.less";
    select {
            /* width: 100%; */
            -webkit-appearance: none;
            border: none;
            outline: none;
            /* text-align: right; */
            direction: rtl;
            background-color: white;
        }
      .applyVisit-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 5px 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 1px;
  }
    .repairBody {
        width: 100%;
        height: 100%;
        background-image: url(../../../static/images/repairBg.png);
        background-size: 100% 100%;
        flex:1;
    }

    .marginBto {
        margin-bottom: 0.1rem;
    }
    [v-cloak] {
        display: none
    }
</style>
