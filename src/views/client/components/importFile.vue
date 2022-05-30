<template>
  <div class="importFile">
    <a-modal
      v-model="isShow"
      title="导入文件"
      @ok="submit"
      :destroyOnClose="true"
    >
      <div class="form">
        <div class="leftForm textFile">
          <span style="color:red">*</span> <span>选择文件：</span>
        </div>
        <div class="rightForm">
          <upload-file
            v-model="fileUrl"
            maxLength="1"
            accept=".xls,.xlsx"
          ></upload-file>
        </div>
      </div>

      <div style="margin-top: 20px;margin-left: 80px;">
        <a :href="templateUrl" target="_blank"
          ><a-icon type="vertical-align-bottom" />下载模板</a
        >
      </div>
    </a-modal>
    <a-modal
      v-model="isShow2"
      class="modal"
      :width="350"
      :closable="false"
      :footer="null"
    >
      <div class="content">
        <div class="left">
          <a-icon
            v-if="isSuccess"
            type="check-circle"
            theme="filled"
            style="color: #52c41a;"
          />
          <a-icon
            v-else-if="isFail202"
            type="close-circle"
            theme="filled"
            style="color: #f5222d"
          />
          <a-icon
            v-else
            type="info-circle"
            theme="filled"
            style="color: #faad14"
          />
        </div>
        <div v-if="isSuccess" class="right">
          <div class="t1">导入成功</div>
          <div class="t2">
            {{ uploadFileInfo.msg }}
          </div>
        </div>
        <div class="right" v-else-if="isFail202">
          <div class="t1">部分导入失败</div>
          <div class="t2">
            {{ uploadFileInfo.msg }}
          </div>
        </div>
        <div class="right" v-else>
          <div class="t1">无法导入</div>
          <div class="t2" style="color: #f5222d">
            请检查文档
          </div>
        </div>
      </div>
      <div class="btn2">
        <a-button type="primary" @click="handleClose">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { UploadFile } from '@/components'
export default {
  name: 'importFile',
  components: {
    UploadFile
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    templateUrl: {
      type: String
    },
    request: {
      type: Function
    },
    // 发到后台的文件参数名
    name: {
      type: String
    },
    data: {
      type: [Object]
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      isShow: this.value,
      isShow2: false,
      fileUrl: [],
      uploadFileInfo: {},
      isFail202: false
    }
  },
  computed: {
    isSuccess () {
      return this.uploadFileInfo.code === 200
    }
  },
  watch: {
    isShow (newVal) {
      this.$emit('input', newVal)
      if (newVal === false) {
        this.fileUrl = []
      }
    },
    value (val) {
      this.isShow = val
    }
  },
  methods: {
    // 确定
    async submit () {
      if (!this.fileUrl?.length) {
        this.$message.error('请选择文件')
        return
      }

      const res = await this.request({
        [this.name]: this.fileUrl[0].url
      })
      this.uploadFileInfo = res

      if (res.code === 201) {
        this.isFail202 = false
      } else if (res.code === 202) {
        this.isFail202 = true
        this.isShow = false
        this.$emit('submit')
      } else if (res.code === 200) {
        this.isFail202 = false
        this.isShow = false
        this.$emit('submit')
      }
      this.isShow2 = true
    },
    handleClose () {
      this.isShow2 = false
    }
  }
}
</script>

<style lang="less" scoped>
.textFile {
  white-space: nowrap;
}
.form {
  display: flex;
  .leftForm {
    width: 80px;
    padding-top: 5px;
  }
  .rightForm {
    flex: 1;
    .fileUpload {
      width: 354px;
      height: 32px;
      border: 1px solid rgba(216, 216, 216, 1);
      display: flex;
      align-items: center;
      .left {
        padding-left: 15px;
        flex: 1;
        color: #ccc;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .right {
        display: flex;
        align-items: center;
        text-align: right;
        span {
          color: #0000006e;
        }
        .icon {
          margin: 0 5px;
          font-size: 20px;
          color: #0000006e;
        }
      }
    }
  }
}
.btn {
  margin-top: 20px;
  margin-left: 80px;
}
.content {
  display: flex;
  .left {
    display: flex;
    align-items: flex-start;
    margin-right: 16px;
    font-size: 20px;
  }
  .right {
    flex: 1;
    .t1 {
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .t2 {
      margin-top: 10px;
    }
  }
}
.btn2 {
  margin-top: 20px;
  text-align: right;
}
/deep/ .ant-modal-footer {
  padding: 10px 24px;
}
</style>
