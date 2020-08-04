<template>
  <div class="sidebar-note" :class="{'hidden-sidebar-note':!isOpened}">
    <div class="filter-container">
      <el-input
        v-show="isOpened"
        v-model="filterText"
        prefix-icon="el-icon-search"
        clearable
        style="width: 163px"
        class="filter-item"
        @change="search"
        @clear="clear"
      />
      <div v-show="isOpened" class="filter-item" style="font-size:24px;cursor: pointer;" @click="reSetMenu">
        <svg-icon icon-class="dingwei" />
      </div>
      <div class="filter-item" style="font-size:24px;cursor: pointer;" @click="toggle">
        <i v-show="isOpened" class="el-icon-s-fold" />
        <i v-show="!isOpened" class="el-icon-s-unfold" />
      </div>

    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" @click.prevent.native="goRouter($event)" @contextmenu.prevent.native="openMenu($event)">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="note in noteList" :key="note.id" :item="note" />
      </el-menu>
    </el-scrollbar>

    <ul v-if="visible" :style="{left:left+'px',bottom:bottom,top:top}" class="contextmenu">
      <li v-show="tagsFileView" @click="addNoteMenu('folder')">{{ tagsView.addFolder }}</li>
      <li v-show="tagsFileView" @click="addNoteMenu('file')">{{ tagsView.addFile }}</li>
      <li v-show="tagsFileView" @click="importDir">{{ tagsView.importFolder }}</li>
      <li v-if="tag" @click="updateMenu">{{ tagsView.updateMenu }}</li>
      <li @click="delNoteMenu">{{ tagsView.delete }}</li>
      <li @click="download">{{ tagsView.download }}</li>
    </ul>
    <div style="display:none">
      <input id="webkitdirectory" type="file" name="files" webkitdirectory multiple @change="uploadBatch">
    </div>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { treeList, addMenu, delMenu, uploadNoteDir, download, updateMenu } from '@/api/note'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  data() {
    return {
      filterText: null,
      noteList: [],

      isOpened: true,

      visible: false,
      top: 0,
      left: 0,
      bottom: 'auto',
      tagsView: {
        addFolder: '新建文件夹',
        importFolder: '导入文件夹',
        addFile: '新建文件',
        updateMenu: '重命名',
        delete: '删除',
        download: '下载'
      },
      tagsFileView: true,

      tag: null,
      sidebarTag: null, // 右键的元素
      noteMenu: {}, // 新增/修改笔记菜单

      activeMenu: null
    }
  },
  computed: {
    isCollapse() {
      return !this.isOpened
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const data = await treeList()
      if (!data) return
      this.noteList = data.data.list
      const id = this.$route.query.id
      if (id) this.activeMenu = String(id)
    },
    toggle() {
      this.isOpened = !this.isOpened
      if (this.isOpened) {
        document.querySelector('.editor-wrap').classList = 'editor-wrap'
      } else {
        document.querySelector('.editor-wrap').classList = 'editor-wrap noleft'
      }
    },
    clear() {},
    search() {},
    addNoteMenu(type) {
      if (this.sidebarTag) this.sidebarTag.className += ' sidebarTagSubmenu'
      this.noteMenu.parentId = this.tag ? this.tag.id : 0
      this.noteMenu.menuType = type
      const head = type === 'file' ? '文件名称' : '文件夹名称'
      this.$prompt('请输入' + head, {
        inputPattern: /\S/,
        inputErrorMessage: head + '不能为空',
        confirmButtonText: '添加',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.noteMenu.name = value
        addMenu(this.noteMenu).then(res => {
          if (!res) return
          this.updateTree(res.data)
          this.$tips(res)
          this.closeMenu()
        })
      }).catch(() => { this.closeMenu() })
    },
    delNoteMenu() {
      if (!this.tag) return
      delMenu(this.tag.id).then(res => {
        if (!res) return
        this.updateTreeDel()
        this.$tips(res)
      })
    },
    updateTree(data) {
      this.activeMenu = String(data.id)

      if (data.parentId) {
        this.treeAdd(this.noteList, data)
      } else {
        this.noteList.push(data)
      }
      if (data.menuType === 'file') {
        // 跳转笔记内容链接
        this.$router.push({ name: 'note',
          query: { id: data.id, aid: data.articleId, name: data.name }
        })
        this.reSetMenu()
      }
    },
    updateTreeDel() {
      this.treeDel(this.noteList, this.tag.id)
      if (this.tag.id === this.$route.query.id) {
        this.activeMenu = null
        this.$message({ message: '当前文章已删除', type: 'warning', offset: 100 })
      }
    },
    treeDel(arr, delId) {
      arr.forEach((element, index) => {
        if (element.id === delId) {
          arr.splice(index, 1)
        } else {
          if (element.children) {
            this.treeDel(element.children, delId)
          }
        }
      })
    },
    treeAdd(arr, data) {
      arr.forEach(element => {
        if (element.id === data.parentId) {
          if (element.children) {
            element.children.push(data)
          } else {
            const arr = []
            arr.push(data)
            this.$set(element, 'children', arr)
          }
        } else {
          if (element.children) {
            this.treeAdd(element.children, data)
          }
        }
      })
    },
    goRouter() {
      if (event.target.className !== 'el-menu') {
        this.parent(event.target)
        const tag = JSON.parse(this.sidebarTag.dataset.file)
        if (tag.menuType !== 'folder') {
          this.activeMenu = String(tag.id)
          this.$router.push({ name: 'note',
            query: { id: tag.id, aid: tag.aid, name: tag.name }
          })
        }
      }
    },
    reSetMenu() {
      this.activeMenu = null
      const timer = setTimeout(() => {
        if (this.$route.query.id) this.activeMenu = String(this.$route.query.id)
        clearTimeout(timer)
      }, 1)
    },
    openMenu(event) {
      if (event.target.className === 'el-menu') {
        this.tagsFileView = true
        this.tag = null
        this.showMenu(event)
      } else {
        this.parent(event.target)
        this.tag = JSON.parse(this.sidebarTag.dataset.file)
        this.tagsFileView = this.tag.menuType !== 'file'
        this.sidebarTag.className += ' sidebarTagSubmenu'
        this.showMenu(event)
      }
    },
    closeMenu() {
      if (this.sidebarTag) {
        // removeClass sidebarTagSubmenu
        const content = document.querySelectorAll('.el-menu .sidebarTagSubmenu')
        if (content) {
          [].forEach.call(content, child => {
            child.className = child.className.replace('sidebarTagSubmenu', '')
          })
        }
      }
      this.visible = false
    },
    showMenu() {
      this.visible = true
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = event.clientX - offsetLeft + 15 // 15: margin right
      if (event.clientY > window.innerHeight - 189) {
        this.top = 'auto'
        this.bottom = (window.innerHeight - event.clientY - 20) + 'px'
      } else {
        this.top = event.clientY - 80 + 'px'
        this.bottom = 'auto'
      }
    },
    parent(target) {
      if (!target.dataset.file) {
        target = target.parentNode
        this.parent(target)
      } else {
        this.sidebarTag = target
      }
    },
    importDir() {
      document.querySelector('#webkitdirectory').click()
    },
    uploadBatch(e) {
      const formData = new FormData()
      const data = e.target.files
      if (data) {
        [].forEach.call(data, item => {
          const suffix = item.name.slice(item.name.lastIndexOf('.') + 1)
          if (!['md', 'doc', 'docx'].includes(suffix)) return
          formData.append('file', item)
        })
      }
      const screenLoading = this.$screenLoading('上传中，请勿关闭页面')
      uploadNoteDir(formData, this.tag ? this.tag.id : 0).then(res => {
        screenLoading.close()
        this.$tips(res)
        document.querySelector('#webkitdirectory').value = null
        this.init()
      })
    },
    async download() {
      const response = await download(this.tag ? this.tag.id : 0)
      this.downloadFile(response)
    },
    downloadFile(response) {
      if (!response) return
      const fileName = response.headers['content-disposition'].split(';')[1].split('filename=')[1]
      const data = response.data
      const objectURL = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = objectURL
      link.setAttribute('download', decodeURIComponent(fileName))
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(objectURL)
    },
    updateMenu() {
      if (!this.tag) return
      if (this.sidebarTag) this.sidebarTag.className += ' sidebarTagSubmenu'
      const head = '新名称'
      this.$prompt('请输入' + head, {
        inputPattern: /\S/,
        inputValue: this.tag.name,
        inputErrorMessage: head + '不能为空',
        confirmButtonText: '修改',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        updateMenu(this.tag.id, value).then(res => {
          if (!res) return
          this.treeUpdateName(this.noteList, this.tag.id, value)
          this.$tips(res)
          this.closeMenu()
        })
      }).catch(() => { this.closeMenu() })
    },
    treeUpdateName(arr, updateId, name) {
      arr.forEach((element, index) => {
        if (element.id === updateId) {
          element.name = name
        } else {
          if (element.children) {
            this.treeUpdateName(element.children, updateId, name)
          }
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.contextmenu {
  width: 150px;
  margin: 0;
  padding: 0;
  background: #fff;
  z-index: 10000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 0px 1px 16px 0 rgba(90, 109, 122, 0.41);
  li {
    width: 100%;
    margin: 0;
    padding: 12px 16px;
    cursor: pointer;
    text-align: center;
    border-bottom: 1px solid #f2f6fc;
    &:hover {
      background: #eee;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" >
@import '@/styles/variables.scss';
.el-icon-fileiconsjs {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}
.sidebar-note {
  width:230px;
  height: 100%;
  position: relative;
  .el-scrollbar {
    height: 93%;
    .scrollbar-wrapper {
      background-color: white;
      overflow-x: hidden !important;
    }
    .el-scrollbar__view {
      height: 100%;
      .el-menu {
        height: 100%;
        border-right: 0;
        .el-menu-item, .el-submenu__title {
          background-color: white;
        }
      }
    }
  }

  // menu hover
  .submenu-title-noDropdown,
  .el-submenu__title {
    &:hover {
      color: white;
      background-color: $menuHover !important;
    }
  }
  .sidebarTagSubmenu {
    color: white;
    background-color: $menuHover !important;
  }
  .is-active>.el-submenu__title {
    color: #66b1ff !important;
  }

  & .nest-menu .el-submenu>.el-submenu__title,
  & .el-submenu .el-menu-item {
    &:hover {
      color: white;
      background-color: $subMenuHover !important;
    }
  }

}
.hidden-sidebar-note{
  width: 54px !important;
  text-align: center;
  .filter-container {
    width: 54px;
  }
  .submenu-title-noDropdown {
    padding: 0 !important;
    position: relative;

  .el-tooltip {
    padding: 0 !important;

    .svg-icon {
      margin-left: 20px;
    }
    }
  }
  .el-menu {
    width: 54px !important;
   }
  .el-submenu {
    overflow: hidden;

    &>.el-submenu__title {
      padding: 0 !important;
      span {
        height: 0;
        width: 0;
      }
      .svg-icon {
        margin-left: 20px;
      }

      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }

  .el-menu--collapse {
    .el-submenu {
      &>.el-submenu__title {
        span {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
      }
    }
  }
}
</style>
