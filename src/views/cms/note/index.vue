<template>
  <div class="app-container note-container">
    <Sidebar />
    <div class="editor-wrap">
      <div class="filter-container">
        <div v-show="!isEdit" class="title filter-item" style="width: 300px">{{ title }}</div>
        <el-input v-show="isEdit" v-model="title" clearable style="width: 300px" class="filter-item" />

        <el-button class="filter-item" type="primary" @click="isEdit = !isEdit">{{ !isEdit ? '编辑' : '保存' }}</el-button>
      </div>
      <markdown-editor
        ref="markdownEditor"
        class="markdown-editor"
        height="calc(100vh - 150px)"
        :value="content"
      />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import MarkdownEditor from '../article/components/MarkdownEditor'

export default {
  name: 'Note',
  components: {
    Sidebar, MarkdownEditor
  },
  data() {
    return {
      isEdit: false,
      title: '测试标题',
      content: null,
      noteId: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.noteId = route.query.id
      }
    }
  },
  methods: {
    init() {

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
  min-width: 85%;
  height: 100%;
  position: relative;
}
.editor-wrap .noleft {
  min-width: 95%;
}
.markdown-editor {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f2f5;
}
.title {
  font-size: 28px;
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
