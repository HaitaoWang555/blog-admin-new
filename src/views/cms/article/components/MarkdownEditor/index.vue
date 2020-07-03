<template>
  <div>
    <div :id="id" />
    <div class="tui-editor-screenfull-btn">
      <svg-icon icon-class="screenfull" class-name="screenfull" @click.native="screenfull()" />

    </div>
  </div>
</template>

<script>
// deps for editor
import 'codemirror/lib/codemirror.css' // codemirror
import '@toast-ui/editor/dist/toastui-editor.css' // editor ui
// import 'highlight.js/styles/github.css'
// import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
// import hljs from 'highlight.js'

import Editor from '@toast-ui/editor'
import defaultOptions from './default-options'

import { uploadImgInMd } from '@/api/article'
export default {
  name: 'MarddownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh_CN' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null,
      isScreenfull: false
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      options.hooks.addImageBlobHook = this.handleUpload
      return options
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getValue()) {
        this.editor.setHtml(newValue)
      }
    },
    language(val) {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.editor.height(newValue)
    },
    mode(newValue) {
      this.editor.changeMode(newValue)
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    initEditor() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        // plugins: [[codeSyntaxHighlight, { hljs }]],
        ...this.editorOptions
      })
      if (this.value) {
        if (this.value.indexOf('<') > -1 && this.value.indexOf('<') < 10) {
          this.setHtml(this.value)
        } else {
          this.setValue(this.value)
        }
        document.querySelector('.markdown-editor .CodeMirror-scroll').scrollTop = 0
      }
      // this.editor.on('change', () => {
      //   this.$emit('input', this.editor.getHtml())
      // })
    },
    destroyEditor() {
      if (!this.editor) return
      // this.editor.off('change')
      this.editor.remove()
    },
    setValue(value) {
      this.editor.setValue(value)
    },
    getValue() {
      return this.editor.getValue()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    },
    handleUpload(file, callback) {
      if (!this.beforeUpload(file)) return
      const data = new FormData()
      data.append('file', file)
      return uploadImgInMd(data).then(res => {
        if (res && res.data) callback(encodeURI(res.data), 'image')
      })
    },
    beforeUpload(file) {
      const type = ['image/jpeg', 'image/png']
      const isJPG = type.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    screenfull() {
      if (this.isScreenfull) {
        document.getElementById(this.id).className = ''
        document.querySelector('.tui-editor-screenfull-btn').className = 'tui-editor-screenfull-btn'
        this.isScreenfull = false
      } else {
        document.getElementById(this.id).className = 'tui-editor-screenfull'
        document.querySelector('.tui-editor-screenfull-btn').className = 'tui-editor-screenfull-btn fixed-btn'
        this.isScreenfull = true
      }
    }
  }
}
</script>
<style>
.tui-editor-defaultUI .te-tab button {
  height: 32px;
}
.tui-editor-defaultUI .te-mode-switch-section {
  height: 30px;
}
.te-md-container .CodeMirror, .tui-editor-contents {
  font-family: Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif;
}
.tui-editor-wrap {
  position: relative;
}
.tui-editor-screenfull {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh!important;
  background-color: white;
  z-index: 10000;
}
.tui-editor-screenfull-btn {
  position: absolute;
  right: 20px;
  top: 2px;
  width: 20px;
  height: 20px;
  font-size: 18px;
  color: #333333;
  cursor: pointer;
  z-index: 10000;
}
.tui-editor-screenfull-btn.fixed-btn {
  position: fixed;
}
</style>
