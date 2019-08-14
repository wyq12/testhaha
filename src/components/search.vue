<template>
  <div class="box">
    <input
      class="input"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="onInput($event)"
      @change="valueChange($event)"
      :style="styleObject"
    >
    <button class="search-btn" :style="styleObject">
      <img src="../../static/images/search.png" alt>
    </button>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    height: {
      default: 30
    }

  },

  computed: {

  },

  data() {
    return {
      inputValue: '',
      styleObject: {}

    }
  },


  created() {
    this.styleObject = {
      height: this.height + 'px'
    }
  },

  mounted() {

  },

  methods: {
    valueChange(event) {
      this.$emit('change', event.target.value)
    },
    onInput(event) {
      this.$emit('input', event.target.value)
    }


  }
}
</script>


<style lang="less" scoped>
@import "../assets/less/lib-rem";
// #26a2ff
.box {
  display: flex;
  justify-content: flex-start;
}

.input {
  box-sizing: border-box;
  width: 88%;
  // height: 30px;
  font-size: 14px;
  padding: 5px 8px;
  border-radius: 3px 0 0 3px;
  outline: 0;
  border: none;
  border: 1px solid #26a2ff;
}
.search-btn {
  border: none;
  outline: 0;
  width: 12%;
  box-sizing: border-box;
  background-color: #26a2ff;
  border-radius: 0 3px 3px 0;
  padding: 5px;
  // height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
  }
  &:active {
    background-color: #7cc2f8;
  }
}
</style>
