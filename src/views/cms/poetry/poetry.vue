<template>
  <div class="poetry">
    <el-form
      ref="poetry"
      :model="poetry"
      :rules="formRules"
      label-position="right"
      label-width="100px"
      class="formWrap"
      style="max-width: 420px; margin: 0 auto"
    >

      <template v-if="poetry.moudle !== 'import'">

        <el-form-item label="诗词名称" prop="title">
          <el-input v-model="poetry.title" />
        </el-form-item>
        <el-form-item label="朝代" prop="dynasty">
          <el-input v-model="poetry.dynasty" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="poetry.author" />
        </el-form-item>
        <el-form-item label="诗词内容" prop="content">
          <el-input v-model="poetry.content" type="textarea" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label-width="0" prop="excel" class="upload-container">
          <el-input v-model="poetry.excel" type="hidden" />
          <el-upload
            ref="upload"
            drag
            :on-change="handleChange"
            :auto-upload="false"
            action="xx"
            :http-request="handleUpload"
            :file-list="fileList"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">文件不能超过25M 仅支持csv文件</div>
          </el-upload>
        </el-form-item>
      </template>
      <el-form-item label-width="0" style="text-align: center">
        <el-button
          v-if="poetry.moudle === 'add'"
          :loading="loading"
          type="primary"
          @click="submitForm('poetry')"
        >提交</el-button>
        <el-button
          v-if="poetry.moudle === 'import'"
          :loading="loading"
          type="primary"
          @click="submitForm('poetry')"
        >确认导入</el-button>
        <el-button
          v-if="poetry.moudle === 'edit'"
          :loading="loading"
          type="primary"
          @click="submitForm('poetry')"
        >确认修改</el-button>
        <el-button @click="resetForm('poetry')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create, update, importPoetry } from '@/api/poetry'

export default {
  name: 'PoetryDialog',
  props: {
    poetry: {
      type: Object,
      default: () => {
        return {}
      }
    },
    close: {
      type: Function,
      default: null
    },
    change: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formRules: {
        title: [
          { required: true, message: '请输入诗词名称', trigger: 'blur' },
          { max: 50, message: '长度不能超50个字符', trigger: 'blur' }
        ],
        dynasty: [
          { required: true, message: '请输入朝代', trigger: 'blur' },
          { max: 10, message: '长度不能超10个字符', trigger: 'blur' }

        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          { max: 10, message: '长度不能超10个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入诗词内容', trigger: 'blur' }
        ]
      },
      fileList: [],
      loading: false
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          switch (this.poetry.moudle) {
            case 'add':
              this.add(this.poetry)
              break
            case 'edit':
              this.edit(this.poetry)
              break
            case 'import':
              this.import()
              break
            default:
              break
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async add(form) {
      const res = await create(form)
      if (!res) {
        this.loading = false
        return
      }
      this.$tips(res)
      this.loading = false
      this.close()
      this.change()
    },
    async edit(form) {
      delete form.updatedTime
      const res = await update(form)
      if (!res) {
        this.loading = false
        return
      }
      this.$tips(res)
      this.loading = false
      this.close()
      this.change()
    },
    import() {
      const formData = new FormData()
      if (this.fileList.length === 0) {
        this.$message({ message: '请选择文件', type: 'warning' })
        this.loading = false
        return
      }
      for (let index = 0; index < this.fileList.length; index++) {
        const element = this.fileList[index]
        formData.append('file', element.raw)
      }
      importPoetry(formData).then(res => {
        this.loading = false
        this.$tips(res)
        if (!res) return
        this.close()
        this.change()
      })
    },
    handleUpload() {

    },
    handleChange(file, fileList) {
      if (file) {
        if (file.status === 'ready') {
          this.poetry.excel = 'ready'
        } else if (file.status === 'fail') {
          this.loading = false
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      }
      this.fileList = fileList
    }
  }
}
</script>
