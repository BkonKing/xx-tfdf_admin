<template>
  <div>
    <a-card title="基础信息" :bordered="false">
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="楼盘名称">{{
          data.projectName
        }}</a-descriptions-item>
        <a-descriptions-item label="参考均价"
          >{{ data.averagePrice }}元/㎡</a-descriptions-item
        >
        <a-descriptions-item label="房间面积"
          >{{ data.roomMinArea }} -
          {{ data.roomMaxArea }}㎡</a-descriptions-item
        >
        <a-descriptions-item label="咨询电话"
          >{{ data.mobile }} {{ data.contacts }}</a-descriptions-item
        >
        <a-descriptions-item label="最近更新"
          >{{ data.uptime }} {{ data.uadmin }}</a-descriptions-item
        >
        <a-descriptions-item label="创建时间"
          >{{ data.ctime }} {{ data.cadmin }}</a-descriptions-item
        >
        <a-descriptions-item label="楼盘相册" :span="3">
          <img
            v-for="(item, index) in data.images"
            :key="index"
            :src="item.url"
            class="house-img"
            @click="previewImage(images, index)"
        /></a-descriptions-item>
        <a-descriptions-item label="楼盘地址" :span="3"
          >{{ data.province }} {{ data.city }} {{ data.area }}
          {{ data.address }}</a-descriptions-item
        >
        <a-descriptions-item label="备注" :span="3">{{
          data.remarks || "--"
        }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card v-if="haveHouse" title="户型介绍" :bordered="false" style="margin-top: 24px;">
      <div v-for="(item, index) in data.house" :key="index" class="house-box">
        <h3>{{ item.title }}</h3>
        <div style="display: flex;flex-wrap: wrap;">
          <div
            v-for="(house, index) in item.data"
            :key="index"
            class="house-item"
            style="margin-right: 20px;"
          >
            <img
              :src="house.images"
              @click="previewImage([house.images])"
              class="img-1"
            />
            <div
              class="house-tag"
              :class="{ 'house-tag-un': house.status === 0 }"
            >
              {{ house.statusv }}
            </div>
            <div>{{ house.houseName }}</div>
            <div>
              {{ house.houseArea }}㎡
              {{ house.averagePrice }}万元起
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card title="楼盘详情" :bordered="false" style="margin-top: 24px;">
      <a-row type="flex">
        <a-col flex="375px" style="margin-right: 20px">
          <mobile-preview :data="data"></mobile-preview></a-col>
        <a-col flex="1">
          <div v-html="data.content"></div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import MobilePreview from './MobilePreview.vue'
export default {
  components: {
    MobilePreview
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    images () {
      return this.data.images.map(obj => obj.url)
    },
    haveHouse () {
      return !Array.isArray(this.data.house)
    }
  },
  methods: {
    previewImage (images, index = 0) {
      this.$viewerApi({
        options: {
          initialViewIndex: index
        },
        images: images
      })
    }
  }
}
</script>

<style lang="less" scoped>
h3 {
  font-size: 15px;
  font-weight: bold;
}
.house-box + .house-box {
  margin-top: 10px;
}
.house-item {
  position: relative;
  .house-tag {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1px 8px;
    color: #fff;
    font-size: 12px;
    background: #1890ff;
  }
  .house-tag-un {
    background: #ccc;
  }
}
.house-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 1px solid #eee;
  + .house-img {
    margin-left: 10px;
  }
}
.img-1 {
  width: 160px;
  height: 110px;
  object-fit: contain;
  border: 1px solid #eee;
}
/deep/ .ant-descriptions-item > span {
  vertical-align: top;
}
</style>
