<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="12">
        <a-form-model ref="form" :model="form" :rules="rules" layout="vertical">
          <a-form-model-item label="姓名" prop="realName" required>
            <a-input
              v-model="form.realName"
              :maxLength="15"
              placeholder="请输入1~15个字"
            />
          </a-form-model-item>
          <a-form-model-item label="手机号" prop="mobile">
            <a-input
              v-model="form.mobile"
              :maxLength="11"
              placeholder="请输入11位手机号"
              v-number-input
            />
          </a-form-model-item>
          <a-form-model-item label="国家地区">
            <a-select defaultValue="0" disabled>
              <a-select-option key="0" value="0">中国</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="所在省市" prop="areas">
            <a-cascader
              v-model="form.areas"
              placeholder="请选择地址"
              :options="areaOptions"
              @change="handleAreaChange"
            />
          </a-form-model-item>
          <a-form-model-item label="街道地址" prop="address">
            <a-input v-model="form.address" :maxLength="100" />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" :disabled="!isChange" @click="handleSubmit">更新信息</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '212px' }">
        <div class="avatar-box">
        <div style="transform: translateX(-66px);margin-bottom: 20px;">头像</div>
          <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img v-if="form.avatar" :src="form.avatar" />
          </div>
          <a-button
            icon="upload"
            style="margin-top: 20px;"
            @click="$refs.modal.edit(1)"
          >
            更换头像
          </a-button>
        </div>
      </a-col>
    </a-row>

    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import chinaArea from '@/utils/chinaArea'
import { getBasicData, saveBasicSettings } from '@/api/common'

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      areaOptions: chinaArea,
      form: {
        realName: '',
        mobile: '',
        address: '',
        avatar: '',
        areas: [],
        province: '',
        city: '',
        area: ''
      },
      rules: {
        realName: [{ required: true, message: '请填写' }]
      },
      isChange: false
    }
  },
  watch: {
    form: {
      handler (val) {
        val && (this.isChange = true)
      },
      deep: true
    }
  },
  created () {
    this.getBasicData()
  },
  methods: {
    async getBasicData () {
      const { records } = await getBasicData()
      if (records.provinceId) {
        records.areas = [
          records.provinceId + '',
          records.cityId + '',
          records.areaId + ''
        ]
      }
      this.form = records
      this.$nextTick(() => {
        this.isChange = false
      })
    },
    handleAreaChange (value, selectedOptions) {
      this.form.province = selectedOptions[0].label
      this.form.city = selectedOptions[1].label
      this.form.area = selectedOptions[2].label
    },
    setavatar (url) {
      this.$set(this.form, 'avatar', url)
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveBasicSettings()
        } else {
          return false
        }
      })
    },
    saveBasicSettings () {
      const areas = this.form.areas
      if (areas) {
        this.form.provinceId = areas[0]
        this.form.cityId = areas[1]
        this.form.areaId = areas[2]
      }
      saveBasicSettings(this.form).then(() => {
        this.isChange = false
        this.$message.success('更新成功')
        this.$store.dispatch('GetInfo')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 160px;
  max-height: 160px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
