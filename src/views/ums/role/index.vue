<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" style="width: 200px" class="filter-item" placeholder="角色名称" clearable />
      <div class="filter-item">
        <el-button @click="handleSearchList()">查询搜索</el-button>
        <el-button @click="handleResetSearch()">重置</el-button>
        <el-button @click="handleAdd()">添加</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        ref="roleTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        height="calc(100vh - 227px)"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="用户数" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.adminCount }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime() }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="mini"
                type="text"
                @click="handleSelectMenu(scope.$index, scope.row)"
              >分配菜单
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleSelectResource(scope.$index, scope.row)"
              >分配资源
              </el-button>
            </el-row>
            <el-row>
              <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :hidden="!total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="handleCurrentChange"
    />
    <el-dialog
      :title="isEdit?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="roleForm"
        :model="role"
        label-width="150px"
        size="small"
      >
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="role.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, createRole, updateRole, updateStatus, deleteRole } from '@/api/role'
import Pagination from '@/components/Pagination'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 20,
  keyword: null
}
const defaultRole = {
  id: null,
  name: null,
  description: null,
  adminCount: 0,
  status: 1
}
export default {
  name: 'RoleList',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: 0,
      listLoading: false,
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      isEdit: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val.limit
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val.page
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.role = Object.assign({}, defaultRole)
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { status: row.status }).then(response => {
          if (!response) return
          this.$tips(response)
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        ids.push(row.id)
        const params = new URLSearchParams()
        params.append('ids', ids)
        deleteRole(params).then(response => {
          if (!response) return
          this.$tips(response)
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.role = Object.assign({}, row)
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateRole(this.role.id, this.role).then(response => {
            if (!response) return
            this.$tips(response)
            this.dialogVisible = false
            this.getList()
          })
        } else {
          createRole(this.role).then(response => {
            if (!response) return
            this.$tips(response)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleSelectMenu(index, row) {
      this.$router.push({ path: '/ums/allocMenu', query: { roleId: row.id }})
    },
    handleSelectResource(index, row) {
      this.$router.push({ path: '/ums/allocResource', query: { roleId: row.id }})
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total || 0
      })
    }
  }
}
</script>
<style></style>

