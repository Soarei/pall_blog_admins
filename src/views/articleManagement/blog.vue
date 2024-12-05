<template>
  <div>
    <div class="wrap" v-if="dialogVisible">
      <div class="app-title">
        <h2>文章列表</h2>
      </div>
      <div class="app-container">
        <!-- 搜索区域 -->
        <div class="search-area">
          <div class="search-inputs">
            <div class="search-item">
              <span class="label">文章标题：</span>
              <a-input
                v-model="search.article_title"
                placeholder="请输入文章标题"
                allowClear
              />
            </div>
            <div class="search-item">
              <span class="label">文章分类：</span>
              <a-select
                v-model="search.category"
                placeholder="请选择文章分类"
                allowClear
              >
                <a-select-option
                  v-for="item in searchOptions[1].options"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="search-item">
              <span class="label">状态：</span>
              <a-select
                v-model="search.status"
                placeholder="请选择状态"
                allowClear
              >
                <a-select-option value="1">审批中</a-select-option>
                <a-select-option value="2">审核成功</a-select-option>
                <a-select-option value="3">审核失败</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="search-buttons">
            <a-button type="primary" @click="getList">搜索</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button type="primary" @click="handleAdd">添加文章</a-button>
          </div>
        </div>

        <!-- 表格区域 -->
        <a-table
          :columns="columns"
          :data-source="list"
          :scroll="{ x: 1000 }"
          rowKey="article_id"
        >
          <template slot="recommend" slot-scope="text, record">
            <div class="recommend-rate">
              <a-rate
                :value="record.level"
                disabled
                :count="3"
                class="custom-rate"
              />
              <span class="rate-text">{{ getRateText(record.level) }}</span>
            </div>
          </template>

          <template slot="labels" slot-scope="text, record">
            <a-tag
              v-for="(item, index) in record.labels"
              :key="index"
              class="label-tag"
            >
              {{ item.name }}
            </a-tag>
          </template>

          <template slot="status" slot-scope="text, record">
            <a-tag :color="getStatusTagColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <template slot="listing" slot-scope="text, record">
            <a-tag :color="record.listing ? 'green' : 'orange'">
              {{ record.listing ? "上架" : "下架" }}
            </a-tag>
          </template>

          <template slot="action" slot-scope="text, record">
            <a style="margin-left: 5px" @click="handleEdit(record)">编辑</a>
            <a
              style="margin-left: 5px; color: red"
              @click="handleDel(record.article_id)"
              >删除</a
            >
          </template>
        </a-table>
      </div>
    </div>

    <AddGoods
      v-if="!dialogVisible"
      :editForm="addGoodsForm"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<style scoped lang="less">
@import url("../../styles/page-public.less");

// 搜索区域样式
.search-area {
  background: #fff;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .search-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;

    .search-item {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 280px;
      max-width: 320px;

      .label {
        color: #606266;
        margin-right: 8px;
        min-width: 70px;
        text-align: left;
        white-space: nowrap;
      }

      .ant-input,
      .ant-select {
        width: 100%;
        :deep(.ant-select-selection) {
          width: 100%;
        }
      }
    }
  }

  .search-buttons {
    display: flex;
    gap: 8px;
    margin-left: 78px;
    flex-wrap: wrap;

    .ant-btn {
      min-width: 80px;
      height: 32px;

      &:not(:first-child) {
        margin-left: 8px;
      }

      @media screen and (max-width: 576px) {
        margin-left: 0 !important;
        margin-top: 8px;
      }
    }
  }

  // 响应式布局调整
  @media screen and (max-width: 768px) {
    .search-inputs {
      .search-item {
        min-width: 100%;
        max-width: 100%;
      }
    }

    .search-buttons {
      margin-left: 0;
      justify-content: flex-start;
    }
  }

  @media screen and (min-width: 1200px) {
    .search-inputs {
      .search-item {
        max-width: 380px;
      }
    }
  }
}

.bigImg {
  display: none;
  position: fixed;
  z-index: 9;
  top: 0;
  background: white;
  transition: display 1s ease 1s;
}

a {
  color: #1890ff;
}

// 推荐星级样式
.recommend-rate {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.custom-rate) {
    font-size: 16px;
    color: #fadb14; // 金色星星

    .ant-rate-star {
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }

      // 未选中的星星颜色
      &.ant-rate-star-zero .anticon {
        color: #d9d9d9;
      }
    }

    // 禁用状态不改变颜色
    &.ant-rate-disabled {
      .ant-rate-star {
        cursor: default;

        &-full .anticon {
          color: #fadb14;
        }

        &-zero .anticon {
          color: #d9d9d9;
        }
      }
    }
  }

  .rate-text {
    font-size: 13px;
    color: #595959;
    margin-left: 4px;
  }
}
</style>

<script>
import { getArticleList, delArticle } from "@/api/pall_article";
import SearchBox from "../../components/searchBox";
import CursorImage from "../../components/CursorImage";
import SearchForm from "../../components/Antd/SearchForm.vue";
import AddGoods from "./component/addGoods.vue";

export default {
  components: {
    SearchBox,
    AddGoods,
    CursorImage,
    SearchForm,
  },
  data() {
    return {
      list: null,
      columns: [
        {
          title: "创建时间",
          dataIndex: "release_time",
          key: "release_time",
          width: 200,
        },
        {
          title: "文章标题",
          dataIndex: "article_title",
          key: "article_title",
          ellipsis: true,
          width: 300,
          align: "left",
        },
        {
          title: "推荐",
          scopedSlots: { customRender: "recommend" },
          width: 200,
        },
        {
          title: "文章分类",
          dataIndex: "catgory_name",
          key: "catgory_name",
          width: 100,
        },
        {
          title: "标签",
          scopedSlots: { customRender: "labels" },
          width: 250,
        },
        {
          title: "作者",
          dataIndex: "user_name",
          key: "user_name",
          width: 120,
        },
        {
          title: "状态",
          width: 80,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "上下架",
          width: 80,
          scopedSlots: { customRender: "listing" },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
      },
      dialogVisible: true,
      bigImg: "",
      addGoodsForm: {},
      search: {
        article_title: "",
        category: undefined,
        status: undefined,
      },
      searchOptions: [
        {
          label: "文章标题",
          value: "article_title",
          placeholder: "请输入文章标题",
          type: "input",
        },
        {
          label: "文章分类",
          value: "category",
          placeholder: "请选择文章分类",
          type: "select",
          options: [],
        },
        {
          label: "状态",
          value: "status",
          placeholder: "请选择状态",
          type: "select",
          options: [
            { label: "审批中", value: "1" },
            { label: "审核成功", value: "2" },
            { label: "审核失败", value: "3" },
          ],
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { current } = this.pagination;
      getArticleList({
        page: current,
        size: 10,
        ...this.search,
      })
        .then((res) => {
          if (res.code === 5200) {
            this.listLoading = false;
            this.list = res.data.rows;
            this.pagination.total = res.data.count;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetSearch() {
      this.search = {
        article_title: "",
        category: undefined,
        status: undefined,
      };
      this.pagination.current = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = false;
    },
    handleEdit(row) {
      this.dialogVisible = false;
      this.addGoodsForm = JSON.parse(JSON.stringify(row));
      this.addGoodsForm.tags = JSON.parse(JSON.stringify(row)).labels.map(
        (item) => item.id
      );
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delArticle({ id })
            .then((res) => {
              if (res.code == 5200) {
                this.$antmessage.success(res.message);
                this.getList();
              } else {
                this.$antmessage.error(res.message);
              }
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },
    closeDialog() {
      this.dialogVisible = true;
      this.getList();
    },
    getStatusTagColor(status) {
      const colorMap = {
        1: "blue", // 审批中
        2: "green", // 审核成功
        3: "red", // 审核失败
      };
      return colorMap[status] || "default";
    },
    getStatusText(status) {
      const statusMap = {
        1: "审批中",
        2: "审核成功",
        3: "审核失败",
      };
      return statusMap[status] || "未知状态";
    },
    getRateText(level) {
      const textMap = {
        1: "普通",
        2: "推荐",
        3: "置顶",
      };
      return textMap[level] || "普通";
    },
  },
};
</script>
