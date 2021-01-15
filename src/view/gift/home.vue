<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { searchGoods } from '@/api/wx'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      inforCardData: [
        { title: '总商品数', icon: 'md-person-add', count: 0, color: '#2d8cf0' }
      ]
    }
  },
  mounted () {
    searchGoods().then(res => {
      if (res.errcode !== 0) {
        this.$Message.info({ content: '加载失败，原因：' + res.errmsg, closable: true })
      } else {
        this.inforCardData[0].count = res.pager.Total
      }
    })
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
