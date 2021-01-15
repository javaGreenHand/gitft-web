<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import { oneOf } from '@/libs/tools'
import OSS from 'ali-oss'

const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: '*',
  accessKeySecret: '*',
  bucket: 'giftbook'
})

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    getHtml () {
      return this.editor.txt.html()
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.config.uploadImgServer = '/upload-img'
    this.editor.config.height = 400
    this.editor.config.zIndex = 1
    this.editor.config.placeholder = '类似于Word的一种编辑器，可输入文字，插入图片，视频等等'
    // 页面初始化
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      const name = resultFiles[0].name
      const suffix = name.substr(name.indexOf('.'))
      const filename = Date.parse(new Date()) + suffix
      client.put(filename, resultFiles[0])
        .then(function (res) {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(res.url)
        }).catch(function (err) {
          console.log(err)
        })
    }
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
  }
}
</script>
