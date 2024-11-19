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
            :md="8"
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
              <!-- 时间选择器 -->
              <a-range-picker
                v-if="item.type === 'date'"
                style="width: 100%"
                v-model="form[item.value]"
                showToday
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('11:59:59', 'HH:mm:ss'),
                  ],
                }"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <!-- 查询 -->
            <a-button
              type="primary"
              @click="handleFilter"
              v-if="renderButton.query.type == 'search'"
              style="margin-right: 10px"
            >
              {{ renderButton.query.label }}</a-button
            >
            <!-- 批量采集 -->
            <a-button
              type="primary"
              @click="handleRowsImport"
              v-if="
                renderButton.rowsImport &&
                renderButton.rowsImport.type == 'rowsImport'
              "
              style="margin-right: 10px"
            >
              {{ renderButton.rowsImport.label }}</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      form: {},
      moment,
    };
  },
  mounted() {},
  methods: {
    // input回车按钮搜索
    handleFilter() {
      const params = { ...this.form };
      console.log(params);
      this.$emit("handleFilter", params);
    },
    handleRowsImport() {
      this.$emit("handleRowsImport");
    },
    disabledRangeTime(_, type) {
      if (type === "start") {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56],
      };
    },
  },
  props: {
    searchOptions: {
      type: Array,
      default: () => {
        return [];
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
