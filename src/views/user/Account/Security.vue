<template>
  <a-row>
    <a-col :xs="24" :md="12" :style="{ height: '350px' }">
      <a-form-model ref="form" :model="form" :rules="rules" layout="vertical">
        <a-form-model-item label="登录账号" prop="account">
          <a-input v-model="form.account" disabled />
        </a-form-model-item>
        <a-form-model-item label="登录密码" prop="password" required>
          <a-input-password
            v-model="form.password"
            v-number-input.EnNum
            placeholder="请输入"
            :maxLength="18"
          />
          <div class="password-alert">限6~18个字符</div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            :disabled="!form.password || !isChange"
            @click="handleSubmit"
            >更新信息</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>
<script>
import { getBasicData, saveSafeSettings } from '@/api/common'
export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '必填' },
          { min: 6, message: '必须大于6位' }
        ]
      },
      isChange: false
    }
  },
  watch: {
    'form.password' (val) {
      val && (this.isChange = true)
    }
  },
  mounted () {
    this.getBasicData()
  },
  methods: {
    async getBasicData () {
      const { records } = await getBasicData()
      this.form.account = records.account
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveSafeSettings()
        } else {
          return false
        }
      })
    },
    saveSafeSettings () {
      saveSafeSettings(this.form).then(() => {
        this.$message.success('更新成功')
        this.isChange = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.password-alert {
  margin-top: 4px;
  line-height: 22px;
  color: #00000072;
}
</style>
