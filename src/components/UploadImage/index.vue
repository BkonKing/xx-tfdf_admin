<template>
  <a-upload
    v-bind="$attrs"
    multiple
    name="imgFile"
    list-type="picture-card"
    :action="`${action}/uploads/uImages`"
    :file-list="fileList"
    :headers="{
      Authorization: token
    }"
    :beforeUpload="beforeUpload"
    @preview="handlePreview"
    @change="handleChange"
  >
    <div v-if="fileList.length < maxLength || isInfinite">
      <a-icon type="plus" />
      <div class="ant-upload-text">
        上传
      </div>
    </div>
  </a-upload>
</template>

<script>
import { getBase64 } from '@/utils/util'
import store from 'store'

export default {
  name: 'UploadImage',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: [Number, String],
      default: 9
    },
    showHttpFile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: this.format(this.value),
      uploadList: [],
      token: '',
      action:
        process.env.NODE_ENV === 'production'
          ? process.env.VUE_APP_API_BASE_URL
          : '/api'
    }
  },
  computed: {
    // 小于1则表示无限
    isInfinite () {
      return +this.maxLength < 1
    }
  },
  created () {
    this.token = store.get('access_token')
  },
  methods: {
    genId (length) {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36)
    },
    format (list) {
      return list.map(item => {
        const index = this.genId(5)
        return {
          uid: index,
          name: index,
          status: 'done',
          response: {
            data: item
          },
          url: item
        }
      })
    },
    async handlePreview (file) {
      // 不是完成状态点击无效
      if (file.status !== 'done') {
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      const url = file.response ? file.response.data : file.url
      this.$viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: this.value.findIndex(obj => url === obj)
        },
        images: this.value
      })
    },
    beforeUpload (file, fileList) {
      if (this.isInfinite) {
        return file
      }
      const index = parseInt(this.maxLength) - this.fileList.length
      if (index > 0) {
        const active = fileList.findIndex(obj => obj.name === file.name) + 1
        if (active <= index) {
          return file
        } else {
          return false
        }
      } else {
        return false
      }
    },
    handleChange ({ file, fileList, event }) {
      const max = parseInt(this.maxLength)
      const index = max - this.fileList.length
      const deleteCount = index < 0 ? Math.abs(index) : 0
      console.log(file)
      // 上传失败
      if (file.status === 'done' && file.response.code != 200) {
        this.$message.error(file.response.msg)
        const errorIndex = this.fileList.findIndex(obj => obj.uid === file.uid)
        this.fileList[errorIndex].status = 'error'
        return
      }
      this.fileList = fileList
      if (deleteCount && !this.isInfinite) {
        this.fileList.splice(this.fileList.length - 1, deleteCount)
      }
      if (file.status === 'done' || file.status === 'removed') {
        const uploadList = fileList
          .map(obj => {
            if (obj.response) {
              return obj.response.data
            }
          })
          .filter(item => {
            return item
          })
        this.uploadList = uploadList
        this.$emit('input', uploadList)
      }
    }
  },
  watch: {
    value (val) {
      if (val !== this.uploadList || this.showHttpFile) {
        this.fileList = this.format(val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list-picture-card .ant-upload-list-item {
  width: 100%;
  height: 100%;
}
/deep/ .ant-upload-list-picture-card {
  .ant-upload-list-item-thumbnail {
    display: flex;
    img {
      height: auto;
      max-height: 100%;
      object-fit: contain;
    }
  }
}
</style>
