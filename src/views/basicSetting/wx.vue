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
        <a-form-model-item label="小程序楼盘展示" prop="appletLpshow" required>
          <a-checkbox-group
            v-model="formData.appletLpshow"
            :options="options"
          />
        </a-form-model-item>
        <a-form-model-item label="可查看/预约楼盘" prop="appletLpyy" required>
          <a-checkbox-group v-model="formData.appletLpyy" :options="options1" />
        </a-form-model-item>
        <a-form-model-item
          label="微信分享小程序"
          required
          style="margin-bottom: 0;"
        >
          <a-form-model-item
            required
            prop="appletShareTitle"
            style="margin-bottom: 24px;"
          >
            <a-input
              v-model="formData.appletShareTitle"
              placeholder="请输入"
              prefix="标题"
              :maxLength="50"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item required prop="appletShareContent">
            <a-input
              v-model="formData.appletShareContent"
              placeholder="请输入"
              prefix="内容"
              :maxLength="50"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item style="margin-bottom: 0;margin-top: 24px;">
            <a-row type="flex" :gutter="20">
              <a-col flex="220px">
                <a-form-model-item
                  class="upload-image-box"
                  prop="appletShareImg"
                  style="margin-bottom: 0;"
                >
                  <upload-image
                    v-model="formData.appletShareImg"
                    maxLength="1"
                    class="introduction-upload"
                    :noHost="true"
                  ></upload-image>
                </a-form-model-item>
                <div class="upload-image-alert">
                  <div>尺寸500*400；支持：.png .jpg</div>
                </div>
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <footer-toolbar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="getAppletInfo" style="margin-right: 15px;">
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
import { getAppletInfo, saveApplet } from '@/api/basic'
export default {
  mixins: [appMixin],
  components: {
    FooterToolbar,
    UploadImage
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      formData: {
        appletLpshow: [],
        appletLpyy: [],
        appletShareTitle: '',
        appletShareContent: '',
        appletShareImg: []
      },
      rules: {
        appletLpshow: [{ required: true, message: '请选择楼盘展示' }],
        appletLpyy: [{ required: true, message: '请选择可查看/预约楼盘' }],
        appletShareTitle: [{ required: true, message: '请输入微信分享标题' }],
        appletShareContent: [{ required: true, message: '请输入微信分享内容' }]
      },
      options: [
        {
          value: '1',
          label: '在售'
        },
        {
          value: '2',
          label: '售罄'
        }
      ],
      options1: [
        {
          value: '1',
          label: '债权人'
        },
        {
          value: '2',
          label: '其他客户'
        }
      ],
      loading: false
    }
  },
  created () {
    this.getAppletInfo()
  },
  methods: {
    async getAppletInfo () {
      const { records } = await getAppletInfo()
      records.appletShareImg = records.appletShareImg
        ? [records.appletShareImg]
        : []
      records.appletLpshow = records.appletLpshow.split(',')
      records.appletLpyy = records.appletLpyy.split(',')
      this.formData = records
    },
    validate () {
      validAForm(this.$refs.form).then(async () => {
        this.loading = true
        const params = cloneDeep(this.formData)
        params.appletLpshow = params.appletLpshow.join(',')
        params.appletLpyy = params.appletLpyy.join(',')
        params.appletShareImg = params.appletShareImg[0] || ''
        const { code } = await saveApplet(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        if (code === 200) {
          this.$message.success('提交成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.introduction-upload /deep/ .ant-upload-list-picture-card-container,
.introduction-upload /deep/ .ant-upload.ant-upload-select-picture-card,
.introduction-upload
  /deep/
  .ant-upload-list-picture-card
  .ant-upload-list-item {
  width: 220px;
  height: 120px;
  margin-right: 0;
  margin-bottom: 8px;
}
/deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
}
</style>
