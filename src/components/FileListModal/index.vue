<template>
  <a-modal
    :title="title"
    :visible="previvewVisible"
    :footer="null"
    @cancel="previvewVisible = false"
  >
    <div class="ant-upload-list ant-upload-list-picture">
      <div
        v-for="(file, index) in data"
        :key="index"
        class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture"
      >
        <div class="ant-upload-list-item-info">
          <span>
            <a
              class="ant-upload-list-item-thumbnail"
              @click="openHref(file.url)"
            >
              <img
                v-if="isImg(file.name)"
                :src="file.url"
                :alt="file.name"
                class="ant-upload-list-item-image"/>
              <a-icon
                v-else
                class="anticon anticon-file ant-upload-list-item-icon"
                type="file"/></a
            ><a
              :title="file.name"
              @click="openHref(file.url)"
              class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
              >{{ file.name }}</a
            >
            <span class="ant-upload-list-item-card-actions picture">
              <a :href="file.url" :download="file.name"
                ><a-icon type="download"></a-icon
              ></a>
            </span>
          </span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'FileListModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      previvewVisible: this.value
    }
  },
  watch: {
    value (val) {
      this.previvewVisible = val
    },
    previvewVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    openHref (url) {
      if (url.indexOf('.doc') > 0 || url.indexOf('.docx') > 0) {
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${url}`,
          '_target'
        )
        return
      }
      window.open(url, '_target')
    },
    // 是否是图片
    isImg (val) {
      var reg = /(.png)|(.jpg)/g
      return reg.test(val)
    }
  }
}
</script>

<style></style>
