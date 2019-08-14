<template>
  
  <div class="backBtn">
  	<p @click="back" class="back">首 页</p>
  </div>
  
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
  	back(){
  		// 后退
//		window.history.back();
//		alert('123456789')
		// 调用返回按钮
    this.$router.push({name:'index'})
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- scoped 该样式表只适用于当前组件 -->
<style scoped>
.back{
	transform:scaleX(-1);
	-webkit-transform:scaleX(-1);
	-webkit-filter:FlipH;
}
.backBtn {
 bottom: 2.3rem;
  background-image: url(../../static/images/btn_bg.png);
  background-repeat: no-repeat;
  background-size: 100%;
  width: 2.5rem;
  height: 1.8rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  bottom: 3.3rem;
  z-index: 1;
  width: 20%;
  position: absolute;
  top: 40px;
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
}

</style>

