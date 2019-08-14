<template> 
    <div>
       <div class="title" style="display: flex; justify-content: center;align-items: center; font-size: 24px;">详情</div>
        <div class="headers">
            <span>{{orgName}}</span>
            <span>{{createdTime}}</span>
        </div>
        <div class="header" v-if="temTitleImg!=''"><img :src="temTitleImg" alt=""></div>
        <div class="content"> 
           <vue-html5-editor :content="content"   @change="updateData"></vue-html5-editor>  
         </div> 
        <div class="footer" v-if="temEndImg!=''"><img :src="temEndImg" alt=""></div> 
    </div> 
</template>  
    <style scoped>
</style>  
    <script>
import { noyicesDetail } from "@/api/notices";
import Util from "@/libs/util.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      content: "",
      orgName: "",
      createdTime: "",
      temEndImg:'',
      temTitleImg:''
    };
    //
  },
  created() {
    Indicator.open({
      spinnerType: "fading-circle"
    });
    this.id = Util.GetUrlParam("id");
    let that = this;
    noyicesDetail({ id: that.id })
      .then(res => {
        if (res.data.info == "success") {
          Indicator.close();
          that.content = res.data.data.notice.content;
          that.orgName = res.data.data.notice.orgCode;
          that.createdTime = Util.fmDayMin(res.data.data.notice.createTime);
          if(res.data.data.temEndImg !=''){
             that.temEndImg ='/cisp_admin/upload/PC00001039/noticetmpl/'+res.data.data.temEndImg;
          }
          if(res.data.data.temTitleImg != ''){
             that.temTitleImg ='/cisp_admin/upload/PC00001039/noticetmpl/'+res.data.data.temTitleImg;
          }
         
        } else {
          that.$toast("网络请求失败");
        }
      })
      .catch(function(error) {});
  },
  methods: {
    updateData(e = "") {
      // this.content = e;
      let c1 = e.replace(/<img width="100%"/g, "<img");
      let c2 = c1.replace(/<img/g, '<img width="100%"');
      this.content = c2;
    }
  }
};
</script> 
<style>
.vue-html5-editor td{
  border: 1px solid black;
}
</style>

<style lang="less" scoped>
.title {
  background-image: url("../../static/images/wave_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 5.2rem;
  background-color: white;
}
 .headers {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding-bottom: 5px;
  background-color: white;
  border-bottom:1px solid #dddddd; 
  color: #3da1fe;
}
.footer {
  text-align: right;
  background-color: white;
}
.footer img{
  width: 200px;
  height: 80px;
}
</style>
