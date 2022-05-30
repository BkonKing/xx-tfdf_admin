<template>
  <page-header-wrapper>
    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="8" :sm="8">
          <div class="text">在售</div>
          <div class="heading">{{ zsCount }}</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">售罄</div>
          <div class="heading">{{ sqCount }}</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">楼盘</div>
          <div class="heading">{{ allCount }}</div>
        </a-col>
      </a-row>
    </template>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="楼盘状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="1">在售</a-select-option>
                  <a-select-option value="2">售罄</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="楼盘名称">
                <a-input
                  v-model="queryParam.searchText"
                  placeholder="请输入"
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
          @click="addHouse"
        >
          新增楼盘
        </a-button>
        <a-dropdown
          v-if="
            permissions.BatchSellOut ||
              permissions.BatchSell ||
              permissions.BatchRemove
          "
        >
          <a-menu slot="overlay">
            <a-menu-item
              v-if="permissions.BatchSellOut"
              key="1"
              @click="batchOperate('batchSellOut')"
            >
              售罄
            </a-menu-item>
            <a-menu-item
              v-if="permissions.BatchSell"
              key="3"
              @click="batchOperate('batchSell')"
            >
              在售
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
        <template slot="status" slot-scope="text">
          <span :class="[text === '在售' ? 'blue-tag' : 'red-tag']"></span
          >{{ text }}
        </template>
        <template slot="listOrder" slot-scope="text, record">
          <template v-if="permissions.ListOrder">
          <a-input
            v-model="record.listOrder"
            :maxLength="5"
            style="min-width: 96px;"
            @blur="updateProjectOrder(record)"
          /></template>
          <template v-else>{{record.listOrder}}</template>
        </template>

        <template slot="action" slot-scope="text, record">
          <span class="table-action">
            <a @click="goDetail(record)">查看</a>
            <a v-if="permissions.UpdatePermission" @click="goEdit(record)"
              >编辑</a
            >
            <a v-if="record.status === '在售' && permissions.RemovePermission"
              ><a-popconfirm
                title="确定要改成售罄吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="sellOut(record.id)"
              >
                <a-icon
                  slot="icon"
                  type="exclamation-circle"
                  theme="filled"
                  style="color: #faad14"
                />
                <a>售罄</a>
              </a-popconfirm></a
            >
            <a v-if="record.status === '售罄' && permissions.RemovePermission"
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, AdvancedForm } from '@/components'
import {
  getList,
  removeProject,
  sellOutProject,
  sellBatchProject,
  sellOutBatchProject,
  removeBatchProject,
  updateProjectOrder
} from '@/api/houses'

export default {
  name: 'stockIndex',
  components: {
    STable,
    AdvancedForm
  },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '楼盘名称',
          dataIndex: 'projectName',
          width: '15%',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 86
        },
        {
          title: '户型',
          dataIndex: 'hxNum',
          sorter: true,
          width: '84px'
        },
        {
          title: '预约数',
          dataIndex: 'subscribes',
          sorter: true,
          width: '96px'
        },
        {
          title: '预约人数',
          dataIndex: 'subscribePeoples',
          sorter: true,
          width: '110px'
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: () => {
            return (
              <div>
                排序
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>值越大排序越前</span>
                  </template>
                  <a-icon type="info-circle" style="margin-left: 5px;" />
                </a-tooltip>
              </div>
            )
          },
          dataIndex: 'listOrder',
          width: '100px',
          sorter: true,
          scopedSlots: { customRender: 'listOrder' }
        },
        {
          title: '操作',
          width: 140,
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      currentNums: 0,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getList(requestParameters).then(res => {
          this.zsCount = res.zsCount
          this.sqCount = res.sqCount
          this.allCount = res.allCount
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      zsCount: 0,
      sqCount: 0,
      allCount: 0
    }
  },
  computed: {
    rowSelection () {
      // if (!this.permissions.AuditPermission) {
      //   return null
      // }
      return {
        selectedRowKeys: this.selectedRowKeys,
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
    addHouse () {
      this.$router.push({
        name: 'housesEdit'
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
    // 批量售罄
    batchSellOut (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return record.status === '售罄'
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '楼盘售罄',
        content: `确定将${value.length}个楼盘改为售罄吗？`,
        fn: () => {
          sellOutBatchProject(value.map(obj => ({ id: obj.id }))).then(() => {
            this.$message.success('修改成功')
            this.refreshTable()
            this.selectedRowKeys = []
            this.selectedRows = []
          })
        }
      })
    },
    // 售罄
    sellOut (id, isMult = false) {
      sellOutProject({
        id
      }).then(() => {
        this.$message.success('修改成功')
        this.refreshTable()
        if (isMult) {
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          this.cancelSelect([id])
        }
      })
    },
    // 批量在售
    batchSell (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return record.status === '在售'
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '楼盘在售',
        content: `确定将${value.length}个楼盘改为在售吗？`,
        fn: () => {
          this.handleSell(
            value.map(obj => ({ id: obj.id })),
            true
          )
        }
      })
    },
    handleSell (id, isMult = false) {
      sellBatchProject(id).then(() => {
        this.$message.success('修改成功')
        this.refreshTable()
        if (isMult) {
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          this.cancelSelect([id])
        }
      })
    },
    // 删除操作
    batchDelete (value = this.selectedRows) {
      if (value.length >= 1) {
        const status = value.some(record => {
          return record.status === '在售'
        })
        if (status) {
          this.$message.warning('已选择的项中包含不可操作')
          return
        }
      }
      this.confirm({
        title: '删除楼盘',
        content: `确定删除${value.length}个楼盘吗？`,
        fn: () => {
          removeBatchProject(value.map(obj => ({ id: obj.id }))).then(() => {
            this.$message.success('删除成功')
            this.refreshTable()
            this.selectedRowKeys = []
            this.selectedRows = []
          })
        }
      })
    },
    handleRemove (id, isMult = false) {
      removeProject({
        id
      }).then(() => {
        this.$message.success('删除成功')
        this.refreshTable()
        if (isMult) {
          this.selectedRowKeys = []
          this.selectedRows = []
        } else {
          this.cancelSelect([id])
        }
      })
    },
    updateProjectOrder ({ id, listOrder }) {
      updateProjectOrder({
        id,
        listOrder
      }).then(({ code }) => {
        if (code === 200) {
          this.$message.success('修改成功')
          this.refreshTable()
        }
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
    goEdit ({ id }) {
      this.$router.push({
        name: 'housesEdit',
        query: {
          id
        }
      })
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
    },
    // 取消选择
    cancelSelect (data) {
      console.log(data, this.selectedRowKeys)
      this.selectedRowKeys = this.selectedRowKeys.filter(
        id => !data.includes(id)
      )
      this.selectedRows = this.selectedRows.filter(
        obj => data.findIndex(id => obj.id === id) === -1
      )
      console.log(this.selectedRows)
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
  .text {
    color: #00000072;
  }
  .heading {
    font-size: 20px;
    color: #000000d8;
  }
}
.blue-tag {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: #40a9ff;
}
.red-tag {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: #f5222d;
}
</style>
