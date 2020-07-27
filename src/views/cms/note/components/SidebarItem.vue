<template>
  <div>
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)">
      <el-menu-item :index="String(onlyOneChild.id)" :class="{'submenu-title-noDropdown':!isNest}" :data-file="fileObj(onlyOneChild)">
        <item :icon="onlyOneChild" :title="onlyOneChild.name" />
      </el-menu-item>
    </template>

    <el-submenu v-else ref="subMenu" :data-file="fileObj(item)" :index="String(item.id)" popper-append-to-body>
      <template slot="title">
        <div :data-file="fileObj(item)">
          <item :icon="item" :title="item.name" />
        </div>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.id"
        :is-nest="true"
        :item="child"
        :data-file="fileObj(child)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children, parent) {
      if (!children) children = []
      const showingChildren = children.filter(item => {
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return false
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, noShowingChildren: true }
        return true
      }

      return false
    },
    fileObj(item) {
      return JSON.stringify({
        id: item.id,
        menuType: item.menuType,
        name: item.name,
        aid: item.articleId ? item.articleId : 0
      })
    }
  }
}
</script>
