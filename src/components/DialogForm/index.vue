<template>
  <div>
    <el-dialog
      :title="dialogFormConfig.title"
      :visible.sync="dialogFormConfig.dialogVisable"
      width="50%"
      :before-close="handleClose">
    <el-form ref="form" :model="baseInfo" label-width="80px" :label-position="isMobileSize ? 'top' : 'left'" :rules="dialogFormConfig.tempRules">
      <div class="shadow-box">
        <!-- <el-divider content-position="left"><b>基础信息</b></el-divider> -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" v-for="item in dialogFormConfig.tempFormArray" :key="item.key">
            <el-form-item :label="item.label" :required="item.isRequired">
              <el-input class="form-input" v-model="dialogFormConfig.temp[item.key]" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="t-center">
          <div class="line"></div>
          <el-button type="primary" @click="submitForm('form')" size="medium">保存并下一步</el-button>
        </div>
      </div>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    dialogFormConfig:{
      type:Object
    }
  },
  data() {
    return {
      isMobileSize: false, //是否是手机尺寸
      baseInfo:{},
      certificatesTypeOptions:[],
      sexArr:[],
      dialogVisible:false,
    }
  },
  mounted() {
    this.getDeviceSize();
    window.addEventListener('resize', () => {
      this.getDeviceSize();
    })

    // this.headers = { Authorization: 'Bearer ' + (sessionStorage.getItem('token') || '') }
  },
  methods: {
    getDeviceSize() {
      let winW = window.innerWidth;
      if (winW < 400) {
        this.isMobileSize = true
      } else {
        this.isMobileSize = false
      }
    },
    handleClose() {
     
    },
    submitForm(form){
       console.log(this.dialogFormConfig.temp);
    }
  }
}
</script>

<style scoped>
.form-input{
  width: 80%;
}
</style>