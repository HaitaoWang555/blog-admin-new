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
      <el-form-item label-width="0" style="text-align: center">
        <el-button
          v-if="poetry.moudle === 'add'"
          :loading="loading"
          type="primary"
          @click="submitForm('poetry')"
        >提交</el-button>
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
import { create, update } from '@/api/poetry'

export default {
  name: 'Meta',
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
          { required: true, message: '请输入诗词名称', trigger: 'blur' }
        ],
        dynasty: [
          { required: true, message: '请输入朝代', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          { max: 10, message: '长度不能超10个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入诗词内容', trigger: 'blur' }
        ]
      },
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
    }
  }
}
</script>
