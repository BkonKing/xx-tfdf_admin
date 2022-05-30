<template>
  <page-header-wrapper>
    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="4" :sm="4">
          <div class="text">预约</div>
          <div class="heading">{{ yyCount }}</div>
        </a-col>
        <a-col :xs="4" :sm="4">
          <div class="text">结束</div>
          <div class="heading">{{ jsCount }}</div>
        </a-col>
        <a-col :xs="4" :sm="4">
          <div class="text">过期</div>
          <div class="heading">{{ gqCount }}</div>
        </a-col>
        <a-col :xs="4" :sm="4">
          <div class="text">取消</div>
          <div class="heading">{{ qxCount }}</div>
        </a-col>
        <a-col :xs="4" :sm="4">
          <div class="text">总预约</div>
          <div class="heading">{{ allCount }}</div>
        </a-col>
      </a-row>
    </template>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
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
              <a-form-item label="客户">
                <a-input
                  v-model="queryParam.searchKh"
                  placeholder="姓名/联系电话"
                ></a-input>
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
              :md="24"
              @search="refreshTable"
              @reset="reset"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-dropdown v-if="permissions.BatchUpdate">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchOperate('batchFinish')">
              结束
            </a-menu-item>
            <a-menu-item key="3" @click="batchOperate('batchCancel')">
              取消
            </a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button v-if="permissions.Export" @click="exportReport">
          导出
        </a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
        :alert="{ clear: true }"
        :rowSelection="rowSelection"
      >
        <template slot="action" slot-scope="text, record">
          <span class="table-action">
            <a
              v-if="permissions.UpdatePermission"
              @click="goEdit(record)"
              >编辑</a
            >
            <a v-if="record.status === 1 && permissions.RemovePermission"
              ><a-popconfirm
                title="确定要结束吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleUpdate(record.id, 3)"
              >
                <a-icon
                  slot="icon"
                  type="exclamation-circle"
                  theme="filled"
                  style="color: #faad14"
                />
                <a>结束</a>
              </a-popconfirm></a
            >
            <a v-if="record.status === 1 && permissions.RemovePermission"
              ><a-popconfirm
                title="确定要取消吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleUpdate(record.id, 2)"
              >
                <a-icon
                  slot="icon"
                  type="exclamation-circle"
                  theme="filled"
                  style="color: #faad14"
                />
                <a>取消</a>
              </a-popconfirm></a
            >
          </span>
        </template>
      </s-table>
      <form
        style="display:none"
        name="submit_form"
        id="submit_form"
        :action="url"
        method="post"
      >
        <input name="data" type="text" :value="params" />
      </form>
    </a-card>
    <a-modal
      v-model="editVisible"
      title="编辑预约"
      :width="600"
      :destroyOnClose="true"
      @ok="handleSave"
    >
      <a-form-model
        ref="form"
        :model="formData"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="意向楼盘">{{
          formData.project
        }}({{formData.house}})</a-form-model-item>
        <a-form-model-item label="客户">
          <a :href="`/client/detail?id=${formData.id}`" target="_blank"
            >{{ formData.userRealname }}，{{ formData.userMobile }}</a
          >
        </a-form-model-item>
        <a-form-model-item label="预约联系"
          >{{ formData.realname }}，{{ formData.mobile }}</a-form-model-item
        >
        <a-form-model-item
          label="预约时间"
          prop="yytime"
          required
          :rules="{ required: true, message: '请选择预约时间' }"
        >
          <a-date-picker
            v-model="formData.yytime"
            :show-time="{ defaultValue: defaultTime }"
            placeholder="请选择"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="其他说明">{{
          formData.explain || '--'
        }}</a-form-model-item>
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
            v-model="formData.remarks"
            placeholder="请输入"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            style="max-width: 328px;"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'
import { STable, AdvancedForm } from '@/components'
import {
  getList,
  updateIntention,
  updateIntentionStatus,
  updateBatchStatus,
  getAllProject,
  exportIntention
} from '@/api/appointment'
import { validAForm } from '@/utils/util'
import moment from 'moment'

export default {
  name: 'stockIndex',
  components: {
    STable,
    AdvancedForm
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      defaultEndTime: moment('23:59:59', 'HH:mm:ss'),
      queryParam: {},
      projectOptions: [],
      columns: [
        {
          title: '预约编号',
          dataIndex: 'id',
          width: 70
        },
        {
          title: '状态',
          dataIndex: 'statusv',
          width: 60
        },
        {
          title: '预约时间',
          dataIndex: 'yytime',
          width: 130,
          sorter: true
        },
        {
          title: '客户',
          dataIndex: 'userRealname',
          width: 100,
          customRender: (text, row) => {
            return (
              <a href={`/client/detail?id=${row.id}`} target="__blank">
                <div>{text}</div>
                <div>{row.userMobile}</div>
              </a>
            )
          }
        },
        {
          title: '预约联系',
          dataIndex: 'realname',
          width: 100,
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
          width: 140,
          sorter: true
        },
        {
          title: '操作',
          width: 140,
          scopedSlots: { customRender: 'action' }
        }
      ],
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
        const requestParameters = Object.assign({}, parameter, params)
        return getList(requestParameters).then(res => {
          this.yyCount = res.yyCount
          this.qxCount = res.qxCount
          this.gqCount = res.gqCount
          this.jsCount = res.jsCount
          this.allCount = res.allCount
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      yyCount: 0,
      qxCount: 0,
      gqCount: 0,
      jsCount: 0,
      allCount: 0,
      formData: {
        yytime: '',
        remarks: ''
      },
      editVisible: false,
      url: '',
      params: ''
    }
  },
  computed: {
    rowSelection () {
      // if (!this.permissions.AuditPermission) {
      //   return null
      // }
      return {
        fixed: true,
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    this.getAllProject()
  },
  methods: {
    reset () {
      this.queryParam = {}
      this.refreshTable(false)
    },
    refreshTable (bool = true) {
      this.$refs.table.refresh(bool)
    },
    async exportReport () {
      const params = {
        ...this.queryParam,
        ids: this.selectedRowKeys.join(',')
      }
      const res = await exportIntention(params)
      console.log(res)
      this.url = res.url
      this.params = JSON.stringify(res.data)
      this.$nextTick(() => {
        document.submit_form.submit()
      })
    },
    async getAllProject () {
      const { records } = await getAllProject()
      this.projectOptions = records || []
    },
    // 批量操作
    batchOperate (methodName) {
      if (this.selectedRowKeys.length) {
        this[methodName]()
      } else {
        this.$message.warning('请选择后再进行操作')
      }
    },
    batchFinish (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return +record.status !== 1
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '结束预约',
        content: `确定结束${value.length}个预约吗？`,
        fn: () => {
          this.batchUpdate(3)
        }
      })
    },
    // 结束操作
    batchCancel (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return +record.status !== 1
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '取消预约',
        content: `确定取消${value.length}个预约吗？`,
        fn: () => {
          this.batchUpdate(2)
        }
      })
    },
    batchUpdate (status) {
      // 2=取消，3=结束
      const params = {
        ids: this.selectedRowKeys.map(id => ({ id })),
        status
      }
      updateBatchStatus(params).then(({ code }) => {
        if (code === 200) {
          this.$message.success('批量操作成功')
          this.refreshTable()
          this.onSelectChange([], [])
        }
      })
    },
    handleUpdate (id, status) {
      // 2=取消，3=结束
      updateIntentionStatus({
        id,
        status
      }).then(({ code }) => {
        if (code === 200) {
          this.$message.success('操作成功')
          this.refreshTable()
          this.onSelectChange([], [])
        }
      })
    },
    handleSave () {
      validAForm(this.$refs.form).then(async () => {
        const params = cloneDeep(this.formData)
        const { code } = await updateIntention({
          id: params.id,
          yyTime: params.yytime,
          remarks: params.remarks || ''
        })
        if (code === 200) {
          this.editVisible = false
          this.$message.success('修改成功')
          this.refreshTable()
        }
      })
    },
    filterProject (input, option) {
      const value = input.toLowerCase()
      const text = option.componentOptions.children[0].text.toLowerCase()
      return text.indexOf(value) >= 0 || option.key == value
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
    goEdit (data) {
      this.formData = data
      this.editVisible = true
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'housesDetail',
        query: {
          id
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'stockDetail') {
      this.$destroy()
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.status-list {
  position: absolute;
  top: 12px;
  right: 24px;
  width: 500px;
  .text {
    color: #00000072;
  }
  .heading {
    font-size: 20px;
    color: #000000d8;
  }
}
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding-left: 8px;
  padding-right: 0;
}
/deep/ .ant-table-thead > tr > th:last-child,
/deep/ .ant-table-tbody > tr > td:last-child {
  padding-right: 8px;
}
/deep/ .max-width {
  max-width: 116px;
  width: 52px;
}
</style>
