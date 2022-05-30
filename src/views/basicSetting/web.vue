<template>
  <div>
    <a-card title="基础信息">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="后台名称" required prop="htTitle">
          <a-input
            v-model="formData.htTitle"
            placeholder="请输入"
            :maxLength="20"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="后台logo" required prop="htLogo">
          <upload-image v-model="formData.htLogo" maxLength="1" :showHttpFile="true"></upload-image>
          <div style="margin-top: -10px;">
            <div>尺寸1:1；支持: .png .jpg</div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <footer-toolbar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="getBackstageInfo" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-toolbar>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { UploadImage, FooterToolbar } from '@/components'
import { appMixin } from '@/store/mixin'
import { validAForm } from '@/utils/util'
import { getBackstageInfo, saveBackstage } from '@/api/basic'
export default {
  mixins: [appMixin],
  components: {
    UploadImage,
    FooterToolbar
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      formData: {
        htTitle: '',
        htLogo: []
      },
      rules: {
        htTitle: [{ required: true, message: '请输入后台名称' }],
        htLogo: [{ required: true, message: '请上传后台logo' }]
      },
      loading: false
    }
  },
  created () {
    this.getBackstageInfo()
  },
  methods: {
    async getBackstageInfo () {
      const { records } = await getBackstageInfo()
      records.htLogo = records.htLogo
        ? [records.htLogo]
        : []
      this.formData = records
    },
    validate () {
      validAForm(this.$refs.form).then(async () => {
        this.loading = true
        const params = cloneDeep(this.formData)
        params.htLogo = params.htLogo[0] || ''
        const { code } = await saveBackstage(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        if (code === 200) {
          this.$message.success('提交成功')
          this.$store.dispatch('GetInfo')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
