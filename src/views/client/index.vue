<template>
  <page-header-wrapper>
    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="8" :sm="8">
          <div class="text">债权人</div>
          <div class="heading">{{ zqrCount }}</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">其他</div>
          <div class="heading">{{ qtCount }}</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">客户</div>
          <div class="heading">{{ allCount }}</div>
        </a-col>
      </a-row>
    </template>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="客户类型">
                <a-select
                  v-model="queryParam.utype"
                  :options="clientType"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户">
                <a-input
                  v-model="queryParam.searchText"
                  placeholder="姓名/联系电话/ID"
                ></a-input>
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
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
          v-if="permissions.CreatePermission"
          type="primary"
          @click="addUser"
        >
          新增客户
        </a-button>
        <a-dropdown
          v-if="
            permissions.BatchUpdateType ||
              permissions.BatchUpdateRemark ||
              permissions.BatchRemove
          "
        >
          <a-menu slot="overlay">
            <a-menu-item
              v-if="permissions.BatchUpdateType"
              key="1"
              @click="batchOperate('batchEditType')"
            >
              修改客户类型
            </a-menu-item>
            <a-menu-item
              v-if="permissions.BatchUpdateRemark"
              key="3"
              @click="batchOperate('batchRemark')"
            >
              备注
            </a-menu-item>
            <a-menu-item
              v-if="permissions.BatchRemove"
              key="2"
              @click="batchOperate('batchDelete')"
            >
              删除
            </a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button v-if="permissions.Import" @click="handleImport">
          导入客户
        </a-button>
        <a-button v-if="permissions.export" @click="exportReport">
          导出客户
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
        <template slot="action" slot-scope="text, record, index">
          <span class="table-action">
            <a @click="goDetail(record)">查看</a>
            <a v-if="permissions.UpdatePermission" @click="openEdit(record)"
              >编辑</a
            >
            <a v-if="!record.loginTime || permissions.RemovePermission"
              ><a-popconfirm
                title="确定要删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleRemove(record.id)"
              >
                <a-icon
                  slot="icon"
                  type="close-circle"
                  theme="filled"
                  style="color: red"
                />
                <a>删除</a>
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
      v-model="addVisible"
      title="新增客户"
      :width="1000"
      :destroyOnClose="true"
      @ok="batchSubmit"
    >
      <div class="edit-table">
        <a-row class="edit-table-header" type="flex">
          <a-col flex="1">客户类型</a-col>
          <a-col flex="1">客户姓名</a-col>
          <a-col class="form-required-before" flex="1">联系电话</a-col>
          <a-col flex="1">备注</a-col>
          <a-col flex="50px">操作</a-col>
        </a-row>
        <a-form-model
          v-for="(record, index) in tableData"
          :key="index"
          :ref="`tableForm${index}`"
          :model="record"
          :rules="tableRules"
          class="edit-table-body"
        >
          <a-row type="flex">
            <a-col flex="1" style="width: 0">
              <a-form-model-item prop="utype">
                <a-select v-model="record.utype" :options="clientType">
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="realname">
                <a-input
                  v-model="record.realname"
                  placeholder="请输入"
                  :maxLength="10"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="mobile" required>
                <a-input
                  v-model="record.mobile"
                  placeholder="请输入"
                  :maxLength="11"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="remarks">
                <a-input
                  v-model="record.remarks"
                  placeholder="请输入"
                  :maxLength="500"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="50px">
              <a class="td-block" @click="remove(index)">删除</a>
            </a-col>
          </a-row>
        </a-form-model>
        <a-button
          style="margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          block
          @click="handleAdd"
          >添加</a-button
        >
      </div>
    </a-modal>
    <a-modal
      v-model="editRemarkVisible"
      :title="`批量修改备注（${selectedRowKeys.length}）`"
      :width="600"
      :destroyOnClose="true"
      @ok="saveRemark"
    >
      <a-form-model
        ref="remarkForm"
        :model="remarkForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
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
            v-model="remarkForm.remarks"
            :maxLength="500"
            style="width: 100%;"
          /> </a-form-model-item
      ></a-form-model>
    </a-modal>
    <a-modal
      v-model="editTypeVisible"
      :title="`批量修改客户类型（${selectedRowKeys.length}）`"
      :width="600"
      :destroyOnClose="true"
      @ok="saveType"
    >
      <a-form-model
        ref="typeForm"
        :model="typeForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item
          prop="utype"
          label="客户类型"
          required
          :rules="{ required: true, message: '请选择客户类型' }"
        >
          <a-select
            v-model="typeForm.utype"
            :options="clientType"
            placeholder="请选择"
          >
          </a-select> </a-form-model-item
      ></a-form-model>
    </a-modal>
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
            :maxLength="11"
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
    <import-file
      v-model="importVisible"
      templateUrl="/upload/kf.xlsx"
      name="fileUrl"
      :request="importUser"
      @submit="importSuccess"
    >
    </import-file>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable, AdvancedForm } from '@/components'
import importFile from './components/importFile'
import {
  getList,
  addBatchUser,
  updateUser,
  updateBatchUtype,
  updateBatchRemarks,
  removeUser,
  removeBatchUser,
  importUser,
  exportUser
} from '@/api/client'
import { validAForm } from '@/utils/util'
import cloneDeep from 'lodash.clonedeep'
// import axios from 'axios'

export default {
  name: 'stockIndex',
  components: {
    STable,
    AdvancedForm,
    importFile
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      queryParam: {},
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
      columns: [
        {
          title: '客户ID',
          dataIndex: 'id'
        },
        {
          title: '客户类型',
          dataIndex: 'utypev'
        },
        {
          title: '客户姓名',
          dataIndex: 'realname'
        },
        {
          title: '联系电话',
          dataIndex: 'mobile'
        },
        {
          title: '预约数',
          dataIndex: 'subscribes',
          sorter: true,
          width: '100px'
        },
        {
          title: '备注',
          dataIndex: 'remarks'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          sorter: true
        },
        {
          title: '操作',
          width: 140,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getList(requestParameters).then(res => {
          this.zqrCount = res.zqrCount
          this.qtCount = res.qtCount
          this.allCount = res.allCount
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      zqrCount: 0,
      qtCount: 0,
      allCount: 0,
      addVisible: false,
      tableData: [
        {
          utype: 1,
          realname: '',
          mobile: '',
          remarks: ''
        }
      ],
      tableRules: {
        mobile: [
          { required: true, message: '请输入联系电话' },
          { len: 11, message: '限11位' }
        ]
      },
      editVisible: false,
      editForm: {},
      editRules: {
        utype: [{ required: true, message: '请选择客户类型' }],
        mobile: [
          { required: true, message: '请输入联系电话' },
          { len: 11, message: '限11位' }
        ]
      },
      editRemarkVisible: false,
      remarkForm: {},
      editTypeVisible: false,
      typeForm: {
        utype: 1
      },
      importVisible: false,
      importUser,
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
        getCheckboxProps: record => ({
          props: {
            disabled: false
          }
        }),
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    reset () {
      this.queryParam = {}
      this.refreshTable(false)
    },
    refreshTable (bool = true) {
      this.$refs.table.refresh(bool)
    },
    addUser () {
      this.tableData = [
        {
          utype: 1,
          realname: '',
          mobile: '',
          remarks: ''
        }
      ]
      this.addVisible = true
    },
    handleAdd () {
      this.tableData.push({
        utype: 1,
        realname: '',
        mobile: '',
        remarks: ''
      })
    },
    remove (index) {
      this.tableData.splice(index, 1)
    },
    batchSubmit () {
      if (!this.tableData?.length) {
        this.$message.warning('请添加户型介绍')
        return
      }
      const PrizeFormValidate = []
      this.tableData.forEach((obj, index) => {
        PrizeFormValidate.push(this.$refs[`tableForm${index}`][0].validate())
      })
      Promise.all([...PrizeFormValidate]).then(async () => {
        const { code } = await addBatchUser(this.tableData)
        if (code === 200) {
          this.$message.success('提交成功')
          this.addVisible = false
          this.refreshTable()
        }
      })
    },
    // 批量操作
    batchOperate (methodName) {
      if (this.selectedRowKeys.length) {
        this[methodName]()
      } else {
        this.$message.warning('请选择后再进行操作')
      }
    },
    batchEditType () {
      this.typeForm = {
        utype: undefined
      }
      this.editTypeVisible = true
    },
    saveType () {
      validAForm(this.$refs.typeForm).then(async () => {
        const params = {
          ids: this.selectedRowKeys.map(id => ({ id })),
          ...this.typeForm
        }
        const { code } = await updateBatchUtype(params)
        if (code === 200) {
          this.$message.success('修改成功')
          this.editTypeVisible = false
          this.onSelectChange([], [])
          this.refreshTable()
        }
      })
    },
    batchRemark () {
      this.remarkForm = {
        remarks: undefined
      }
      this.editRemarkVisible = true
    },
    saveRemark () {
      validAForm(this.$refs.remarkForm).then(async () => {
        const params = {
          ids: this.selectedRowKeys.map(id => ({ id })),
          ...this.remarkForm
        }
        const { code } = await updateBatchRemarks(params)
        if (code === 200) {
          this.$message.success('修改成功')
          this.editRemarkVisible = false
          this.onSelectChange([], [])
          this.refreshTable()
        }
      })
    },
    // 删除操作
    batchDelete (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return record.loginTime
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '删除客户',
        content: `确定删除${value.length}个客户吗？`,
        fn: () => {
          removeBatchUser(this.selectedRowKeys.map(id => ({ id }))).then(
            ({ data }) => {
              this.$message.success('删除成功')
              this.refreshTable()
              this.onSelectChange([], [])
            }
          )
        }
      })
    },
    handleRemove (id) {
      removeUser({
        id
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.refreshTable()
        this.onSelectChange([], [])
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
    openEdit (data) {
      this.editForm = cloneDeep(data)
      this.editVisible = true
    },
    async editUser () {
      const { code } = await updateUser(this.editForm)
      if (code === 200) {
        this.$message.success('修改成功')
        this.refreshTable()
        this.editVisible = false
      }
    },
    // 显示导入弹窗
    handleImport () {
      this.importVisible = true
    },
    importSuccess () {
      this.refreshTable()
    },
    async exportReport () {
      const params = {
        ...this.queryParam,
        ids: this.selectedRowKeys.join(',')
      }
      const res = await exportUser(params)
      console.log(res)
      this.url = res.url
      this.params = JSON.stringify(res.data)
      this.$nextTick(() => {
        document.submit_form.submit()
      })
      // const formData = new FormData()
      // formData.append('data', JSON.stringify(res.data))
      // axios.request({
      //   url: res.url,
      //   method: 'post',
      //   headers: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   data: formData
      // })
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'clientDetail',
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
  width: 300px;
  position: absolute;
  right: 24px;
  top: 12px;
  .text {
    color: #00000072;
  }
  .heading {
    font-size: 20px;
    color: #000000d8;
  }
}
.edit-table {
  &-header {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    > .ant-col {
      padding: 12px 4px 12px 8px;
    }
  }
  &-body {
    > .ant-row-flex {
      border-bottom: 1px solid #e8e8e8;
      > .ant-col {
        padding: 6px 4px 6px 8px;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
