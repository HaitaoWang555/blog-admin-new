<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nameKeyword" style="width: 200px" class="filter-item" placeholder="资源名称" clearable />
      <el-input v-model="listQuery.urlKeyword" style="width: 200px" class="filter-item" placeholder="资源路径：" clearable />
      <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="filter-item">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="filter-item">
        <el-button @click="handleSearchList()">查询搜索</el-button>
        <el-button @click="handleResetSearch()">重置</el-button>
        <el-button @click="handleAdd()">添加</el-button>
        <el-button @click="handleShowCategory()">查看资源分类</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table
        ref="resourceTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        height="calc(100vh - 227px)"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
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
      :title="isEdit?'编辑资源':'添加资源'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="resourceForm"
        :model="resource"
        label-width="150px"
        size="small"
      >
        <el-form-item label="资源名称：">
          <el-input v-model="resource.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input v-model="resource.url" style="width: 250px" />
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select v-model="resource.categoryId" placeholder="全部" clearable style="width: 250px">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="resource.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
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
import { fetchList, createResource, updateResource, deleteResource } from '@/api/resource'
import { listAllCate } from '@/api/resourceCategory'
import Pagination from '@/components/Pagination'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 20,
  nameKeyword: null,
  urlKeyword: null,
  categoryId: null
}
const defaultResource = {
  id: null,
  name: null,
  url: null,
  categoryId: null,
  description: ''
}
export default {
  name: 'ResourceList',
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
      resource: Object.assign({}, defaultResource),
      isEdit: false,
      categoryOptions: [],
      defaultCategoryId: null
    }
  },
  created() {
    this.getList()
    this.getCateList()
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
      this.resource = Object.assign({}, defaultResource)
      this.resource.categoryId = this.defaultCategoryId
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.resource = Object.assign({}, row)
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateResource(this.resource.id, this.resource).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        } else {
          createResource(this.resource).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleShowCategory() {
      this.$router.push({ path: '/ums/resourceCategory' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total || 0
      })
    },
    getCateList() {
      listAllCate().then(response => {
        const cateList = response.data || []
        if (cateList.length < 1) return
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.categoryOptions.push({ label: cate.name, value: cate.id })
        }
        this.defaultCategoryId = cateList[0].id
      })
    }
  }
}
</script>

