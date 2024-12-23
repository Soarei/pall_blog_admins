<template>
  <div class="wrap">
    <div class="app-title">
      <h2>分类列表</h2>
    </div>
    <div class="app-container">
      <CommonSearch
        :searchItems="searchItems"
        :loading="listLoading"
        @search="handleSearch"
        @reset="handleReset"
      />
      <a-table
        :columns="columns"
        :data-source="list"
        rowKey="catgory_id"
        :pagination="pagination"
        :loading="listLoading"
        :scroll="{ x: 1000 }"
      >
        <template slot="catgory_icon" slot-scope="text, record">
          <div class="table-img-wrapper">
            <img
              :src="
                record.catgory_icon ||
                'http://image.linkvaper.com/linkvaper/2022-09-29/1664441385852.jpeg'
              "
              :alt="record.catgory_name"
              style="width: 60px; height: 60px; object-fit: cover"
            />
          </div>
        </template>
        <template slot="status" slot-scope="text, record">
          <div class="status-tag">
            <span
              class="dot"
              :class="record.status ? 'active' : 'inactive'"
            ></span>
            <a-tag :color="record.status ? '#52c41a' : '#ff4d4f'">
              {{ record.status ? "显示" : "隐藏" }}
            </a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-actions">
            <a-button type="link" @click="editCloumn(record)">
              <a-icon type="edit" />编辑
            </a-button>
            <a-button
              type="link"
              class="delete-btn"
              @click="deleteCloumn(record)"
            >
              <a-icon type="delete" />删除
            </a-button>
          </div>
        </template>
      </a-table>

      <!-- 弹窗部分保持不变 -->
      <a-modal
        v-model="dialogVisible"
        title="添加分类"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitForm('form')"
        @cancel="cancelForm"
      >
        <!-- 弹窗内容保持不变 -->
      </a-modal>
    </div>
  </div>
</template>

<script>
import CommonSearch from "@/components/Antd/CommonSearch";
import {
  getCategoryList,
  addCategory,
  delCategory,
  editCategory,
} from "@/api/category";
import { uploadInter } from "@/api/article/upload";
import { getToken } from "@/utils/auth";
import Pagination from "../../components/Pagination";
import waves from "@/directive/waves";

export default {
  directives: { waves },
  components: {
    Pagination,
    CommonSearch,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 5,
      },
      columns: [
        {
          title: "ID",
          dataIndex: "catgory_id",
          width: 80,
          align: "center",
        },
        {
          title: "分类名称",
          dataIndex: "catgory_name",
          ellipsis: true,
          width: 100,
        },
        {
          title: "分类图标",
          width: 60,
          align: "center",
          scopedSlots: { customRender: "catgory_icon" },
        },
        {
          title: "排序号",
          dataIndex: "catgory_rank",
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          width: 180,
          align: "center",
        },
        {
          title: "操作",
          fixed: "right",
          width: 200,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        position: "bottom",
        pageSize: 10,
        current: 1,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total, range) => `共 ${total} 条`,
      },
      dialogVisible: false,
      fileList: [],
      form: {
        catgory_name: "",
        catgory_icon: "",
        catgory_rank: "",
        status: true,
      },
      rules: {
        catgory_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        catgory_icon: [
          { required: true, message: "请输入分类描述", trigger: "blur" },
        ],
        catgory_rank: [
          { required: true, message: "请输入排序号", trigger: "blur" },
        ],
      },
      uploadInter,
      loading: false,
      headers: {
        token: getToken(),
      },
      searchItems: [
        {
          label: "分类名称",
          field: "catgory_name",
          type: "input",
          placeholder: "请输入分类名称",
        },
        {
          label: "排序号",
          field: "catgory_rank",
          type: "input",
          placeholder: "请输入排序号",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const { current, pageSize } = this.pagination;
      getCategoryList({ page: current, size: pageSize })
        .then((res) => {
          if (res.code === 5200) {
            this.listLoading = false;
            this.list = res.data.rows;
            this.pagination.total = res.data.count;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current;
      this.getList();
    },
    handleCreateFirst() {
      this.dialogVisible = true;
      this.form = this.$options.data().form;
    },
    uploadChange({ file, fileList }) {
      this.fileList = fileList;
      if (file.status === "uploading") {
        this.loading = true;
        return false;
      }
      if (file.status === "done") {
        this.form.catgory_icon = file.response.data.url;
      }
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.catgory_id) {
            editCategory(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message);
                this.dialogVisible = false;
                this.getList();
              }
            });
          } else {
            addCategory(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message);
                this.dialogVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    deleteCloumn(record) {
      const { catgory_id } = record;
      let _this = this;
      this.$antconfirm({
        title: "确认删除问题分类？",
        content:
          "删除问题分类后不能恢复，相关分类问题自动变为空分类，且不再商城展示，是否继续删除操作。",
        okText: "删除",
        cancelText: "取消",
        onOk() {
          delCategory({ catgory_id }).then((res) => {
            if (res.code === 5200) {
              _this.form.categoryName = "";
              _this.$antmessage.success("删除成功");
              let { current, pageSize, total } = _this.pagination;
              _this.pagination.current =
                (total - 1) % pageSize === 0 ? current - 1 : current;
              _this.getList();
            }
          });
        },
        onCancel() {
          _this.$antmessage.info("取消删除");
        },
      });
    },
    cancelForm(form) {},
    isShowChange(val) {
      console.log(val);
    },
    editCloumn(record) {
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(record));
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delCategory({ catgory_id: row.catgory_id })
            .then((res) => {
              if (res.code == 5200) {
                this.$message.success("删除分类成功");
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },
    handleSearch(values) {
      this.listLoading = true;
      const params = {
        page: this.listQuery.page,
        size: this.listQuery.size,
        ...values,
      };
      getCategoryList(params).then((res) => {
        if (res.code === 5200) {
          this.listLoading = false;
          this.list = res.data.rows;
          this.pagination.total = res.data.count;
        }
      });
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        size: 5,
      };
      this.getList();
    },
  },
};
</script>

<style scoped lang="less">
@import url("../../styles/page-public.less");

.search-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .search-area {
    flex: 1;
    margin-right: 16px;

    :deep(.common-search) {
      margin-bottom: 0;
      background: transparent;
      box-shadow: none;
      padding: 0;
    }
  }

  .action-area {
    padding-top: 4px;
  }
}

a {
  color: #1890ff;
}

// 表格相关样式
:deep(.ant-table-wrapper) {
  background: #fff;
  border-radius: 4px;

  .ant-table {
    .ant-table-thead > tr > th {
      background: #fafafa;
      font-weight: 500;
      color: #1f2329;
      padding: 12px 8px;

      &.ant-table-column-sort {
        background: #f5f5f5;
      }
    }

    .ant-table-tbody > tr > td {
      padding: 12px 8px;

      &.ant-table-column-sort {
        background: #fafafa;
      }
    }

    .ant-table-tbody > tr:hover > td {
      background: #f5f5f5;
    }
  }

  // 图片样式
  .table-img-wrapper {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #f0f0f0;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      display: block;
    }
  }

  // 操作按钮样式
  .table-actions {
    display: flex;
    justify-content: center;
    gap: 8px;

    .ant-btn {
      padding: 0 4px;
      height: 24px;
      line-height: 24px;
      font-size: 13px;

      .anticon {
        font-size: 12px;
        margin-right: 4px;
      }

      &.delete-btn {
        color: #ff4d4f;

        &:hover {
          color: #ff7875;
        }
      }
    }
  }

  // 状态样式
  .status-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;

      &.active {
        background-color: #52c41a;
        box-shadow: 0 0 0 4px rgba(82, 196, 26, 0.1);
      }

      &.inactive {
        background-color: #ff4d4f;
        box-shadow: 0 0 0 4px rgba(255, 77, 79, 0.1);
      }
    }

    .ant-tag {
      margin: 0;
      min-width: 48px;
      text-align: center;
      border: none;

      &.ant-tag-green {
        color: #52c41a;
        background: #f6ffed;
      }

      &.ant-tag-red {
        color: #ff4d4f;
        background: #fff1f0;
      }
    }
  }
}

// 分页样式优化
:deep(.ant-pagination) {
  margin: 16px 0;
  padding: 0 16px;

  .ant-pagination-options {
    .ant-select {
      width: 100px;
    }
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  :deep(.ant-table) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 4px;
      font-size: 13px;
    }

    .table-img-wrapper {
      width: 60px;
      height: 60px;
    }

    .table-actions {
      flex-direction: column;
      gap: 4px;
    }
  }

  :deep(.ant-pagination) {
    .ant-pagination-options {
      display: none;
    }
  }
}
</style>
