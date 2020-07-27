<template>
  <div class="app-container note-container">
    <Sidebar />
    <div class="editor-wrap">
      <div class="filter-container">
        <div class="filter-item">标题：</div>
        <el-input v-model="title" class="filter-item" clearable style="width: 300px" />
        <el-button class="filter-item" type="primary" @click="upload">上传文章</el-button>
        <el-button :loading="loading" class="filter-item" type="primary" @click="save">保存</el-button>
      </div>
      <markdown-editor
        ref="markdownEditor"
        class="markdown-editor"
        height="calc(100vh - 150px)"
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
import MarkdownEditor from '../article/components/MarkdownEditor'
import Upload from '../article/components/upload'
import { fetchArticle, updateArticle } from '@/api/article'

export default {
  name: 'Note',
  components: {
    Sidebar, MarkdownEditor, Upload
  },
  data() {
    return {
      loading: false,
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
      this.title = res.data.title
      this.content = res.data.content
    },
    async save() {
      const noteData = {
        title: this.title,
        editorType: this.editorModel,
        articleType: 'note',
        content: this.content
      }
      this.loading = true
      if (this.articleId) {
        noteData.id = this.articleId
        const res = await updateArticle(noteData)
        if (res) this.$tips(res)
        this.loading = false
      }
    },
    updateTree(aid) {

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
      this.$refs['markdownEditor'].setValue(this.content + '\n' + value)
    },
    isImgType(suffix) {
      const imgType = ['.png', '.jpg', '.jpeg']
      return imgType.includes(suffix)
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
  height: 100%;
  position: relative;
}
.editor-wrap.noleft {
  width: 95%;
}
.markdown-editor {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f2f5;
}

</style>
<style rel="stylesheet/scss" lang="scss">
.note-container .tui-editor-screenfull-btn {
  top: 8px;
}
.te-md-container.te-preview-style-vertical {
  background-color: white;;
}
</style>
