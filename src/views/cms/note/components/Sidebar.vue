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

    <ul v-if="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-show="tagsFileView" @click="addNoteMenu('folder')">{{ tagsView.addFolder }}</li>
      <li v-show="tagsFileView" @click="addNoteMenu('file')">{{ tagsView.addFile }}</li>
      <li @click="delNoteMenu">{{ tagsView.delete }}</li>
      <li>{{ tagsView.download }}</li>
    </ul>

  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { treeList } from '@/api/note'

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
      tagsView: {
        addFolder: '新建文件夹',
        addFile: '新建文件',
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
      if (id) this.activeMenu = id
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
      this.sidebarTag.className += ' sidebarTagSubmenu'
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
        console.log(this.noteMenu)
        this.closeMenu()
      }).catch(() => { this.closeMenu() })
    },
    delNoteMenu() {},
    goRouter() {
      if (event.target.className !== 'el-menu') {
        this.parent(event.target)
        const tag = JSON.parse(this.sidebarTag.dataset.file)
        if (tag.menuType !== 'folder') {
          this.activeMenu = String(tag.id)
          this.$router.push({ path: '/cms/note',
            query: { id: tag.id }
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
        if (this.tag.menuType === 'file') this.tagsFileView = false
        this.sidebarTag.className += ' sidebarTagSubmenu'
        this.showMenu(event)
      }
    },
    closeMenu() {
      if (this.sidebarTag) {
        this.sidebarTag.className = this.sidebarTag.className.replace('sidebarTagSubmenu', '')
      }
      this.visible = false
    },
    showMenu() {
      this.visible = true
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = event.clientX - offsetLeft + 15 // 15: margin right
      this.top = event.clientY - 80
    },
    parent(target) {
      if (!target.dataset.file) {
        target = target.parentNode
        this.parent(target)
      } else {
        this.sidebarTag = target
      }
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
