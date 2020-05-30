<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="btn-add" @click="handleAddMenu()">添加</el-button>
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        row-key="id"
        style="width: 100%"
        height="calc(100vh - 132px)"
        border
        :data="list"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="前端名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="100" align="center">
          <template slot-scope="scope"><svg-icon :icon-class="scope.row.icon" /></template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hidden"
              :active-value="0"
              :inactive-value="1"
              @change="handleHiddenChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { fetchTreeList, deleteMenu, updateHidden } from '@/api/menu'

export default {
  name: 'MenuList',
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleAddMenu() {
      this.$router.push('/ums/addMenu')
    },
    getList() {
      this.listLoading = true
      fetchTreeList().then(response => {
        this.listLoading = false
        this.list = response.data
      })
    },
    handleHiddenChange(index, row) {
      updateHidden(row.id, { hidden: row.hidden }).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleShowNextLevel(index, row) {
      this.$router.push({ path: '/ums/menu', query: { parentId: row.id }})
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/ums/updateMenu', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
