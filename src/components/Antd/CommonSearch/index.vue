<template>
  <div class="common-search">
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <div class="search-content">
        <!-- 搜索项 -->
        <div class="search-items" :class="{ 'is-collapsed': !isExpand }">
          <template v-for="(item, index) in searchItems">
            <a-form-item
              :key="index"
              :label="item.label"
              v-show="!isExpand ? index < defaultShowCount : true"
            >
              <!-- 输入框 -->
              <a-input
                v-if="item.type === 'input'"
                v-decorator="[
                  item.field,
                  { rules: item.rules, initialValue: item.initialValue },
                ]"
                :placeholder="item.placeholder || '请输入' + item.label"
                :allowClear="true"
              />

              <!-- 选择框 -->
              <a-select
                v-else-if="item.type === 'select'"
                v-decorator="[
                  item.field,
                  { rules: item.rules, initialValue: item.initialValue },
                ]"
                :placeholder="item.placeholder || '请选择' + item.label"
                :allowClear="true"
              >
                <a-select-option
                  v-for="option in item.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </a-select-option>
              </a-select>

              <!-- 日期选择 -->
              <a-date-picker
                v-else-if="item.type === 'date'"
                v-decorator="[
                  item.field,
                  { rules: item.rules, initialValue: item.initialValue },
                ]"
                :placeholder="item.placeholder || '请选择' + item.label"
                :allowClear="true"
              />

              <!-- 日期范围 -->
              <a-range-picker
                v-else-if="item.type === 'dateRange'"
                v-decorator="[
                  item.field,
                  { rules: item.rules, initialValue: item.initialValue },
                ]"
                :placeholder="item.placeholder || ['开始日期', '结束日期']"
                :allowClear="true"
              />
            </a-form-item>
          </template>
        </div>

        <!-- 操作按钮 -->
        <div class="search-actions">
          <a-button type="primary" html-type="submit" :loading="loading">
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
          <a
            class="expand-button"
            v-if="searchItems.length > defaultShowCount"
            @click="toggleExpand"
          >
            {{ isExpand ? "收起" : "展开" }}
            <a-icon :type="isExpand ? 'up' : 'down'" />
          </a>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "CommonSearch",
  props: {
    // 搜索项配置
    searchItems: {
      type: Array,
      default: () => [
        {
          label: "关键词",
          field: "keyword",
          type: "input",
          placeholder: "请输入关键词",
          rules: [{ required: false, message: "请输入关键词" }],
          initialValue: "",
        },
        {
          label: "状态",
          field: "status",
          type: "select",
          placeholder: "请选择状态",
          rules: [{ required: false, message: "请选择状态" }],
          initialValue: undefined,
          options: [
            { label: "启用", value: "1" },
            { label: "禁用", value: "0" },
          ],
        },
        {
          label: "创建时间",
          field: "createTime",
          type: "dateRange",
          placeholder: ["开始日期", "结束日期"],
          rules: [{ required: false, message: "请选择创建时间" }],
          initialValue: [],
        },
        {
          label: "分类",
          field: "category",
          type: "select",
          placeholder: "请选择分类",
          rules: [{ required: false, message: "请选择分类" }],
          initialValue: undefined,
          options: [
            { label: "分类一", value: "1" },
            { label: "分类二", value: "2" },
            { label: "分类三", value: "3" },
          ],
        },
        {
          label: "更新日期",
          field: "updateDate",
          type: "date",
          placeholder: "请选择更新日期",
          rules: [{ required: false, message: "请选择更新日期" }],
          initialValue: null,
        },
      ],
    },
    // 默认显示的搜索项数量
    defaultShowCount: {
      type: Number,
      default: 3,
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      isExpand: false,
    };
  },
  methods: {
    // 切换展开/收起
    toggleExpand() {
      this.isExpand = !this.isExpand;
    },
    // 提交表单
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit("search", values);
        }
      });
    },
    // 重置表单
    handleReset() {
      this.form.resetFields();
      this.$emit("reset");
    },
  },
};
</script>

<style lang="less">
// 搜索组件样式
.common-search {
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .search-content {
    padding: 16px 24px;
    position: relative;

    // 搜索项网格布局
    .search-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, 320px);
      gap: 16px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
      justify-content: flex-start;

      &.is-collapsed {
        max-height: 56px;
        overflow: hidden;
      }
    }

    // 表单项样式
    .ant-form-item {
      margin: 0;
      display: flex;
      align-items: center;

      .ant-form-item-label {
        flex: none;
        width: 80px;
        padding-right: 12px;
        line-height: 32px;
        text-align: right;

        label {
          color: #606266;
        }
      }

      .ant-form-item-control-wrapper {
        flex: 1;
        width: calc(100% - 80px);
      }
    }

    // 表单控件统一样式
    .ant-input,
    .ant-select,
    .ant-calendar-picker {
      width: 100% !important;
    }

    // 日期选择器样式优化
    .ant-calendar-picker {
      .ant-calendar-picker-input,
      .ant-calendar-range-picker-input {
        height: 32px;
        line-height: 32px;
        padding: 0 11px;
      }

      // 日期范围选择器
      &.ant-calendar-range-picker {
        .ant-calendar-range-picker-separator {
          line-height: 32px;
        }

        .ant-calendar-range-picker-input {
          width: calc(50% - 11px); // 减去分隔符的宽度
          &:first-child {
            text-align: left;
          }
          &:last-child {
            text-align: right;
          }
        }
      }

      // 日期图标位置调整
      .ant-calendar-picker-icon {
        right: 11px;
      }
    }

    // Select 和普通输入框样式
    .ant-select-selection,
    .ant-input {
      height: 32px;
      line-height: 32px;
      padding: 0 11px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        border-color: #40a9ff;
      }

      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }

    // 按钮区域样式
    .search-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;

      .ant-btn {
        min-width: 80px;
        height: 32px;
        margin-left: 8px;

        &:first-child {
          margin-left: 0;
        }
      }

      .expand-button {
        margin-left: 16px;
        color: #1890ff;
        cursor: pointer;
        font-size: 13px;
        display: inline-flex;
        align-items: center;

        .anticon {
          margin-left: 4px;
          font-size: 12px;
        }
      }
    }
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .common-search .search-content .search-items {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .common-search .search-content {
    padding: 12px;

    .search-items {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .ant-form-item {
      width: 100%;

      .ant-form-item-label {
        width: 70px;
      }

      .ant-form-item-control-wrapper {
        width: calc(100% - 70px);
      }
    }
  }
}
</style>
