<template>
    <div class="carNUmberBox">
        <div>
            <div style="width：100%;height:6rem;background-color:white;padding:1.5rem 1rem 0 1rem">
              <div class="hint">请选择</div>
              <div class="car-content-title">
                  <div class="carKindBtn" v-bind:class="!checkbox?'activeCarKindBtn':''" @click="noNewEnergy">非新能源汽车</div>
                  <div class="carKindBtn" v-bind:class="checkbox?'activeCarKindBtn':''"@click="newEnergy">新能源汽车</div>
                  <!-- <label class="ze-checkbox"><input type="checkbox" v-model="checkbox" @change="carTypeChange">
                  <span class="ze-checkbox-icon" style="width: 15px;height: 15px;color: rgb(76, 216, 100);">
                      <i style="width: 4px;height: 10px;"></i>
                  </span>
                  <span class="ze-checkbox-text">新能源</span>
                  </label> -->
              </div>
            </div>
           
            <div class="content-section">
                 <div class="hint">请输入车牌号</div>
                <div class="content-section-flex flex-card">
                    <div class="content-section-flex flex-card-border">
                        <button id="font" class="flex-btn" @click="btnClickYue" v-bind:class="{isClick: isYue,NoNumclick: !isYue }">
                        {{areaName}}
                        </button>
                        <button id='letter' class="flex-btn" @click="btnClickA" v-bind:class="{isClick: isA,NoNumclick: !isA}">
                        {{areaLetter}}
                        </button>
                        <div class="flex-mid"><span></span></div>
                        <div class="flex-btns">
                            <button id='numOne' class="flex-btn" @click="btnClickNum('one')" v-bind:class="{isNumClick: isNumOne,NoNumclick: !isNumOne }">{{numOne}}</button>
                            <button id='numTwo'  class="flex-btn" @click="btnClickNum('two')" v-bind:class="{isNumClick: isNumTwo,NoNumclick: !isNumTwo }">{{numTwo}}</button>
                            <button id='numThree'  class="flex-btn" @click="btnClickNum('three')" v-bind:class="{isNumClick: isNumThree,NoNumclick: !isNumThree }">{{numThree}}</button>
                            <button id='numFour'  class="flex-btn" @click="btnClickNum('four')" v-bind:class="{isNumClick: isNumFour,NoNumclick: !isNumFour }">{{numFour}}</button>
                            <button id='numFive'  class="flex-btn" @click="btnClickNum('five')" v-bind:class="{isNumClick: isNumFive,NoNumclick: !isNumFive }">{{numFive}}</button>
                            <button v-if="checkbox"  class="flex-btn" id='numSix' @click="btnClickNum('six')"
                                    v-bind:class="{isNumClick: isNumSix,NoNumclick: !isNumSix  }">{{numSix}}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <div class="payBtn" @click="addCar">下一步</div>
        </div>
        <div class="keyboard" v-if="keyboardShow" :class='{animationDown:isDown,animationUp:isUp}'>
            <button class="btn-complete" @click="completeClick"><span>完成</span></button>
            <div v-if="keyboard == 'txt'">
                <div class="keyboard-row" v-for="(item,rows) in carTxt">
                    <button class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}
                    </button>
                </div>
                <div class="keyboard-row">
                    <!-- <div class="keyboard-row-items"> -->
                    <button class="keyboard-row-item bottom" @click="btnBottomClick('新')">新</button>
                    <button class="keyboard-row-item bottom" @click="btnBottomClick('临')">临</button>
                    <button v-for="j in noneBottomtxt" class="none-botton">{{j}}</button>
                    <div class="keyboard-row-item clear" @click="clearClick">
                        <img src="../../static/images/icon_input_delete.png" alt="删除">
                    </div>
                    <!-- </div> -->
                </div>
            </div>
            <div v-if="keyboard == 'num'">
                <div class="keyboard-row" v-for="(item,rows) in carNum">
                    <button :disabled="!isSelectl?isDisable && i<10 :isDisable&& rows!=0 " class="keyboard-row-item"
                            v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}
                    </button>
                </div>
                <div class="keyboard-row">
                    <!-- <div class="keyboard-row-bottom"> -->
                    <button :disabled="isSelectl" v-for="item in carNumBottom" class="keyboard-row-item bottom"
                            @click="btnBottomNumClick(item)">{{item}}
                    </button>
                    <button v-for="j in noneBottom" class="none-botton">{{j}}</button>
                    <div class="keyboard-row-item clear" @click="clearClick">
                        <img src="../../static/images/icon_input_delete.png" alt="删除">
                    </div>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Util from '@/libs/util.js';
import { Toast } from "mint-ui";
import { getVehiclePort,getVehicleInfoPort } from "@/api/carPayMoney";
export default {
  data() {
    return {
      checkbox: false,
      isDown: false,
      isUp: false,
      selected: null,
      isSelectx: false,
      isSelectl: false,
      key: 1,
      areaName: "",
      areaLetter: "",
      numOne: "",
      numTwo: "",
      numThree: "",
      numFour: "",
      numFive: "",
      numSix: "",
      isYue: false,
      keyboardShow: false,
      keyboard: false,
      isA: false,
      isNumOne: false,
      isNumTwo: false,
      isNumThree: false,
      isNumFour: false,
      isNumFive: false,
      isNumSix: false,
      isDisable: false,
      carTxt: [
        { name: ["粤", "京", "冀", "沪", "津", "晋", "蒙", "辽", "吉", "黑"] },
        { name: ["苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "桂"] },
        { name: ["琼", "渝", "川", "贵", "云", "藏", "陕", "甘", "青", "宁"] }
      ],
      carNumBottom: ["X", "C","V", "B", "N", "M"],
      noneBottom: ["", "", ""],
      noneBottomtxt: ["", "", "", "", "", ""],
      carNum: [
        { name: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] },
        { name: ["Q", "W", "E", "R", "T", "Y", "U", "I","O", "P"] },
        { name: [ "A","S", "D", "F", "G", "H", "J", "K", "L", "Z"] }
      ],
      addedCarNum: "",
      editCarNum:'',
      openId:'',
      parkCode:'',
      carId:''
    };
  },
    created(){
        let carNum = Util.GetUrlParam("carNumber");
        this.openId = Util.GetUrlParam("openId");
        this.parkCode = Util.GetUrlParam("parkCode");
        this.carId = Util.GetUrlParam("carId");
       if (carNum) {
          let url = decodeURI(location.href);
          let urlAll = url.split('?')[1]
          this.editCarNum = urlAll.split('&')[0].split('=')[1]
          console.log(urlAll.split('&')[0].split('=')[1])
          if(this.editCarNum.length == 9){
            // 新能源
              this.checkbox = true;
              this.numSix = this.editCarNum[8];
              console.log(this.checkbox )
          }
          this.areaName = this.editCarNum[0];
          this.areaLetter = this.editCarNum[2];
          this.numOne = this.editCarNum[3];
          this.numTwo = this.editCarNum[4];
          this.numThree = this.editCarNum[5];
          this.numFour = this.editCarNum[6];
          this.numFive = this.editCarNum[7];
      }else{
        this.editCarNum = '';
      }
  },
   mounted () {
            this.btnClickYue()
        },
  watch: {
    checkbox: function(val) {
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      const vm = this;
      if (!val) {
        // 切换到普通车牌
        if (vm.numFour) {
          vm.isNumFive = true;
          vm.key = 7;
          console.log(4, val);
        }
      } else {
        // 切换到新能源车牌
        if (vm.numFive) {
          vm.isNumSix = true;
          vm.key = 8;
          console.log(3, val);
        }
      }
    }
  },
  methods: {
    carTypeChange(val) {
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      if (!val) {
        // 切换到普通车牌
        if (this.numFour) {
          this.isNumFive = true;
          this.key = 7;
        }
      } else {
        // 切换到新能源车牌
        if (this.numFive) {
          this.isNumSix = true;
          this.key = 8;
        }
      }
    },
    // 地区
    btnClickYue() {
      this.isYue = true;
      this.isA = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = "txt";
      this.key = 1;
    },
    // 点击地区键盘
    btnWordClick(rows, index, i) {
      this.selected = i;
      if (this.key === 1) {
        if (this.areaName === "临") {
          this.areaLetter = "";
          this.numOne = "";
          this.numTwo = "";
          this.numThree = "";
          this.numFour = "";
          this.numFive = "";
          this.numSix = "";
        }
        this.areaName = i;
        this.isSelectl = false;
        document.getElementById("letter").click();
      } else if (this.key === 2) {
        this.areaLetter = i;
        document.getElementById("numOne").click();
      } else if (this.key === 3) {
        this.numOne = i;
        document.getElementById("numTwo").click();
      } else if (this.key === 4) {
        this.numTwo = i;
        document.getElementById("numThree").click();
      } else if (this.key === 5) {
        this.numThree = i;
        document.getElementById("numFour").click();
      } else if (this.key === 6) {
        this.numFour = i;
        document.getElementById("numFive").click();
      } else if (this.key === 7) {
        this.numFive = i;
        if (this.checkbox) {
          document.getElementById("numSix").click();
        }
      } else if (this.key === 8) {
        this.numSix = i;
      }
      if (this.key === 7 || this.key === 8) {
        this.carNumBottom = ["X", "C","V", "B", "N", "M", "港", "澳", "学"];
        this.noneBottom = [];
      } else if (
        this.key === 3 ||
        this.key === 4 ||
        this.key === 5 ||
        this.key === 6
      ) {
        this.carNumBottom = ["X", "C","V", "B", "N", "M"];
        this.noneBottom = ["", "", ""];
      }
    },
    // 键盘最后两个键
    btnBottomClick(val) {
      if (val === "新") {
        if (this.areaName === "临") {
          this.areaLetter = "";
          this.numOne = "";
          this.numTwo = "";
          this.numThree = "";
          this.numFour = "";
          this.numFive = "";
          this.numSix = "";
        }
        this.areaName = "新";
        this.isSelectx = true;
        this.isSelectl = false;
        document.getElementById("letter").click();
      } else if (val === "临") {
        this.areaName = "临";
        this.isSelectl = true;
        this.isSelectx = false;
        this.isDisable = true;
        this.areaLetter = "";
        this.numOne = "";
        this.numTwo = "";
        this.numThree = "";
        this.numFour = "";
        this.numFive = "";
        this.numSix = "";
        document.getElementById("letter").click("isLin");
      }
    },
    btnBottomNumClick(i) {
      this.selected = i;
      if (this.key === 2) {
        this.areaLetter = i;
        document.getElementById("numOne").click();
      } else if (this.key === 3) {
        this.numOne = i;
        document.getElementById("numTwo").click();
      } else if (this.key === 4) {
        this.numTwo = i;
        document.getElementById("numThree").click();
      } else if (this.key === 5) {
        this.numThree = i;
        document.getElementById("numFour").click();
      } else if (this.key === 6) {
        this.numFour = i;
        document.getElementById("numFive").click();
      } else if (this.key === 7) {
        this.numFive = i;
        if (this.checkbox) {
          document.getElementById("numSix").click();
        }
      } else if (this.key === 8) {
        this.numSix = i;
      }
    },
    btnClickA() {
      this.isDisable = true;
      this.isA = true;
      this.isYue = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = "num";
      this.key = 2;
    },
    btnClickNum(name) {
      if (this.isSelectl) {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
      this.keyboard = "num";
      this.keyboardShow = true;
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = true;
      if (name === "one") {
        this.isNumOne = true;
        this.key = 3;
      } else if (name === "two") {
        this.isNumTwo = true;
        this.key = 4;
      } else if (name === "three") {
        this.isNumThree = true;
        this.key = 5;
      } else if (name === "four") {
        this.isNumFour = true;
        this.key = 6;
      } else if (name === "five") {
        this.isNumFive = true;
        this.key = 7;
      } else if (name === "six") {
        this.isNumSix = true;
        this.key = 8;
      }
      if (name === "five" || name === "six") {
        this.carNumBottom = ["X", "C","V", "B", "N", "M", "港", "澳", "学"];
        this.noneBottom = [];
      } else {
        this.carNumBottom = ["X", "C","V", "B", "N", "M"];
        this.noneBottom = ["", "", ""];
      }
    },
    completeClick() {
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = false;
      this.isDown = true;
      this.keyboardShow = false;
    },
    clearClick() {
      if (this.key === 1) {
        this.areaName = "";
      } else if (this.key === 2) {
        document.getElementById("font").click();
        this.areaLetter = "";
      } else if (this.key === 3) {
        document.getElementById("letter").click();
        this.numOne = "";
      } else if (this.key === 4) {
        document.getElementById("numOne").click();
        this.numTwo = "";
      } else if (this.key === 5) {
        document.getElementById("numTwo").click();
        this.numThree = "";
      } else if (this.key === 6) {
        document.getElementById("numThree").click();
        this.numFour = "";
      } else if (this.key === 7) {
        document.getElementById("numFour").click();
        this.numFive = "";
      } else if (this.key === 8) {
        document.getElementById("numFive").click();
        this.numSix = "";
      }
    },
    addCar() {
      let that = this;
      var num;
      if (!this.checkbox) {
        num =
          this.areaName +'-'+
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive;
      } else if (this.checkbox) {
        num =
          this.areaName +'-'+
          this.areaLetter +
          this.numOne +
          this.numTwo +
          this.numThree +
          this.numFour +
          this.numFive +
          this.numSix;
      }
      if (num === "") {
        Toast({ message: "请输入车牌", duration: 1000 });
      } else if (
        !this.checkbox &&
        (this.areaName === "" ||
          this.areaLetter === "" ||
          this.numOne === "" ||
          this.numTwo === "" ||
          this.numThree === "" ||
          this.numFour === "" ||
          this.numFive === "")
      ) {
        Toast({ message: "请输入完整车牌", duration: 1000 });
      } else if (
        this.checkbox &&
        (this.areaName === "" ||
          this.areaLetter === "" ||
          this.numOne === "" ||
          this.numTwo === "" ||
          this.numThree === "" ||
          this.numFour === "" ||
          this.numFive === "" ||
          this.numSix === "")
      ) {
        Toast({ message: "请输入完整车牌", duration: 1000 });
      } else {
          let params = {
            id:this.carId,
            openId:this.openId,
            carNumber:num
          }
          getVehiclePort(params).then(res => {
              let resData = res.data;   
              if(resData.info == 'success' ){
                // console.log(resData)
                 that.$router.push({name:'carPayMoney',query:{openId:that.openId,parkCode:that.parkCode,carNumber:num}})
              }else if(resData.info == 'repetition'){
                Toast({message:resData.message,duration:1200})
              }else{
                 Toast(resData.message)
              }
          }).catch(function(error){})
        // let data = {
        //     vehiclenum: num
        // }
        // this.$http.post(ADD_VEHICLE, data).then(res => {
        //   if (res.data.ret === 0) {
        //     this.addedCarNum = num
        //     this.$router.push({name: 'AddSuccess', params: {addedCarNum: this.addedCarNum}})
        //   } else {
        //     Toast({message:res.data.message,duration:1200})
        //   }
        // })
      }
    },
    noNewEnergy(){
          this.checkbox = false;
    },
    newEnergy(){
      this.checkbox = true;
    }
  }
};
</script>
<style lang="less" scoped>
.carNUmberBox{
  width: 100%;
  height: 100vh;
  background-color: #F4F4F6;
}
button {
  outline: none;
}
.ze-checkbox > input[type="checkbox"] {
  position: absolute;
  left: -9999em;
}

.ze-checkbox > input[type="checkbox"]:checked + .ze-checkbox-icon {
  background-color: currentColor;
  border-color: #ffc400;
}

.ze-checkbox-icon {
  border: 1px solid #ccc; /*no*/
  border-radius: 2px;
  display: inline-block;
  position: relative;
  z-index: 10;
  vertical-align: bottom;
  pointer-events: none;
  > i {
    content: "";
    position: absolute;
    top: 45%;
    left: 50%;
    border: 2px solid #ffc400; /*no*/
    border-top: 0;
    border-left: 0;
    -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(0);
    transform: translate(-50%, -50%) rotate(45deg) scale(0);
  }
}

.ze-checkbox > input[type="checkbox"]:checked + .ze-checkbox-icon > i {
  -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(1);
  transform: translate(-50%, -50%) rotate(45deg) scale(1);
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
// background-color:#fffff;

.car-content-title {
  display: flex;
  justify-content: space-between;
  padding: 0 13px;
  margin-bottom: 16px;
  span {
    font-size: 16px;
  }
  .ze-checkbox {
    display: flex;
    align-items: center;
  }
  .ze-radio-text {
    font-size: 28px;
  }
  .ze-checkbox-icon {
    color: #ffedb1 !important;
    margin-right: 8px;
  }
}
.content-section {
  margin-top: 10px;
  padding: 1.5rem 1rem 0 1rem;
  background-color: white;
  .content-section-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    margin-bottom: 35px;

    &.flex-card {
      color: #000;
      .flex-btn {
        width: 1.5rem;
        height: 2rem;
        border: none;
        text-align: center;
        background: #fff;
        font-size: 16px;
        color: #000;
         margin-left: 5px;
      }
      .flex-btns {
        text-align: center;
        // background: #fff;
        display: flex;
        align-items: center;
        //   width: fit-content;
        //   position: relative;
        //   height: 98px;
        button {
           margin-left: 5px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      .flex-mid {
        margin: 0 0.1rem;
        span {
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ddd;
        }
      }
      .isClick {
        border: 1px solid #518dea; /*no*/
        z-index: 50;
        border-radius: 8px;
      }
      .isNumClick {
        border-radius: 8px ;
        border: 1px solid #518dea ; /*no*/
        z-index: 10;
        background-color: #fff ;
      }
      .NoNumclick{
          border-radius: 8px ;
          border: 1px solid silver; /*no*/
          z-index: 10;
          background-color: #fff ;
      }
    }

  }
}

.keyboard {
  width: 100%;
  height: 11.1rem;
  position: fixed;
  bottom: -11.1rem;
  background: #eeeeee;
  z-index: 10;
  &.animationDown {
    animation: slide_dowms 0.3s ease-out;
    animation-fill-mode: forwards;
  }
  &.animationUp {
    animation: slide_ups 0.3s ease-out;
    animation-fill-mode: forwards;
  }
  .btn-complete {
    height: 40px;
    line-height: 40px;
    text-align: right;
    color: #3da1fe;
    font-size: 17px;
    width: 100%;
    background: #fff;
    border: none;
    border-top: 1px solid #eee;
    margin-bottom: 10px;
    & span {
      margin-right: 30px;
    }
  }
  .keyboard-row {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
    color: #333;
    &:first-child {
      margin-top: 0;
    }
    .keyboard-row-items {
      display: flex;
      justify-content: left;
    }
    .keyboard-row-bottom {
      display: flex;
      justify-content: space-between;
    }
    .keyboard-row-item {
      width: 1.4rem;
      height: 1.6rem;
      background: #fff;
      font-size: 16px;
      text-align: center;
      border: 1px solid #ccc; /*no*/
      border-radius: 5px;
      color: #333;
      &.bottom {
        height: 1.6rem;
        width: 1.4rem;
        // line-height: 80px;
        background: #fff;
        color: #333;
        /*margin-right: 0.08rem;*/
      }
      &.clear {
        width: 1.4rem;
        height: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        & img {
          width: 80%;
        }
      }
    }
    .none-botton {
      border: none;
      height: 1.6rem;
      width: 1.4rem;
      visibility: hidden;
    }
  }
  button {
    &:active {
      background: #f4f4f4 !important;
      color: #999 !important;
    }
  }
}
@keyframes slide_ups {
  from {
    bottom: -502px;
  }
  to {
    bottom: 0px;
  }
}
@keyframes slide_dowms {
  from {
    bottom: 0px;
  }
  to {
    bottom: -502px;
  }
}
button:disabled {
  background: #f4f4f4 !important;
  color: #8f8f8f !important;
}
.active {
  &:active {
    background: #f4f4f4 !important;
    color: #999 !important;
  }
}
.carKindBtn{
  font-size: 16px;
  width: 6rem;
  height: 2rem;
  line-height: 2rem;
  border: 1px solid silver;
  border-radius: 5px;
  text-align: center;
}
.activeCarKindBtn{
  background-image:linear-gradient(to right, #72bdff, #518dea);
  color: white;
  border: none;
}
.hint{
  font-size: 16px;
  margin-bottom: 1rem;
}
  .payBtn{
      background-image:linear-gradient(to right, #72bdff, #518dea);
      color: white;
      line-height:2rem;
      text-align: center;
      margin: 3rem 1rem 0 1rem;
  }
</style>




