<template>
  <div class="preview-image-list">
    <template v-if="images && images.length">
      <div
        class="image-box"
        v-for="(item, index) in images"
        :key="index"
        @click="previeImage(item)"
      >
        <img
          :src="item"
          :style="{ width: `${width}px`, height: `${width}px` }"
        />
      </div>
    </template>
    <div v-else>无</div>
  </div>
</template>

<script>
export default {
  name: 'TImage',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 104
    }
  },
  methods: {
    previeImage (src) {
      this.$viewerApi({
        options: {
          initialViewIndex: this.images.findIndex(obj => obj === src)
        },
        images: this.images
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-image-list {
  // display: flex;
}
.image-box {
  display: inline-block;
  margin: 0 5px 5px;
}
</style>
