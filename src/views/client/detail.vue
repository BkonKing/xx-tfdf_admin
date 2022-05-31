<template>
  <page-header-wrapper :title="title">
    <template v-slot:extra>
      <a-button v-if="RemovePermission && !userInfo.loginTime" @click="handleRemove">删除</a-button>
      <a-button v-if="UpdatePermission" type="primary" @click="openEdit">编辑</a-button>
    </template>
    <a-card title="基础信息" :bordered="false">
      <a-row type="flex">
        <a-col flex="1">
          <a-descriptions size="small" :column="2">
            <a-descriptions-item label="客户姓名">
              {{ userInfo.realname }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ userInfo.mobile }}
            </a-descriptions-item>
            <a-descriptions-item label="客户类型">
              {{ userInfo.utypev }}
            </a-descriptions-item>
            <a-descriptions-item label="来源">
              {{ userInfo.fromType }}
            </a-descriptions-item>
            <a-descriptions-item label="最近登录">
              {{ userInfo.loginTime || "--" }}
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              {{ userInfo.ctime }}
            </a-descriptions-item>
            <a-descriptions-item label="备注" :span="2">
              {{ userInfo.remarks }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col flex="100px">
          <img :src="userInfo.avatar" style="width: 100px;height: 100px;" />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="预约记录" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="预约状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="1">已预约</a-select-option>
                  <a-select-option value="3">已结束</a-select-option>
                  <a-select-option value="4">已过期</a-select-option>
                  <a-select-option value="2">已取消</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="楼盘">
                <a-select
                  v-model="queryParam.projectId"
                  show-search
                  :filter-option="filterProject"
                  placeholder="编码、名称"
                  ><a-select-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.projectName }}</a-select-option
                  ></a-select
                >
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="联系人">
                <a-input
                  v-model="queryParam.searchLxr"
                  placeholder="姓名/联系电话"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="预约时间">
                <a-range-picker
                  v-model="queryParam.YYTime"
                  valueFormat="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  v-model="queryParam.time"
                  valueFormat="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
            <advanced-form
              :showAdvanced="false"
              @search="refreshTable"
              @reset="reset"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
      >
      </s-table>
    </a-card>
    <a-modal
      v-model="editVisible"
      title="编辑客户"
      :width="600"
      :destroyOnClose="true"
      @ok="editUser"
    >
      <a-form-model
        :model="editForm"
        :rules="editRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item prop="utype" label="客户类型" required>
          <a-select v-model="editForm.utype" :options="clientType"> </a-select>
        </a-form-model-item>
        <a-form-model-item prop="realname" label="客户姓名">
          <a-input v-model="editForm.realname" :maxLength="10"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="mobile" label="联系电话" required>
          <a-input
            v-model="editForm.mobile"
            :maxLength="15"
            placeholder="请输入"
            v-number-input
          />
        </a-form-model-item>
        <a-form-model-item prop="remarks">
          <template #label>
            备注<a-tooltip placement="top" style="margin-top: 10px;">
              <template slot="title">
                <span>仅后台可见</span>
              </template>
              <a-icon type="info-circle" style="margin-left: 5px;" />
            </a-tooltip>
          </template>
          <a-textarea
            v-model="editForm.remarks"
            :maxLength="500"
            style="width: 100%;"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import moment from 'moment'
import { STable, AdvancedForm } from '@/components'
import { getUserInfo, updateUser, removeUser } from '@/api/client'
import { getIntentionList } from '@/api/common'
import { getAllProject } from '@/api/appointment'
import { getAllots } from '@/api/user'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'stockIndex',
  components: {
    STable,
    AdvancedForm
  },
  data () {
    return {
      id: '',
      userInfo: {},
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      defaultEndTime: moment('23:59:59', 'HH:mm:ss'),
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '预约编号',
          dataIndex: 'id',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'statusv',
          width: 80
        },
        {
          title: '预约时间',
          dataIndex: 'yytime',
          width: 110,
          sorter: true
        },
        {
          title: '预约联系',
          dataIndex: 'realname',
          width: 120,
          customRender: (text, row) => {
            return (
              <div>
                <div>{text}</div>
                <div>{row.mobile}</div>
              </div>
            )
          }
        },
        {
          title: '意向信息',
          dataIndex: 'project',
          customRender: (text, row) => {
            return (
              <div>
                <div>{text}</div>
                <div>{row.house}</div>
              </div>
            )
          }
        },
        {
          title: '其他说明',
          dataIndex: 'explain'
        },
        {
          title: () => {
            return (
              <div>
                备注
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>仅后台可见</span>
                  </template>
                  <a-icon type="info-circle" style="margin-left: 5px;" />
                </a-tooltip>
              </div>
            )
          },
          dataIndex: 'remarks'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          width: 110,
          sorter: true
        }
      ],
      clientType: [
        {
          value: 1,
          label: '债权人'
        },
        {
          value: 2,
          label: '其他'
        }
      ],
      projectOptions: [],
      loadData: parameter => {
        const params = cloneDeep(this.queryParam)
        if (params.YYTime?.length) {
          params.yyStartDate = params.YYTime[0]
          params.yyEndDate = params.YYTime[1]
        }
        if (params.time?.length) {
          params.startDate = params.time[0]
          params.endDate = params.time[1]
        }
        const requestParameters = Object.assign({}, parameter, params, {
          userId: this.id
        })
        return getIntentionList(requestParameters)
      },
      editVisible: false,
      editForm: {},
      editRules: {
        utype: [{ required: true, message: '请选择客户类型' }],
        mobile: [{ required: true, message: '请输入联系电话' }]
      },
      UpdatePermission: 0,
      RemovePermission: 0
    }
  },
  computed: {
    title () {
      return `${this.userInfo.mobile} ${this.userInfo.realname}(${this.userInfo.utypev})`
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getUserInfo()
    this.getAllProject()
    this.getAllots()
  },
  methods: {
    async getUserInfo () {
      const { records } = await getUserInfo({
        id: this.id
      })
      this.userInfo = records || {}
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/client/index'
      }).then(({ records: data }) => {
        this.UpdatePermission = data.UpdatePermission
        this.RemovePermission = data.RemovePermission
      })
    },
    async getAllProject () {
      const { records } = await getAllProject()
      this.projectOptions = records || []
    },
    handleRemove () {
      removeUser({
        id: this.id
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.$router.go(-1)
      })
    },
    openEdit () {
      this.editForm = cloneDeep(this.userInfo)
      this.editVisible = true
    },
    async editUser () {
      const { code } = await updateUser(this.editForm)
      if (code === 200) {
        this.$message.success('修改成功')
        this.getUserInfo()
        this.editVisible = false
      }
    },
    filterProject (input, option) {
      const value = input.toLowerCase()
      const text = option.componentOptions.children[0].text.toLowerCase()
      return text.indexOf(value) >= 0 || option.key == value
    },
    reset () {
      this.queryParam = {}
      this.refreshTable(false)
    },
    refreshTable (bool = true) {
      this.$refs.table.refresh(bool)
    }
  }
}
</script>

<style lang="less" scoped></style>
