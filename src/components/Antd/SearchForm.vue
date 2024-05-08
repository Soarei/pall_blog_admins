<template>
  <div class="searchBox">
    <div class="serachInput">
      <a-row type="flex" style="flex-wrap:wrap;">
        <a-col :span="6" v-for="(item,index) in searchOptions" :key="index">
          <!-- 搜索框 -->
          <a-input-search :placeholder="item.placeholder" style="width:90%" v-model="form[item.value]" @pressEnter="handleFilter" v-if="item.type === 'input'">
          </a-input-search>
          <!-- 下拉框 -->
          <a-select v-model="form[item.value]" style="width:90%" :placeholder="item.placeholder" v-if="item.type === 'select'" @change="handleFilter">
            <a-select-option v-for="op in item.options" :key="op.value" :value="op.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </a-col>
        <!-- <a-col :span="6" :class="(searchOptions.length >= 4 ? 'active' : '')">
          <div class="btnConfig">
            <a-button type="primary" @click="isHideRellser=false">添加商品</a-button>
          </div>
        </a-col> -->
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    // input回车按钮搜索
    handleFilter() {
      const params = { ...this.form }
      this.$emit('handleFilter', params)
    },
  },
  props: {
    searchOptions: {
      type: Array,
      default: () => {
        return [
          // {
          //   label: "用户昵称",
          //   value: "user_name",
          //   placeholder: "请输入用户昵称",
          //   type: 'select',
          //   options: [
          //     {
          //       label: '111',
          //       value: '21'
          //     }
          //   ]
          // },
          // {
          //   label: "用户账号",
          //   value: "user_account",
          //   placeholder: "请输入用户账号",
          //   type: 'input'
          // },
        ]
      }
    }
  },
}
</script>

<style lang="less" scoped>
.searchBox {
  padding: 10px 0;
}
.active {
  margin-top: 20px;
}
</style>