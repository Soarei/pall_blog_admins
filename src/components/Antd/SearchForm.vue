<template>
  <div class="searchBox">
    <div class="serachInput">
      <a-form :form="form" layout="inline">
        <a-row
          type="flex"
          style="flex-wrap: wrap; align-items: center"
          :gutter="24"
        >
          <a-col
            v-for="(item, index) in searchOptions"
            :key="index"
            :md="6"
            :sm="8"
          >
            <a-form-item :label="item.label" style="width: 100%">
              <!-- 搜索框 -->
              <a-input
                :placeholder="item.placeholder"
                style="width: 100%"
                v-model="form[item.value]"
                @pressEnter="handleFilter"
                v-if="item.type === 'input'"
              >
              </a-input>
              <!-- 下拉框 -->
              <a-select
                v-model="form[item.value]"
                style="width: 100%"
                :placeholder="item.placeholder"
                v-if="item.type === 'select'"
                @change="handleFilter"
              >
                <a-select-option
                  v-for="op in item.options"
                  :key="op.value"
                  :value="op.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <!-- 操作按钮 -->
            <a-button
              size="mini"
              v-for="abtn in renderButton"
              :type="abtn.type"
              @click="abtn.click"
              :key="abtn.label"
              style="margin-right: 10px"
            >
              {{ abtn.label }}</a-button
            >
            <!-- 是否收起 -->
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  methods: {
    // input回车按钮搜索
    handleFilter() {
      const params = { ...this.form };
      console.log(params);
      this.$emit("handleFilter", params);
    },
  },
  props: {
    searchOptions: {
      type: Array,
      default: () => {
        return [
          {
            label: "用户昵称",
            value: "user_name",
            placeholder: "请输入用户昵称",
            type: "select",
            options: [
              {
                label: "111",
                value: "21",
              },
            ],
          },
          {
            label: "用户昵称",
            value: "user_name",
            placeholder: "请输入用户昵称",
            type: "select",
            options: [
              {
                label: "111",
                value: "21",
              },
            ],
          },
          {
            label: "用户昵称",
            value: "user_name",
            placeholder: "请输入用户昵称",
            type: "select",
            options: [
              {
                label: "111",
                value: "21",
              },
            ],
          },
        ];
      },
    },
    renderButton: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang="less" scoped>
.searchBox {
  padding: 10px 0;
}
.active {
  margin-top: 20px;
}
/deep/ .ant-form-item-label label {
  color: #666 !important;
  font-size: 15px;
}
/deep/ .ant-form-item-control-wrapper {
  width: 70%;
}
</style>
