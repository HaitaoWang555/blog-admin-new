<template>
  <div class="app-container note-container">
    <Sidebar ref="Sidebar" />
    <div class="editor-wrap">
      <div class="filter-container">
        <div class="filter-item">标题：</div>
        <el-input v-model="title" class="filter-item" clearable style="width: 300px" />
        <el-button class="filter-item" type="primary" @click="changeModel">{{ isViewer ? '编辑' : '预览' }}</el-button>
        <el-button v-show="!isViewer" class="filter-item" type="primary" @click="upload">上传文章</el-button>
        <el-button v-show="!isViewer" :loading="loading" class="filter-item" type="primary" @click="save">保存</el-button>
        <el-button v-show="!isViewer" :loading="loading2" class="filter-item" type="primary" @click="changeToArticle">保存并复制到文章</el-button>
      </div>
      <markdown-editor
        v-if="!isViewer"
        ref="markdownEditor"
        class="markdown-editor"
        height="calc(88.5vh - 50px)"
        :value="content"
      />

      <Viewer
        v-else
        ref="markdownEditor"
        class="markdown-viewer"
        :value="content"
      />
    </div>

    <el-dialog :visible="dialog" title="新增" append-to-body @close="closeDialog">
      <Upload
        v-if="dialog && dialogUpload"
        :editor-model="editorModel"
        :article="uploadData"
        :change="completeUpload"
        :close="closeDialog"
      />
    </el-dialog>

  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import Viewer from './components/Viewer'
import MarkdownEditor from '../article/components/MarkdownEditor'
import Upload from '../article/components/upload'
import { fetchArticle, updateArticle } from '@/api/article'
import { changeToArticle } from '@/api/note'

export default {
  name: 'Note',
  components: {
    Sidebar, MarkdownEditor, Upload, Viewer
  },
  data() {
    return {
      loading: false,
      loading2: false,
      isViewer: true,
      title: '',
      content: null,
      articleId: null,
      noteId: null,
      editorModel: 'markdownEditor',
      dialog: false,
      dialogUpload: false,
      uploadData: {}
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.noteId = this.$route.query.id
      this.articleId = Number(this.$route.query.aid)
      this.getArticle()
    },
    async getArticle() {
      if (!this.articleId) {
        this.title = this.$route.query.name
        this.content = null
        return
      }
      const res = await fetchArticle(this.articleId)
      if (!res) {
        this.title = this.$route.query.name
        return
      }
      if (res.data) {
        this.title = res.data.title
        this.content = res.data.content
        this.$refs['markdownEditor'].setValue(this.content)
        this.$refs['markdownEditor'].goTop()
      }
    },
    async save() {
      const noteData = {
        title: this.title,
        editorType: this.editorModel,
        articleType: 'note'
      }
      this.loading = true
      if (this.articleId) {
        noteData.id = this.articleId
        noteData.content = this.$refs['markdownEditor'].getValue()
        const res = await updateArticle(noteData)
        if (res) this.$tips(res)
        this.loading = false
      }
    },
    // upload
    closeDialog() {
      this.dialog = false
      this.dialogMeta = false
      this.dialogUpload = false
    },
    upload() {
      const defaultMeta = {
        file: null
      }
      this.dialog = true
      this.dialogUpload = true
      this.uploadData = defaultMeta
    },
    completeUpload(res) {
      let value = res.data
      if (!value) return
      if (this.editorModel === 'tinymceEditor') {
        value = value.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
          const string = capture.slice(0, 1)
          const start = capture.lastIndexOf(string) + 1
          const imgName = capture.slice(start)
          let newSrc = capture.slice(0, start) + 'thumbnail/' + imgName
          newSrc = newSrc.replace('.png', '.png.jpg')
          const suffix = imgName.slice(imgName.lastIndexOf('.'))

          if (this.isImgType(suffix)) {
            return match.replace(capture, newSrc)
          } else {
            return match
          }
        })
      }
      const oldContent = this.$refs['markdownEditor'].getValue()
      if (oldContent) {
        this.$refs['markdownEditor'].setValue(oldContent + '\n' + value)
      } else {
        this.$refs['markdownEditor'].setValue(value)
      }
    },
    isImgType(suffix) {
      const imgType = ['.png', '.jpg', '.jpeg']
      return imgType.includes(suffix)
    },
    changeModel() {
      if (!this.isViewer) {
        this.content = this.$refs['markdownEditor'].getValue()
      }
      this.isViewer = !this.isViewer
    },
    async changeToArticle() {
      const noteData = {
        title: this.title,
        editorType: this.editorModel,
        articleType: 'note'
      }
      this.loading2 = true
      if (this.articleId) {
        noteData.id = this.articleId
        noteData.content = this.$refs['markdownEditor'].getValue()
        const res = await changeToArticle(noteData)
        if (res) this.$tips(res)
        this.loading2 = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-wrap {
  width: calc(100% - 250px);
  height: calc(100vh - 90px);
  position: relative;
}
.editor-wrap.noleft {
  width: 95%;
}
.markdown-editor {
  width: 100%;
  position: relative;
  background-color: #f0f2f5;
}

</style>
<style rel="stylesheet/scss" lang="scss">
.note-container .filter-container{
  height: 52px;line-height: 52px
}
.note-container .markdown-viewer .tui-editor-screenfull-btn {
  top: 18px;
}
.note-container .tui-editor-screenfull-btn {
  top: 8px;
}
.te-md-container.te-preview-style-vertical {
  background-color: white;;
}
</style>
