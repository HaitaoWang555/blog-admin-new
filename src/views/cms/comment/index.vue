<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="搜索用户名"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="listQuery.username = null"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="listQuery.articleId"
        placeholder="文章ID"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="listQuery.articleId = null"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="listQuery.ip"
        placeholder="可搜索ip地址"
        prefix-icon="el-icon-search"
        clearable
        style="width: 200px"
        class="filter-item"
        @clear="listQuery.ip = null"
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
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" align="center" fixed />

      <el-table-column width="250px" label="用户名">
        <template slot-scope="scope">
          <span v-if="!scope.row.link">
            {{ scope.row.username }}
          </span>
          <a v-else :href="scope.row.link" target="_blank">
            <span>
              {{ scope.row.username }}
            </span>
          </a>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="文章ID">
        <template slot-scope="scope">
          <span>
            {{ scope.row.articleId }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="250px" label="ip地址">
        <template slot-scope="scope">
          <span>
            {{ scope.row.ip }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容">
        <template slot-scope="scope">
          <span>
            {{ scope.row.content }}
          </span>
        </template>
      </el-table-column>

      <el-table-column width="250px" sortable label="评论时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.createTime | parseTime() }}
          </span>
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
  </div>
</template>

<script>
import { searchList, del } from '@/api/comment'
import Pagination from '@/components/Pagination'

export default {
  name: 'CommentList',
  components: {
    Pagination
  },
  data() {
    return {
      buttonArray: [
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await searchList(this.listQuery)
      if (!res) {
        this.listLoading = false
        return
      }
      const data = res.data
      const list = data.list
      this.list = list
      this.total = data.total

      this.listLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    btnEvent(val) {
      switch (val) {
        case 'del':
          (async() => {
            const ids = this.multipleSelection.map(i => i.id).join(',')
            const aids = this.multipleSelection.map(i => i.articleId).join(',')
            if (!ids) return
            const res = await del(ids, aids)
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
    sortChange(column) { // 排序方法
      if (!column.column) return
      const columnName = column.column.label
      const dir = {
        '评论时间': 'create_time'
      }
      const columnVal = dir[columnName]
      const order = column.order.includes('desc') ? 'desc' : 'asc'
      const sortBy = columnVal + ' ' + order
      this.listQuery.sortBy = sortBy
      this.getList()
    }
  }
}
</script>
