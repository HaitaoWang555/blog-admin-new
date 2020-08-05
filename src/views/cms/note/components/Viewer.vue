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
import 'highlight.js/styles/github.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import '@toast-ui/editor/dist/i18n/zh-cn'

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
        return 'markdown-viewer-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
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
      default: 'zh-CN'
    }
  },
  data() {
    return {
      viewer: null,
      isScreenfull: false
    }
  },
  watch: {
    value(newValue, preValue) {
      this.viewer.setMarkdown(newValue)
    },
    language(val) {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.viewer.height(newValue)
    },
    mode(newValue) {
      this.viewer.changeMode(newValue)
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.destroy()
  },
  methods: {
    init() {
      this.viewer = new Viewer({
        el: document.getElementById(this.id),
        height: this.height,
        plugins: [codeSyntaxHighlight]
      })
      if (this.value) {
        if (this.value.indexOf('<') > -1 && this.value.indexOf('<') < 10) {
          this.setHtml(this.value)
        } else {
          this.setValue(this.value)
        }
        this.goTop()
      }
    },
    destroy() {
      if (!this.viewer) return
      this.viewer.remove()
    },
    setValue(value) {
      this.viewer.setMarkdown(value)
    },
    getValue() {
      return this.viewer.getMarkdown()
    },
    setHtml(value) {
      this.viewer.setHtml(value)
    },
    getHtml() {
      return this.viewer.getHtml()
    },
    goTop() {
      document.querySelector('.markdown-viewer .tui-editor-contents').scrollTop = 0
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
.markdown-viewer {
  background-color: white;
   height: 93%;
}
.markdown-viewer > div {
  height: 100%;
}
.markdown-viewer .tui-editor-contents {
  height: 100%;
  overflow-y: scroll;
  padding: 0 25px;
}
.tui-editor-screenfull .tui-editor-contents{
  height: 100vh;
}
</style>
