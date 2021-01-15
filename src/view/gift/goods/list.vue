<template>
  <div>
    <Card>
      <Button style="margin: 10px 0" type="primary" @click="handleAdd"> 新增</Button>
      <tables ref="tables" :loading="loading" search-place="top" :data="tableData" v-model="tableData" :columns="columns"/>
    </Card>
    <Page style="margin-top: 10px" :total="tableData.length" :page-size-opts="[20,10,5]" :page-size="20" @on-change="changePageNum" @on-page-size-change="changePageSize" show-total show-sizer />
  </div>
</template>

<script>
import Tables from '_c/tables'
import { searchGoods, deleteGoods } from '@/api/wx'

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      loading: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          title: '序号'
        },
        { title: '商品描述', key: 'name', align: 'center' },
        { title: '商品价格', key: 'price', align: 'center' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      pageNum: 0,
      limit: 20
    }
  },
  methods: {
    remove (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除这个商品吗？',
        onOk: () => {
          deleteGoods(this.tableData[index]._id).then(res => {
            // 删除成功
            this.$Message.info({ content: '删除成功', closable: true })
          })
        }
      })
    },
    edit: function (index) {
      // 页面跳转
      this.$router.push({ name: '商品信息', params: this.tableData[index] })
    },
    refreshData () {
      this.loading = true
      let param = {}
      param.limit = this.limit
      param.skip = this.limit * (this.pageNum)
      searchGoods(param).then(res => {
        this.loading = false
        if (res.errcode !== 0) {
          this.$Message.info({ content: '加载失败，原因：' + res.errmsg, closable: true })
        } else {
          let newList = []
          let list = res.data
          list.forEach(item => {
            newList.push(JSON.parse(item))
          })
          this.tableData = newList
        }
      })
    },
    handleAdd () {
      // 新增
      this.$router.push({ name: '商品信息' })
    },
    changePageNum (pageNum) {
      this.pageNum = pageNum
      this.refreshData()
    },
    changePageSize (pageSize) {
      this.limit = pageSize
      this.refreshData()
    }
  },
  mounted () {
    this.refreshData()
  }
}
</script>

<style>

</style>
