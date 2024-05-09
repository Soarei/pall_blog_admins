<template>
  <div class="wrap">
    <div class="app-title">
      <h2>分类列表</h2>
    </div>
    <div class="app-container">
      <div class="search">
        <div class="serachItem">
          <a-input placeholder="搜索关键词"></a-input>
          <a-input placeholder="搜索关键词"></a-input>
        </div>
        <span style="margin-left: 10px" class="btnConfig">
          <a-button type="primary" @click="handleCreateFirst">添加</a-button>
          <a-button type="primary">查询</a-button>
          <a-button>查询</a-button>
        </span>
      </div>
      <!-- <a-button class="editable-add-btn" @click="handleCreateFirst">
        添加分类
      </a-button> -->
      <a-table
        :columns="columns"
        :data-source="list"
        rowKey="catgory_id"
        :pagination="pagination"
        bordered
      >
        <template slot="catgory_icon" slot-scope="text, record">
          <img
            src="http://image.linkvaper.com/linkvaper/2022-09-29/1664441385852.jpeg"
            style="width: 50px; height: 50px"
            v-if="!record.catgory_icon"
          />
          <img
            :src="record.catgory_icon"
            srcset=""
            style="width: 50px; height: 50px"
            v-else
          />
        </template>
        <template slot="action" slot-scope="text, record">
          <a style="margin-left: 5px" @click="editCloumn(record)">编辑</a>
          <a style="margin-left: 5px; color: red" @click="deleteCloumn(record)"
            >删除</a
          >
        </template>
      </a-table>
      <!-- 添加分类 -->
      <a-modal
        v-model="dialogVisible"
        title="添加分类"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitForm('form')"
        @cancel="cancelForm"
        option-label-prop="label"
      >
        <!-- <p>可以设置用户使用过程中会遇到的问题，设置完成后，用户可在商城常见问题中展示</p> -->
        <a-form-model
          layout="vertical"
          :model="form"
          ref="form"
          :rules="rules"
          :validateOnRuleChange="true"
        >
          <a-form-model-item label="分类名称" prop="catgory_name">
            <a-input v-model="form.catgory_name" placeholder="请输入分类名称" />
          </a-form-model-item>
          <a-form-model-item label="排序号" prop="catgory_rank">
            <a-input v-model="form.catgory_rank" placeholder="请输入分类名称" />
          </a-form-model-item>
          <a-form-model-item label="分类图标" prop="catgory_icon">
            <!--     :action="uploadInter"
            :headers="headers" -->
            <a-upload
              name="file"
              list-type="picture-card"
              :multiple="false"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="uploadInter"
              :headers="headers"
              :fileList="fileList"
              @change="uploadChange"
            >
              <img
                v-if="form.catgory_icon"
                :src="form.catgory_icon"
                alt="avatar"
                style="width: 80px; height: 80px"
              />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
              </div>
            </a-upload>
            <!-- <TextArea v-model="form.content" :maxLength="500" :autoSize="{ minRows: 6, maxRows: 10}" :showWordLimit="true" placeholder="请输入问题说明"/> -->
          </a-form-model-item>
          <a-form-model-item label="是否显示" prop="status">
            <a-switch
              :default-checked="form.status"
              @change="isShowChange"
              size="small"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import {
  getCategoryList,
  addCategory,
  delCategory,
  editCategory,
} from "@/api/category";
import { uploadInter } from "@/api/article/upload";
import { getToken } from "@/utils/auth";
import Pagination from "../../components/Pagination";
import waves from "@/directive/waves"; // waves directive
export default {
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  components: {
    Pagination,
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
          key: "catgory_id",
          width: 100,
        },
        {
          title: "分类名称",
          dataIndex: "catgory_name",
          key: "catgory_name",
        },
        {
          title: "分类图标",
          width: 100,
          scopedSlots: { customRender: "catgory_icon" },
        },
        {
          title: "排序号",
          dataIndex: "catgory_rank",
          key: "catgory_rank",
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          key: "createdAt",
        },
        {
          title: "操作",
          fixed: "right",
          width: 170,
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        position: "bottom",
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        onShowSizeChange: (current, pageSize) =>
          this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize), //点击页码事件
      },
      // 筛选条件
      dialogVisible: false,
      fileList: [],
      // 商品图片处理
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
    // 添加一级分类
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
    // 删除分类接口
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
    // 编辑分类
    editCloumn(record) {
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(record));
    },
    // 删除商品接口
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
  },
};
</script>

<style scoped lang="less">
@import url("../../styles/page-public.less");
a {
  color: #1890ff;
}
</style>
