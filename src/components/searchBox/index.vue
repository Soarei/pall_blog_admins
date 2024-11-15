<template>
  <div>
    <el-row class="searchForm">
      <!-- 等接口好了再放开 -->
      <template v-for="(item, index) in searchConfig" :gutter="20">
        <el-col :key="index" :span="item.type == 'dates' ? 6 : 6">
          <span>{{ item.placeholder }}：</span>
          <el-input
            v-if="item.type == 'input'"
            v-model="selectSearch[item.dataModel]"
            style="width: calc(100% - 120px)"
            class="filter-item"
          />
          <el-date-picker
            v-if="item.type == 'date'"
            :picker-options="pickerOptions"
            v-model="selectSearch[item.dataModel]"
            style="width: calc(100% - 120px)"
            class="filter-item"
            type="date"
            placeholder="请选择日期"
          />
          <!-- <el-date-picker v-if="item.type == 'dates'" v-model="selectSearch[item.dataModel]" type="daterange" :start-placeholder="$t('common.startDate')" :end-placeholder="$t('common.endDate')" format="yyyy-MM-dd HH:mm:ss" /> -->
          <el-select
            v-if="item.type == 'select'"
            v-model="selectSearch[item.dataModel]"
            placeholder="请选择"
            style="width: calc(100% - 120px)"
            clearable
            class="filter-item"
          >
            <el-option
              v-for="(item2, index2) in item.options"
              :key="index2"
              :label="item.opIsNoNeedTanselate ? item2.label : item2.label"
              :value="item2.value"
            />
          </el-select>
          <!-- 处理需要从后台获取大量数据，且有层级的下拉框的搜索 -->
          <!-- <el-cascader v-if="item.type == 'cascader'" v-model="selectSearch[item.dataModel]" :placeholder="$t('goods.select')" style="width:calc(100% - 120px)" class="filter-item" filterable clearable :props="item.props" :options="item.options" change-on-select @change="cascaderChange" /> -->
        </el-col>
      </template>
      <el-col :span="6">
        <slot name="search"></slot>
      </el-col>
    </el-row>
    <div class="button" style="margin: 20px 0">
      <el-button
        v-if="btnConfig.search"
        v-waves
        class="filter-item"
        @click="handleFilter"
        icon="el-icon-search"
        round
      >
        搜索
      </el-button>
      <el-button
        v-if="btnConfig.reset"
        v-waves
        class="filter-item"
        @click="handleReset"
        icon="el-icon-refresh"
        round
        type="danger"
        plain
      >
        重置
      </el-button>
      <el-button
        v-if="btnConfig.add"
        v-waves
        class="filter-item"
        @click="handleAdd"
        icon="el-icon-plus"
        round
        type="primary"
        plain
      >
        添加
      </el-button>
    </div>
  </div>
</template>
<script>
import waves from "@/directive/waves"; // waves directive
export default {
  directives: { waves },
  props: {
    pickerOptions: {
      type: Object,
      default() {
        return {};
      },
    },
    selectSearch: {
      type: Object,
      default() {
        return {};
      },
    },
    disabledBtn: {
      type: Object,
      default() {
        return {};
      },
    },
    listQuery: {
      type: Object,
      default() {
        return {};
      },
    },
    btnGroup: {
      // 动态配置按钮，现在说不需要了，暂时先放着
      type: Array,
      default() {
        return [];
      },
    },
    downloadLoading: {
      type: Boolean,
      default: false,
    },
    testId: {
      type: Boolean,
      default: true,
    },
    showReviewer: {
      type: Boolean,
      default: false,
    },
    // 配置按钮是否展示
    btnConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    searchConfig: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      btnGroupDiffType: {
        add: {
          class: "el-icon-edit",
          type: "primary",
        },
        export: {
          class: "el-icon-download",
          type: "success",
        },
        search: {
          class: "el-icon-search",
          type: "",
        },
        reset: {
          class: "el-icon-refresh",
          type: "danger",
        },
      },
      btnGroup2: [],
    };
  },
  methods: {
    handleFilter() {
      // 搜索
      this.$emit("handleFilter");
    },
    handleCreate() {
      // 新建
      this.$emit("handleCreate");
    },
    handleClick(item) {
      switch (item) {
        case "add":
          this.handleCreate();
          break;
        case "export":
          this.handleDownload();
          break;
        case "search":
          this.handleFilter();
          break;
        case "reset":
          this.handleReset();
          break;
        case "addMenu":
          this.handleCreate();
          break;
        case "editMenu":
          this.handleEdit();
          break;
        case "deleteMenu":
          this.handleDelete();
          break;
      }
    },
    handleReset() {
      this.$emit("handleReset");
    },
    handleAdd() {
      this.$emit("handleAdd");
    },
  },
};
</script>

<style scoped>
.searchForm span {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  color: #303133;
  font-size: 14px;
  /* width: 108px; */
  /* 这个先注释 */
  /* overflow: auto; */
  vertical-align: top;
}
</style>
