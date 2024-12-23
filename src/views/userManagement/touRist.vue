<template>
  <div>
    <!-- <searchForm
      :formOptions="formOptions"
      :needParams="needParams"
      btnItems="search, export, reset"
    /> -->
  </div>
</template>

<script>
// import searchForm from '@/components/Antd/Search/index.vue'
export default {
  components: {
    // searchForm
  },
  data() {
    return {
      formOptions: [
        {
          label: "用户名很长是是是", // label文字
          prop: "username", // 字段名
          type: "input", // 指定antd组件
          defaultValue: "阿黄", // 字段初始值
          placeholder: "请输入用户名", // antd组件属性
          rules: [{ required: true, message: "必填项", trigger: "blur" }], // antd组件属性
          events: {
            // antd组件方法
            input(val) {
              console.log(val);
            },
          },
        },
        {
          label: "年龄", // label文字
          prop: "age", // 字段名
          type: "number", // 指定antd组件
          defaultValue: 18, // 字段初始值
          placeholder: "请输入年龄", // antd组件属性
          rules: [{ required: true, message: "必填项", trigger: "blur" }], // antd组件属性
          events: {
            // antd组件方法
            input(val) {
              console.log(val);
            },
          },
        },
        {
          label: "性别", // label文字
          prop: "sex", // 字段名
          type: "select", // 指定antd组件
          defaultValue: "", // 字段初始值
          placeholder: "请选择性别", // antd组件属性
          options: [
            {
              label: "男",
              value: "1",
            },
            {
              label: "女",
              value: "2",
            },
          ],
          events: {
            // antd组件方法
            change(val) {
              console.log(val);
            },
          },
        },
        {
          label: "下拉框", // label文字
          prop: "address", // 字段名
          type: "select", // 指定antd组件
          defaultValue: "", // 字段初始值
          placeholder: "请选择性别", // antd组件属性
          options: [],
          url: "http://rap2api.taobao.org/app/mock/270426/city",
          methods: "get",
          dicParamsList: [
            {
              key: "token",
            },
            {
              key: "bussinessId",
              value: "324",
            },
          ],
          filedName: {
            label: "name",
            value: "id",
          },
          propsHttpRes: "data",
          events: {
            // antd组件方法
            change(val) {
              console.log(val);
            },
          },
        },
        {
          label: "项目地址", // label文字
          prop: "project", // 字段名
          type: "cascader", // 指定antd组件
          defaultValue: [], // 字段初始值
          placeholder: "请选择性别", // antd组件属性
          options: [],
          url: "http://rap2api.taobao.org/app/mock/270426/getCascaderList",
          methods: "get",
          dicParamsList: [
            {
              key: "token",
            },
            {
              key: "bussinessId",
              value: "324",
            },
          ],
          filedName: {
            label: "name",
            value: "id",
          },
          propsHttpRes: "data",
          events: {
            // antd组件方法
            change(val) {
              console.log(val);
            },
          },
        },
        {
          label: "到货日期", // label文字
          prop: "arrialDate", // 字段名
          type: "range-picker", // 指定antd组件
          defaultValue: [], // 字段初始值
          placeholder: "请选择", // antd组件属性
          events: {
            // antd组件方法
            change(val) {
              console.log(val);
            },
          },
        },
        {
          label: "发货日期", // label文字
          prop: "delieverDate", // 字段名
          type: "date-picker", // 指定antd组件
          defaultValue: "", // 字段初始值
          placeholder: "请选择", // antd组件属性
          events: {
            // antd组件方法
            change(val) {
              console.log(val);
            },
          },
        },
      ],
      needParams: {},
    };
  },
};
</script>

<style scoped></style>
