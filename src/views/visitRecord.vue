<template>
  <div class="body">
    <div>
      <div class="res-title">
        {{res.label}}
        <mt-button
          v-if="res.list.length > 1"
          class="change-btn"
          type="primary"
          @click.native="res.visible = !res.visible"
        >切换</mt-button>
      </div>
      <mt-popup v-model="res.visible" class="popup" v-if="res.list.length > 1">
        <mt-radio
          align="right"
          v-model="res.value"
          :options="res.list"
          @change="res.visible = false"
        ></mt-radio>
      </mt-popup>
    </div>

    <!-- <mt-search v-model="searchWord" placeholder="搜索" class="search" @change.native="searchChange"></mt-search> -->
    <!-- <div>
      <input type="text" placeholder="搜索" v-model="searchWord" @change.native="searchChange">
    </div>-->

    <search
      style="padding:10px 15px 5px 15px;"
      v-model="searchWord"
      @change="searchChange"
      height="30"
    ></search>
    <!-- <div>{{searchWord}}</div> -->

    <ul
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      class="record-box"
    >
      <li
        v-for="(item, index) in record.list"
        :key="index"
        class="single-record"
        @click="routerToDetail(item.id)"
      >
        <mt-cell :title="item.visitorName" :label="item.createTime" is-link>
          <div>{{item.expectVisitTime + ' ~ ' + item.expectLeaveTime}}</div>
        </mt-cell>
      </li>
      <!-- 加载中 -->
      <div v-if="loading && record.list.length < record.total" class="loading-box">
        <span style="margin-right:10px;">加载中...</span>
        <mt-spinner type="snake" color="#26a2ff"></mt-spinner>
      </div>

      <div v-if="record.list.length >= record.total" class="loading-box">没有更多数据</div>
    </ul>
  </div>
</template>
<script>
import { Button, Popup, InfiniteScroll, Search, Cell, Spinner } from 'mint-ui'
import { queryVisitRecord } from '@/api/visitRecord'
import search from '@/components/search'

export default {
  components: {
    search: search
  },

  props: {

  },

  data() {
    return {
      res: {
        value: '',
        label: '',
        visible: false,
        list: []
      },
      record: {
        list: {},
        total: 0,
        page: 1,  // page从1开始， 0和1请求出来的数据是同样的
        pageSize: 15,
      },
      loading: false,
      searchWord: '',
      preSearchWord: '',
      isMore: true
    }
  },

  created() {
    this.getMyResCodeList()
  },

  watch: {

  },

  mounted() {

  },

  methods: {
    test() {
      console.log(this.searchWord)
    },

    /**
     * 加载更多列表
     */
    loadMore() {
      this.$nextTick(() => {
        if (!this.isMore) return
        this.loading = true
        this.getVisitRecord()
      })
    },

    /**
     * 获取小区列表
     */
    getMyResCodeList() {
      this.res.list = this.getDistinctItem(this.$store.state.resUser.resMyhouse, 'resCode', item => {
        return { value: item.resCode, label: item.resName }
      })
      this.res.value = this.res.list[0].value
      this.res.label = this.res.list[0].label
    },

    /**
     * 对象数组通过某项属性去重
     * @param array [Array] 数组
     * @param keyProperty [String] 数组
     * @param array [Function] 筛选需要返回项
     */
    getDistinctItem(array, keyProperty, getValue) {
      let s = new Set()
      let result = []
      array.forEach(item => {
        const oldSize = s.size
        s.add(item[keyProperty])
        if (s.size > oldSize) {
          if (getValue) {
            result.push(getValue(item))
          } else {
            result.push(item)
          }
        }
      })
      return result
    },

    // 获取访客列表
    getVisitRecord() {
      let param = {
        userId: this.$store.state.resUser.resUserId,
        page: this.record.page,
        pagesize: this.record.pageSize, // 传过去是小写
        resCode: this.res.value,
        sName: this.searchWord
      }
      console.log('搜索关键字：' + param.sName)

      // 关键词变更时
      if (this.preSearchWord !== param.sName) {
        this.preSearchWord = param.sName
        this.record.list = [] // 清空前关键词数据
      }

      queryVisitRecord(param).then(res => {
        this.loading = false

        let data = JSON.parse(res.data.data)
        console.log(data)
        this.record.total = data.Total

        // 无数据的时候
        if (!data.Rows) {
          console.log('未获取到数据')
          return
        }

        // 多页时数据合并，单页时数据重置
        if (param.page > 1) {
          this.record.list = [...this.record.list, ...data.Rows]
        } else {
          this.record.list = data.Rows
        }

        // 判断是否还有下一页数据
        if (this.record.list.length >= data.Total) {
          console.log('没有更多数据')
          this.isMore = false // isMore 用来阻止发送请求
        }

        this.record.page++
      }).catch(err => console.log(err))
    },

    // createTime:"2019-03-29 10:18"
    // expectLeaveTime:"03-31 00:00"
    // expectVisitTime:"03-29 10:17"
    // id:"C73D8587C0A856CE0143622A01F52603"
    // pptTrueName:""
    // resHomeAddr:"禹洲华侨海景城马尼拉楼1单元7楼702室"
    // resTrueName:"翁盛盛"
    // visitorName:"访客客"

    searchChange() {
      this.record.page = 1
      this.getVisitRecord()
    },

    /**
     * 跳转到详情页
     */
    routerToDetail(itemId) {
      this.$router.push({
        name: 'visitDetail',
        params: {
          itemId: itemId
        }
      })
    },

  }

}
</script>
<style lang="less" scoped>
.body {
  background-color: #f5f9fc;
  min-height: 100vh;
}
.search {
  height: 50px;
  font-size: 14px;
}
.res-title {
  padding: 15px;
  font-size: 18px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 1px;
}
.change-btn {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 14px;
  width: 54px;
  height: 30px;
}
.popup {
  min-width: 10rem;
  padding: 5px;
  border-radius: 5px;
  color: #303133;
  box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 2px;
}
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  font-size: 16px;
  color: #666666;
}
.single-record {
  // height: 400px;
  margin-top: 5px;
  border-bottom: 1px solid #cccccc;
}
</style>


