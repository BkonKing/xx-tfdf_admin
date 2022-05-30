<template>
  <page-header-wrapper>
    <a-card title="基础信息">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="文件简称"
          prop="slug"
          :wrapper-col="{ span: 8 }"
        >
          <a-input v-model="formData.slug" :maxLength="30" disabled></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="文件标题"
          :wrapper-col="{ span: 8 }"
          required
          prop="title"
        >
          <a-input
            v-model="formData.title"
            placeholder="不超过30字"
            :maxLength="30"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item required prop="content" label="文件内容">
          <wang-editor
            v-model="formData.content"
            @change="$refs.form.validateField('content')"
          ></wang-editor>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <footer-toolbar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="$router.go(-1)" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-toolbar>
  </page-header-wrapper>
</template>

<script>
import { FooterToolbar } from '@/components'
import wangEditor from '@/components/Editor/WangEditor'
import { appMixin } from '@/store/mixin'
import { validAForm } from '@/utils/util'
import { addAgreement, updateAgreement, getAgreementInfo } from '@/api/basic'
export default {
  mixins: [appMixin],
  components: {
    FooterToolbar,
    wangEditor
  },
  data () {
    return {
      id: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      formData: {
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入文件标题' }],
        content: [{ required: true, message: '请输入文件内容' }]
      },
      loading: false
    }
  },
  created () {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.getAgreementInfo()
    }
  },
  methods: {
    async getAgreementInfo () {
      const { records } = await getAgreementInfo({
        id: this.id
      })
      this.formData = records
    },
    validate () {
      validAForm(this.$refs.form).then(async () => {
        this.loading = true
        const api = this.id ? updateAgreement : addAgreement
        const { code } = await api(this.formData).catch(() => {
          this.loading = false
        })
        this.loading = false
        if (code === 200) {
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
