<template>
  <div>
    <Form :model="formItem" label-position="top">
      <FormItem label="商品名称">
        <Input v-model="formItem.name" placeholder="请输入商品名称"></Input>
      </FormItem>
      <FormItem label="商品价格">
        <Input v-model="formItem.price" placeholder="请输入商品价格"></Input>
      </FormItem>
      <FormItem label="轮播图">
        <div class="demo-upload-list" v-if="formItem.image.length > 0" v-for="(item, index) in formItem.image">
          <img :src="item">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
          </div>
        </div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          multiple
          :before-upload="beforeUpload"
          type="drag"
          action=""
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
        <Modal title="View Image" v-model="visible">
          <img :src="url" v-if="visible" style="width: 100%">
        </Modal>
      </FormItem>
      <FormItem label="详细描述">
        <div>
          <editor ref="editor"/>
        </div>
      </FormItem>
      <FormItem>
        <Button @click="handleCancel('formValidate')">取消</Button>
        <Button style="margin-left: 8px" type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import Editor from '_c/editor'
import { mapMutations } from 'vuex'
import { saveGoods } from '@/api/wx'
import OSS from 'ali-oss'

const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: '*',
  accessKeySecret: '*',
  bucket: 'giftbook'
})

export default {
  data () {
    return {
      formItem: {
        name: '',
        price: '',
        image: []
      },
      url: '',
      visible: false,
      spinShow: false
    }
  },
  name: 'edit_page',
  components: {
    Editor
  },
  methods: {
    handleSubmit () {
      // -----html内容添加转义-----
      this.formItem.content = this.$refs.editor.getHtml()
      // eslint-disable-next-line no-useless-escape
      let reg = new RegExp('\"', 'g')
      // eslint-disable-next-line no-useless-escape
      this.formItem.content = this.formItem.content.replace(reg, '\\\"')
      // -----html内容添加转义-----
      this.spinShow = true
      saveGoods(this.formItem).then(res => {
        // 添加成功
        this.spinShow = false
        if (res.errcode === 0) {
          this.$Message.info({ content: '保存成功', closable: true })
          this.handleCancel()
        } else {
          this.$Message.info({ content: '保存失败，原因：' + res.errmsg, closable: true })
        }
      })
    },
    handleCancel () {
      // 取消编辑
      this.closeTag({
        name: '商品信息',
        params: this.$route.params
      })
    },
    beforeUpload (file) {
      // 上传前
      this.spinShow = true
      const name = file.name
      const suffix = name.substr(name.indexOf('.'))
      const filename = Date.parse(new Date()) + suffix
      client.put(filename, file).then(res => {
        this.formItem.image.push(res.url)
        this.spinShow = false
      })
      return false
    },
    handleView (url) {
      // 查看图片
      this.url = url
      this.visible = true
    },
    handleRemove (index) {
      // 删除图片
      this.formItem.image.splice(index, 1)
    },
    ...mapMutations([
      'closeTag'
    ])
  },
  mounted () {
    if (undefined === this.$route.params._id || this.$route.params._id === null) {
      return
    }
    this.formItem = this.$route.params
    this.$refs.editor.setHtml(this.formItem.content)
  }
}
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
