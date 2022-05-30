<template>
  <a-dropdown
    v-if="currentUser && currentUser.name"
    placement="bottomRight"
    :trigger="['click']"
  >
    <span class="ant-pro-account-avatar">
      <a-avatar
        size="small"
        :src="currentUser.avatar || 'https://ytdwz.tosolomo.com/library/img/user-avatar.png'"
        class="antd-pro-global-header-index-avatar"
      />
      <span>{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          个人中心
        </a-menu-item> -->
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          个人设置
        </a-menu-item>
        <!-- <a-menu-divider v-if="menu" /> -->
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { logout } from '@/api/user'
export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },

  mounted () {
    let beginTime = 0 // 开始时间
    let differTime = 0 // 时间差
    window.onunload = function () {
      differTime = new Date().getTime() - beginTime
      if (differTime <= 5) {
        if (!window.localStorage.getItem('autoLogin')) {
          console.log('这是关闭')
          localStorage.removeItem('access_token')
          this.$store.commit('setLogout', true)
          // 退出登录跳到首页
          this.$router.push({ name: 'login' })
        }
      }/*  else {
        console.log('这是刷新')
      } */
    }
    window.onbeforeunload = function () {
      beginTime = new Date().getTime()
    }
  },
  methods: {
    handleToSettings () {
      this.$route.path !== '/account/base' && (this.$router.push({ path: '/account/base' }))
    },
    handleLogout (e) {
      Modal.confirm({
        title: '提示',
        content: '是否退出登录？',
        onOk: () => {
          logout().then(() => {
            localStorage.removeItem('access_token')
            this.$store.commit('setLogout', true)
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
