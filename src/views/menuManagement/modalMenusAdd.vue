<template>
  <div>
    <a-modal v-model="dialogVisible" title="添加菜单" ok-text="确认" cancel-text="取消" @ok="submitForm('form')">
      <a-form-model :model="form" layout="vertical" :rules="rules">
        <a-form-model-item label="上级菜单" v-if="form.parentId!=0" prop="parentMenus">
          <a-input v-model="form.parentMenus" disabled />
        </a-form-model-item>
        <a-form-model-item label="菜单名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="路由地址" prop="routeUrl">
          <a-input v-model="form.routeUrl" />
        </a-form-model-item>
        <a-form-model-item label="资源路径" prop="url">
          <a-input v-model="form.url" />
        </a-form-model-item>
        <a-form-model-item label="类型" prop="type">
          <a-select :default-value="0" v-model="form.type">
            <a-select-option :value="0"> 菜单 </a-select-option>
            <a-select-option :value="1"> 按钮 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="菜单图标" prop="icon">
          <a-input v-model="form.icon" />
        </a-form-model-item>
        <a-form-model-item label="排序号" prop="sort">
          <a-input v-model="form.sort" />
        </a-form-model-item>
        <a-form-model-item label="备注信息" prop="note">
          <a-input v-model="form.note" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { addMenus,editMenus } from '@/api/menus/menulist'
export default {
  data() {
    return {
      form: {},
      dialogVisible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules:{
        name:[{required:true,message:'请输入菜单名称',trigger: 'change'}],
        routeUrl:[{required:true,message:'请输入路由地址',trigger: 'change'}],
        url:[{required:true,message:'请输入资源路径',trigger:'change'}],
        type:[{required:true,message:'请选择菜单类型',trigger:'change'}],
        icon:[{required:true,message:'请选择菜单图标',trigger:'change'}],
        sort:[{required:true,message:'请输入排序号',trigger:'change'}],
        note:[{required:true,message:'请输入备注信息',trigger:'change'}]
      }
    };
  },
  methods: {
    submitForm(form) {
      if(this.form.id){
        editMenus(this.form).then(res=>{
          if(res.code === 5200){
            this.$antmessage.success('更新更改')
            this.dialogVisible = false
            this.$emit('getList')
          }
        })
      }else{
        addMenus(this.form).then(res => {
        if (res.code === 5200) {
          this.$antmessage.success('添加成功')
          this.dialogVisible = false
          this.$emit('getList')
        }
      })
      }
    },
    isShow(record, action) {
      this.dialogVisible = true;
      this.form = this.$options.data().form
      // 编辑操作 
      if (action) {
        this.form = record
        this.form.parentMenus = record.url
      } else if (record) {
        this.form.parentId = record.id
        this.form.parentMenus = record.url
      } else {
        this.form.parentId = 0
      }

    },
  },
};
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 0;
}
</style>>
