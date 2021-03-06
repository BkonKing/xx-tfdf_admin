import PropTypes from 'ant-design-vue/es/_util/vue-types'
import Option from './TagSelectOption.jsx'
import { filterEmpty } from '@/components/_util/util'
import './index.less'

export default {
  Option,
  name: 'TagSelect',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select'
    },
    defaultValue: {
      type: PropTypes.array,
      default: null
    },
    value: {
      type: PropTypes.array,
      default: null
    },
    expandable: {
      type: Boolean,
      default: false
    },
    hideCheckAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: false,
      localCheckAll: false,
      items: this.getItemsKey(filterEmpty(this.$slots.default)),
      val: this.value || this.defaultValue || [],
      checkedList: []
    }
  },
  methods: {
    onChange (checked) {
      const key = Object.keys(this.items).filter(key => key === checked.value)
      this.items[key] = checked.checked
      const bool = Object.values(this.items).lastIndexOf(false)
      if (bool === -1) {
        this.localCheckAll = true
      } else {
        this.localCheckAll = false
      }
    },
    onCheckAll (checked) {
      Object.keys(this.items).forEach(v => {
        this.items[v] = checked.checked
      })
      this.localCheckAll = checked.checked
    },
    getItemsKey (items) {
      const totalItem = {}
      items.forEach(item => {
        totalItem[item.componentOptions.propsData && item.componentOptions.propsData.value] = false
      })
      return totalItem
    },
    getCheckedTag () {
      return Object.keys(this.items).filter(key => this.items[key])
    },
    // CheckAll Button
    renderCheckAll () {
      const props = {
        on: {
          change: (checked) => {
            this.onCheckAll(checked)
            checked.value = 'total'
            this.$emit('change', this.getCheckedTag())
          }
        }
      }
      const checkAllElement = <Option key={'total'} checked={this.localCheckAll} {...props}>??????</Option>
      return !this.hideCheckAll && checkAllElement || null
    },
    // expandable
    renderExpandable () {

    },
    // render option
    renderTags (items) {
      const listeners = {
        change: (checked) => {
          this.onChange(checked)
          this.$emit('change', this.getCheckedTag())
        }
      }

      return items.map(vnode => {
        const options = vnode.componentOptions
        options.listeners = listeners
        return vnode
      })
    }
  },
  render () {
    const { $props: { prefixCls } } = this
    const classString = {
      [`${prefixCls}`]: true,
      'tag-select-container': true
    }
    const tagItems = filterEmpty(this.$slots.default)
    return (
      <div class={classString}>
        {this.renderCheckAll()}
        {this.renderTags(tagItems)}
      </div>
    )
  }
}
