import cloneDeep from 'lodash.clonedeep'
import {
  STable
} from '@/components'
import './combined-table.less'

export default {
  components: {
    STable
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    footerData: {
      type: Array,
      default: () => []
    },
    scroll: {
      type: Object,
      default: null
    },
    data: {
      type: Function,
      required: true
    },
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    rowClassName: {
      type: Function
    }
  },
  watch: {
    footerData (val) {
      if (val && val.length) {
        setTimeout(() => {
          var ele = document.getElementsByClassName('ant-table-body')[1]
          var table = document.getElementsByClassName('ant-table-body')[0]
          ele.addEventListener('scroll', function (e) {
            table.scrollLeft = ele.scrollLeft || 0
          })
        }, 10)
      }
    }
  },
  methods: {
    refresh (bool = false) {
      this.$refs.table.refresh(bool)
    },
    clearSelected () {
      this.$refs.table.clearSelected()
    }
  },
  render () {
    const {
      columns,
      footerData,
      data,
      alert,
      rowSelection,
      rowClassName,
      scroll
    } = this.$props
    const footerColumns = cloneDeep(this.$props.columns).map((obj, index) => {
      index === 0 && scroll && (obj.class = 'first-td')
      obj.fixed && delete obj.fixed
      obj.sorter && delete obj.sorter
      // 如果有removeCustom，则删除customRender
      obj.removeFooterCustom && delete obj.customRender
      return obj
    })

    const props = {}
    if (scroll) {
      props.scroll = scroll
    }

    const table = footerData && footerData.length ? <template slot="footer"><a-table
      class="table-footer"
      size="default"
      rowKey="id"
      tableLayout="fixed"
      columns={footerColumns}
      dataSource={footerData}
      pagination={false}
      rowSelection={rowSelection ? {} : null}
      showHeader={false}
      {...{ props }}
    >
    </a-table></template> : ''
    return (<s-table
      ref="table"
      size="default"
      rowKey="id"
      tableLayout="fixed"
      class="combined-table"
      {...{ props, scopedSlots: { ...this.$scopedSlots } }}
      data={data}
      alert={alert}
      rowSelection={rowSelection}
      columns={columns}
      rowClassName={rowClassName}
    >
      {table}
    </s-table>)
  }
}
