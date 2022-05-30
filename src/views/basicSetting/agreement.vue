<template>
  <page-header-wrapper>
    <a-card style="margin-top: 24px" :bordered="false">
      <!-- <div class="table-operator">
        <a-button v-if="permissions.CreatePermission === 1" type="primary" @click="goEdit">
          新增
        </a-button>
      </div> -->

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="false"
      >
        <template slot="action" slot-scope="text, record">
          <span class="table-action">
            <a
              v-if="permissions.UpdatePermission"
              @click="goEdit(record)"
              >编辑</a
            >
          </span>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { getAgreementList } from '@/api/basic'

export default {
  name: 'stockIndex',
  components: {
    STable
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          customRender: (data, row, index) => {
            return index + 1
          }
        },
        {
          title: '文件简称',
          dataIndex: 'slug'
        },
        {
          title: '文件标题',
          dataIndex: 'title'
        },
        {
          title: '更新时间',
          dataIndex: 'utime'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAgreementList(parameter)
      }
    }
  },
  methods: {
    goEdit ({ id }) {
      this.$router.push({
        name: 'basicSettingAgreementEdit',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
