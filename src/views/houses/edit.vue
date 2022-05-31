<template>
  <page-header-wrapper>
    <a-card title="基础信息" :bordered="false">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="楼盘名称" required prop="projectName">
          <a-input
            v-model="formData.projectName"
            :maxLength="30"
            placeholder="不超过30字"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼盘地址" required>
          <a-form-model-item prop="areas" required>
            <a-cascader
              v-model="formData.areas"
              :options="areaOptions"
              placeholder="请选择地址"
              @change="handleAreaChange"
            />
          </a-form-model-item>
          <a-form-model-item prop="address" required>
            <a-textarea
              v-model="formData.address"
              placeholder="请输入"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              style="width: 100%;margin-top: 10px;"
            />
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item label="房间面积" required>
          <a-row type="flex">
            <a-col flex="1">
              <a-form-model-item prop="roomMinArea">
                <a-input
                  v-model="formData.roomMinArea"
                  v-number-input
                  addon-after="㎡"
                  placeholder="请输入"
                  @change="$refs.form.validateField('roomMaxArea')"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="10px">~</a-col>
            <a-col flex="1">
              <a-form-model-item prop="roomMaxArea">
                <a-input
                  v-model="formData.roomMaxArea"
                  v-number-input
                  addon-after="㎡"
                  placeholder="请输入"
                  @change="$refs.form.validateField('roomMinArea')"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="参考均价" required prop="averagePrice">
          <a-input
            v-model="formData.averagePrice"
            addon-after="元/㎡"
            placeholder="请输入"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼盘相册" required prop="images">
          <div>
            <upload-image
              v-model="formData.images"
              maxLength="10"
              @input="$refs.form.validateField('images')"
            ></upload-image>
            <div>楼盘主图</div>
          </div>
          <!-- <upload-image v-model="formData.images" maxLength="10"></upload-image> -->
          <div>最多10张；尺寸建议N*N；支持扩展名：.png .jpg；</div>
        </a-form-model-item>
        <a-form-model-item label="咨询电话" required>
          <a-row type="flex">
            <a-col flex="1">
              <a-form-model-item prop="mobile" required>
                <a-input
                  v-model="formData.mobile"
                  v-number-input
                  :maxLength="15"
                  placeholder="联系电话"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="20px"> -- </a-col>
            <a-col flex="1">
              <a-form-model-item prop="contacts">
                <a-input
                  v-model="formData.contacts"
                  :maxLength="10"
                  placeholder="姓名"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="楼盘状态" prop="status">
          <a-radio-group v-model="formData.status">
            <a-radio :value="1">
              在售
            </a-radio>
            <a-radio :value="2">
              售罄
            </a-radio>
          </a-radio-group>
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
            v-model="formData.remarks"
            placeholder="请输入"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="listOrder">
          <template #label>
            备注<a-tooltip placement="top">
              <template slot="title">
                <span>值越大排序越前</span>
              </template>
              <a-icon type="info-circle" style="margin-left: 5px;" />
            </a-tooltip>
          </template>
          <a-input
            v-model="formData.listOrder"
            v-number-input
            :maxLength="10"
            placeholder="请输入"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="户型介绍" :bordered="false" style="margin-top: 24px;">
      <div class="edit-table">
        <a-row class="edit-table-header" type="flex">
          <a-col class="form-required-before" flex="1">房间数</a-col>
          <a-col class="form-required-before" flex="1">户型名称</a-col>
          <a-col class="form-required-before" flex="1">面积(㎡)</a-col>
          <a-col class="form-required-before" flex="1">均价(万起)</a-col>
          <a-col class="form-required-before" flex="1">户型图</a-col>
          <a-col flex="1">备注</a-col>
          <a-col flex="1">排序</a-col>
          <a-col flex="50px">展示</a-col>
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
              <a-form-model-item prop="rooms" required>
                <a-select v-model="record.rooms" :options="houseOptions">
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col flex="1" style="width: 0">
              <a-form-model-item prop="houseName" required>
                <a-input v-model="record.houseName"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="1" style="width: 0">
              <a-form-model-item prop="houseArea" required>
                <a-input v-model="record.houseArea" v-number-input></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="1" style="width: 0">
              <a-form-model-item prop="averagePrice" required>
                <a-input v-model="record.averagePrice" v-number-input>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="images" required>
                <upload-image
                  v-model="record.images"
                  maxLength="1"
                ></upload-image>
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="remarks">
                <a-input
                  v-model="record.remarks"
                  placeholder="请输入"
                  :maxLength="100"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="listOrder">
                <a-input
                  v-model="record.listOrder"
                  placeholder="请输入"
                  :maxLength="100"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="50px">
              <a-form-model-item prop="status">
                <a-switch v-model="record.status" />
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
          >新增</a-button
        >
      </div>
    </a-card>
    <a-card title="楼盘详情" :bordered="false" style="margin-top: 24px;">
      <a-form-model ref="form1" :model="formData">
        <a-form-model-item
          label="详情内容"
          required
          prop="content"
          :rules="{ required: true, message: '请输入详情内容' }"
        >
          <a-row type="flex">
            <a-col flex="375px" style="margin-right: 20px">
              <mobile-preview :data="formData"></mobile-preview>
            </a-col>
            <a-col flex="1">
              <wang-editor
                v-model="formData.content"
                @change="$refs.form.validateField('content')"
              ></wang-editor>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <footer-toolbar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="$router.go(-1)" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" :loading="loading" @click="validate"
        >提交</a-button
      >
    </footer-toolbar>
  </page-header-wrapper>
</template>

<script>
import chinaArea from '@/utils/chinaArea'
import { validAForm } from '@/utils/util'
import { appMixin } from '@/store/mixin'
import { UploadImage, FooterToolbar } from '@/components'
import MobilePreview from './components/MobilePreview.vue'
import wangEditor from '@/components/Editor/WangEditor'
import { addProject, updateProject, getProjectInfo } from '@/api/houses'
import cloneDeep from 'lodash.clonedeep'
export default {
  components: {
    UploadImage,
    wangEditor,
    FooterToolbar,
    MobilePreview
  },
  mixins: [appMixin],
  data () {
    const validHouseName = (rule, value, callback) => {
      let status = false
      let num = 0
      this.tableData.forEach(obj => {
        if (obj.houseName === value) {
          num++
        }
      })
      status = num > 1
      if (status) {
        callback(new Error('名称重复'))
      } else {
        callback()
      }
    }
    const validMinArea = (rule, value, callback) => {
      if (value || this.formData.roomMaxArea) {
        callback()
      } else {
        callback(new Error('请输入房间面积'))
      }
    }
    const validMaxArea = (rule, value, callback) => {
      if (value || this.formData.roomMinArea) {
        callback()
      } else {
        callback(new Error('请输入房间面积'))
      }
    }
    return {
      id: '',
      areaOptions: chinaArea,
      formData: {
        projectName: undefined,
        areas: [],
        address: undefined,
        roomMinArea: undefined,
        roomMaxArea: undefined,
        averagePrice: undefined,
        images: [],
        mobile: undefined,
        contacts: undefined,
        status: 1,
        remarks: undefined,
        listOrder: undefined,
        province: '',
        city: '',
        area: ''
      },
      rules: {
        projectName: [{ required: true, message: '请输入楼盘名称' }],
        areas: [{ required: true, message: '请选择地址' }],
        address: [{ required: true, message: '请输入详细地址' }],
        roomMinArea: [{ validator: validMinArea }],
        roomMaxArea: [{ validator: validMaxArea }],
        averagePrice: [{ required: true, message: '请输入参考均价' }],
        images: [{ required: true, message: '请选择楼盘相册' }],
        mobile: [{ required: true, message: '请输入咨询电话' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      houseOptions: [
        {
          label: '一室',
          value: 1
        },
        {
          label: '二室',
          value: 2
        },
        {
          label: '三室',
          value: 3
        },
        {
          label: '四室',
          value: 4
        },
        {
          label: '五室',
          value: 5
        },
        {
          label: '六室',
          value: 6
        }
      ],
      tableData: [],
      tableRules: {
        rooms: [{ required: true, message: '请选择房间数' }],
        houseName: [
          { required: true, message: '请输入户型名称' },
          { validator: validHouseName }
        ],
        houseArea: [{ required: true, message: '请输入面积' }],
        averagePrice: [{ required: true, message: '请输入均价' }],
        images: [{ required: true, message: '请上传户型图' }]
      },
      loading: false
    }
  },
  created () {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.getProjectInfo()
    }
  },
  methods: {
    getProjectInfo () {
      getProjectInfo({
        id: this.id
      }).then(({ records }) => {
        const { house, ...formData } = records
        const tableData = Object.keys(house)
          .map(key => {
            const array = house[key].data.map(obj => {
              obj.status = !!+obj.status
              obj.images = [obj.images]
              return obj
            })
            return array
          })
          .flat()
        formData.images = formData.images.map(obj => obj.url)
        formData.areas = [
          formData.provinceId + '',
          formData.cityId + '',
          formData.areaId + ''
        ]
        this.tableData = tableData
        this.formData = formData
      })
    },
    handleAdd () {
      this.tableData.push({
        rooms: undefined,
        houseName: undefined,
        houseArea: undefined,
        averagePrice: undefined,
        images: [],
        remarks: undefined,
        listOrder: undefined,
        status: true
      })
    },
    remove (index) {
      this.tableData.splice(index, 1)
    },
    handleAreaChange (value, selectedOptions) {
      this.formData.province = selectedOptions[0].label
      this.formData.city = selectedOptions[1].label
      this.formData.area = selectedOptions[2].label
    },
    validate () {
      const PrizeFormValidate = []
      this.tableData.forEach((obj, index) => {
        PrizeFormValidate.push(this.$refs[`tableForm${index}`][0].validate())
      })
      Promise.all([
        ...PrizeFormValidate,
        validAForm(this.$refs.form),
        validAForm(this.$refs.form1)
      ]).then(async () => {
        const params = cloneDeep(this.formData)
        params.images = params.images.map(obj => ({ url: obj, name: '' }))
        let house = cloneDeep(this.tableData)
        house = house.map(obj => {
          !obj.id && (obj.id = 0)
          obj.images = obj.images[0]
          obj.remarks = obj.remarks || ''
          obj.listOrder = obj.listOrder || ''
          obj.status = obj.status ? 1 : 0
          return obj
        })
        params.remarks = params.remarks || ''
        params.contacts = params.contacts || ''
        params.listOrder = params.listOrder || ''
        params.roomMinArea = params.roomMinArea || ''
        params.roomMaxArea = params.roomMaxArea || ''
        params.provinceId = params.areas[0]
        params.cityId = params.areas[1]
        params.areaId = params.areas[2]
        const api = this.id ? updateProject : addProject
        const { code } = await api({
          ...params,
          house: house
        })
        if (code === 200) {
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
