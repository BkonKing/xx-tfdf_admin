<template>
  <page-header-wrapper
    :title="info.projectName"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <!-- actions -->
    <template v-slot:extra>
      <div style="padding-bottom: 10px;text-align: right;">
        <a-button-group>
          <a-button v-if="info.status === 1 && sellOut" @click="handleSellOut"
            >售罄</a-button
          >
          <a-button
            v-if="info.status === 2 && RemovePermission"
            @click="handleRemove"
          >
            删除
          </a-button>
        </a-button-group>
        <a-button
          v-if="UpdatePermission"
          type="primary"
          style="margin-left: 10px;"
          @click="goEdit"
          >编辑</a-button
        >
      </div>
      <div class="status-list">
        <div>
          <div class="text">状态</div>
          <div class="heading">{{ info.statusv }}</div>
        </div>
        <div>
          <div class="text">预约</div>
          <div class="heading">{{ info.subscribes }}个</div>
        </div>
      </div>
    </template>
    <info-tab v-show="tabActiveKey === '0'" :data="info"></info-tab>

    <appointment-tab v-show="tabActiveKey === '1'" :id="id"></appointment-tab>

    <log-tab v-show="tabActiveKey === '2'" :id="id"></log-tab>
  </page-header-wrapper>
</template>

<script>
import InfoTab from './components/InfoTab'
import AppointmentTab from './components/AppointmentTab'
import LogTab from './components/LogTab'
import { getProjectInfo, removeProject, sellOutProject } from '@/api/houses'
import { getAllots } from '@/api/user'

export default {
  name: 'ContractDetail',
  components: {
    InfoTab,
    AppointmentTab,
    LogTab
  },
  data () {
    return {
      id: '',
      UpdatePermission: 0,
      RemovePermission: 0,
      sellOut: 0,
      tabList: [
        { key: '0', tab: '楼盘详情' },
        { key: '1', tab: '预约选房' },
        { key: '2', tab: '操作日志' }
      ],
      tabActiveKey: '0',
      info: {},
      confirmLoading: false
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getProjectInfo()
    this.getAllots()
  },
  methods: {
    // 获取合同详情
    getProjectInfo () {
      getProjectInfo({
        id: this.id
      }).then(({ records }) => {
        this.info = records
      })
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/houses/index'
      }).then(({ records: data }) => {
        this.UpdatePermission = data.UpdatePermission
        this.RemovePermission = data.RemovePermission
        this.sellOut = data.sellOut
      })
    },
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    handleSellOut () {
      this.confirm({
        title: '楼盘售罄',
        content: '确定将这个楼盘改为售罄吗？',
        fn: () => {
          this.requestSellOut()
        }
      })
    },
    requestSellOut () {
      sellOutProject({
        id: this.id
      }).then(() => {
        this.$message.success('修改成功')
        this.getProjectInfo()
      })
    },
    handleRemove () {
      this.confirm({
        title: '删除楼盘',
        content: '确定删除这个楼盘吗？',
        fn: () => {
          this.requestRemove()
        }
      })
    },
    requestRemove () {
      removeProject({
        id: this.id
      }).then(() => {
        this.$message.success('删除成功')
        this.$router.go(-1)
      })
    },
    confirm ({ title, content, fn }) {
      this.$confirm({
        title,
        content,
        icon: () => (
          <a-icon
            type="exclamation-circle"
            style="color: #faad14"
            theme="filled"
          />
        ),
        cancelText: '取消',
        okText: '确定',
        onOk () {
          fn()
        },
        onCancel () {}
      })
    },
    goEdit () {
      this.$router.push({
        name: 'housesEdit',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  // padding-left: 10px;
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  // padding-left: 10px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  // word-break: break-all;
}

/deep/ .ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-content,
/deep/ .ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-extraContent {
  flex: 1 !important;
}
.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

/deep/ .ant-page-header-heading-extra {
  position: absolute;
  top: 12px;
  right: 30px;
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .status-list {
    text-align: left;
  }
}
</style>
