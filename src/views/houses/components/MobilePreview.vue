<template>
  <div class="mobile-container">
    <div class="mobile-nav-bar">{{ data.projectName }}</div>
    <div class="mobile-content" v-html="data.content">
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobilePreview',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    jump () {
      this.$router.push({
        name: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mobile-container {
  width: 100%;
  height: 669px;
  border: 1px solid #eee;
  .mobile-nav-bar {
    height: 44px;
    line-height: 44px;
    font-size: 17px;
    text-align: center;
  }
  .mobile-content {
    width: 375px;
    height: calc(100% - 44px);
    padding: 0 10px;
    overflow-y: auto;
  }
  .mobile-image-box {
    display: flex;
    .mobile-image {
      flex: 1;
      width: 0;
      object-fit: cover;
    }
  }
}
</style>
