<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-row type="flex">
        <a-col flex="1">
          <info title="预约" :value="`${allCount}个`" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info
            title="已预约"
            :value="`${yyCount}个`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            title="已结束"
            :value="`${jsCount}个`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            title="已取消"
            :value="`${qxCount}个`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info title="已过期" :value="`${gqCount}个`" />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="预约记录" :bordered="false" style="margin-top: 24px;">
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
  </div>
</template>

<script>
import Info from './Info'
import { getAllProject } from '@/api/appointment'
import { getIntentionList } from '@/api/common'
import { STable, AdvancedForm } from '@/components'
import cloneDeep from 'lodash.clonedeep'
export default {
  components: {
    Info,
    STable,
    AdvancedForm
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      projectOptions: [],
      queryParam: {},
      columns: [
        {
          title: '预约编号',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'statusv',
          width: 80
        },
        {
          title: '预约时间',
          dataIndex: 'yytime',
          width: 100,
          sorter: true
        },
        {
          title: '客户',
          dataIndex: 'userRealname',
          width: '100px',
          customRender: (text, row) => {
            return (
              <a href={`/client/detail?id=${row.id}`} target="_blank">
                <div>{text}</div>
                <div>{row.userMobile}</div>
              </a>
            )
          }
        },
        {
          title: '预约联系',
          dataIndex: 'realname',
          width: '100px',
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
          width: '100px',
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
          dataIndex: 'explain',
          width: '100px'
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
          width: 100,
          sorter: true
        }
      ],
      yyCount: 0,
      qxCount: 0,
      gqCount: 0,
      jsCount: 0,
      allCount: 0,
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
        const requestParameters = Object.assign({}, parameter, params, { projectId: this.id })
        return getIntentionList(requestParameters).then(res => {
          this.yyCount = res.yyCount
          this.qxCount = res.qxCount
          this.gqCount = res.gqCount
          this.jsCount = res.jsCount
          this.allCount = res.allCount
          return res
        })
      }
    }
  },
  created () {
    this.getAllProject()
  },
  methods: {
    async getAllProject () {
      const { records } = await getAllProject()
      this.projectOptions = records || []
    },
    reset () {
      this.queryParam = {}
      this.refreshTable(false)
    },
    refreshTable (bool = true) {
      this.$refs.table.refresh(bool)
    },
    filterProject (input, option) {
      const value = input.toLowerCase()
      const text = option.componentOptions.children[0].text.toLowerCase()
      return text.indexOf(value) >= 0 || option.key == value
    }
  }
}
</script>

<style></style>
