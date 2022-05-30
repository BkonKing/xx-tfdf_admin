<template>
  <page-header-wrapper :breadcrumb="false">
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar
            size="large"
            :src="
              userInfo.avatar
                ? userInfo.avatar
                : 'https://ytdwz.tosolomo.com/library/img/user-avatar.png'
            "
          />
        </div>
        <div class="content">
          <div class="content-title">
            <span v-if="userInfo">{{ userInfo.realName }}，</span
            >祝你开心每一天！
          </div>
          <div>{{ userInfo.role }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item" @click="toCheck(1)">
          <a-statistic
            title="已预约选房"
            :value="countIntNum > 0 ? countIntNum : '--'"
          />
        </div>
        <div class="stat-item" @click="toCheck(2)">
          <a-statistic
            title="楼盘"
            :value="countProNum > 0 ? countProNum : '--'"
          />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            title="在售的楼盘"
            class="project-list"
            :loading="loading"
            :bordered="false"
            :body-style="{ padding: 0 }"
            style="margin-bottom: 24px;"
          >
            <a slot="extra" @click="toCheck(2)">全部楼盘</a>
            <div v-if="projects && projects.length">
              <a-card-grid
                v-for="(item, i) in projects"
                :key="i"
                class="project-card-grid"
                style="width: 25%;"
              >
                <a-card
                  :bordered="false"
                  :body-style="{ padding: 0 }"
                  style="cursor: pointer;"
                  @click="$router.push('/houses/detail?id=' + item.id)"
                >
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a class="projectName">{{ item.projectName }}</a>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <div class="item">
                      <div class="title">已预约</div>
                      <div class="num">{{ item.yyCount }}<span style="font-size: 14px;">个</span></div>
                    </div>
                    <div class="item">
                      <div class="title">预约人数</div>
                      <div class="num">{{ item.kfCount }}<span style="font-size: 14px;">人</span></div>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
            <a-empty
              v-else
              :image="simpleImage"
              description="暂无楼盘"
            ></a-empty>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            v-if="navigation && navigation.length"
            title="便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a
                v-for="(item, index) in navigation"
                :key="index"
                @click="openTab(item)"
                >{{ item.menuText }}</a
              >
            </div>
          </a-card>
          <a-card
            title="动态"
            :loading="loading"
            :bordered="false"
            style="margin-bottom: 24px;"
          >
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in logs">
                <a-list-item-meta>
                  <a-avatar
                    slot="avatar"
                    :src="
                      item.avatar ||
                        'https://ytdwz.tosolomo.com/library/img/user-avatar.png'
                    "
                  />
                  <div slot="title" style="word-break: break-all;">
                    <strong>{{item.adminName}} </strong>
                    <strong> {{item.operationType}} </strong>
                    <a v-if="item.sourceId" @click="openPage(item)">“{{item.shortContent}}”</a>
                    <span v-else>“{{item.shortContent}}”</span>
                  </div>
                  <div slot="description">{{ item.ctime }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { PageHeaderWrapper } from 'xx-ant-design-vue-pro-layout'
import { toWorkbench } from '@/api/user'
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      projects: [],
      loading: true,
      userInfo: {},
      navigation: {},
      logs: {},
      navigation: [],
      countIntNum: 0,
      countProNum: 0
    }
  },
  beforeCreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  created () {
    toWorkbench().then(
      ({ project, account, countIntNum, countProNum, logs, kjMenu }) => {
        this.projects = project
        this.userInfo = account
        this.logs = logs
        this.navigation = kjMenu
        this.countIntNum = countIntNum
        this.countProNum = countProNum
        this.$nextTick(() => {
          this.loading = false
        })
      }
    )
  },
  methods: {
    toCheck (type) {
      if (type === 1) {
        this.$router.push('/appointment/index')
      } else if (type === 2) {
        this.$router.push('/houses/index')
      }
    },
    // 便捷导航
    openTab ({ limitsPath }) {
      this.$router.push(limitsPath)
    },
    // 动态打开新窗口
    openPage ({ logType, sourceId }) {
      // 40=楼盘管理，50=预约选房，60=客户管理
      const paths = {
        40: '/houses/detail',
        50: '/appointment/index',
        60: '/client/detail'
      }
      const path = `${paths[logType]}?id=${sourceId}`
      if (path !== this.$route.fullPath) {
        const href = this.$router.resolve({
          path
        }).href
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./Workplace.less";

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }
  .projectName {
    font-weight: 700;
    font-style: normal;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.847058823529412);
    line-height: 24px;
  }

  .project-item {
    display: flex;
    margin-top: 20px;
    .item {
      flex: 1;
      .title {
        color: rgba(0, 0, 0, 0.247058823529412);
        font-size: 12px;
      }
      .num {
        font-weight: 700;
        color: rgba(0, 0, 0, 0.647058823529412);
        font-size: 24px;
      }
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}
/deep/ .ant-card-head-title {
  font-family: "PingFang SC Bold", "PingFang SC";
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
  text-align: left;
  line-height: 24px;
}
.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  .item {
    cursor: pointer;
    margin-bottom: 18px;
  }
}
.card3 {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
