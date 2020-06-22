<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchValue.title"
        placeholder="可搜索名称"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="searchValue.title = null"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="searchValue.dynasty"
        placeholder="可搜索朝代"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="searchValue.dynasty = null"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="searchValue.author"
        placeholder="可搜索作者"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="searchValue.author = null"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="searchValue.content"
        placeholder="可搜索诗词内容"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="searchValue.content = null"
        @keyup.enter.native="search"
      />

      <div class="filter-item">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button
          v-for="(item, index) in buttonArray"
          :key="index"
          :style="{background: item.color,color: 'white'}"
          @click="btnEvent(item.value)"
        >
          {{ item.label }}
        </el-button>
      </div>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      height="calc(100vh - 227px)"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" align="center" fixed />

      <el-table-column width="250px" label="诗词名称">
        <template slot-scope="scope">
          <span>
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="朝代">
        <template slot-scope="scope">
          <span>
            {{ scope.row.dynasty }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="作者">
        <template slot-scope="scope">
          <span>
            {{ scope.row.author }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="诗词内容">
        <template slot-scope="scope">
          <span>
            {{ scope.row.content }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row, scope.$index)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :visible="dialog" :title="dialogTitle" append-to-body @close="closeDialog">
      <Poetry v-if="dialog" :poetry="poetryData" :close="closeDialog" :change="changeList" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, searchList, delPoetry, downloadList } from '@/api/poetry'
import Pagination from '@/components/Pagination'
import Poetry from './poetry'

export default {
  name: 'PoetryList',
  components: {
    Pagination,
    Poetry
  },
  data() {
    return {
      searchValue: {
        title: null,
        dynasty: null,
        author: null,
        content: null
      },
      buttonArray: [
        {
          label: '新增',
          value: 'add',
          color: '#3399ff'
        },
        {
          label: '批量导入',
          value: 'import',
          color: '#33b66a'
        },
        {
          label: '导出',
          value: 'export',
          color: '#337df6'
        },
        {
          label: '批量删除',
          value: 'del',
          color: '#ff7a7b'
        }
      ],
      multipleSelection: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      dialog: false,
      dialogTitle: '',
      poetryData: {},
      changeIndex: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      let res = null
      let isHaveKeyword = false
      for (const key in this.searchValue) {
        if (this.searchValue.hasOwnProperty(key)) {
          const element = this.searchValue[key]
          if (element) {
            isHaveKeyword = true
            this.listQuery[key] = element
          }
        }
      }
      if (isHaveKeyword) {
        res = await searchList(this.listQuery)
      } else {
        res = await fetchList(this.listQuery)
      }
      if (!res) {
        this.listLoading = false
        return
      }
      const data = res.data
      const list = data.list
      this.list = list
      if (isHaveKeyword) {
        this.total = data.total > 10000 ? 10000 : data.total
      } else {
        this.total = data.total
      }

      this.listLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    btnEvent(val) {
      const defaultMeta = {
        excel: null
      }
      switch (val) {
        case 'add':
          this.dialog = true
          this.dialogTitle = '新增'
          this.poetryData = defaultMeta
          this.poetryData.moudle = 'add'
          break
        case 'import':
          this.dialog = true
          this.dialogTitle = '批量导入'
          this.poetryData = defaultMeta
          this.poetryData.moudle = 'import'
          this.poetryData.excel = null
          break
        case 'export':
          this.export()
          break
        case 'del':
          (async() => {
            const ids = this.multipleSelection.map(i => i.id).join(',')
            if (!ids) return
            const res = await delPoetry(ids)
            if (!res) return
            this.$tips(res)
            this.getList()
          })()
          break
        default:
          break
      }
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    edit(row, index) {
      const editData = row

      this.changeIndex = index
      this.dialog = true
      this.dialogTitle = '修改'
      this.poetryData = editData
      this.poetryData.moudle = 'edit'
    },
    closeDialog() {
      this.dialog = false
    },
    changeList(data) {
      this.getList()
    },
    async export() {
      const ids = this.multipleSelection.map(i => i.id).join(',')

      const response = await downloadList(ids)
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
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 7px;
}
</style>