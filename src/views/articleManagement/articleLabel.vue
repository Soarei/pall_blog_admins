<template>
  <div class="wrap">
    <div class="app-title">
      <h2>标签列表</h2>
    </div>
    <div class="app-container">
      <!-- 查询条件 -->
      <div class="search">
        <div class="serachItem">
          <a-input placeholder="搜索关键词"></a-input>
          <a-input placeholder="搜索关键词"></a-input>
        </div>
        <span class="btnConfig">
          <a-button type="primary" @click="createLabel">添加</a-button>
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 10px">查询</a-button>
        </span>
      </div>
      <!-- <a-button class="editable-add-btn" @click="createLabel">
        添加标签
    </a-button> -->
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 600 }"
        rowKey="id"
        :pagination="pagination"
      >
        <template slot="enabled" slot-scope="text, record">
          <div>{{ record.status ? "正常" : "异常" }}</div>
        </template>
        <template slot="label_name" slot-scope="text, record">
          <div class="colorlabel">
            <a-tag :color="record.color"> {{ record.label_name }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a style="margin-left: 5px" @click="editCloumn(record)">编辑</a>
          <a
            style="margin-left: 5px; color: red"
            @click="deleteCloumn(record.id)"
            >删除</a
          >
        </template>
      </a-table>
      <!-- 创建or编辑标签 -->
      <a-modal
        v-model="dialogVisible"
        title="添加标签"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitForm('form')"
      >
        <a-form-model layout="vertical" :model="form" ref="form" :rules="rules">
          <a-form-model-item label="标签名称" prop="label_name">
            <a-input v-model="form.label_name" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item label="标签颜色">
            <div class="color">
              <div
                class="color-item"
                :class="item == form.color ? 'active' : ''"
                @click="choiceColor(item)"
                v-for="item in colorlist"
                :key="item"
                :style="{ background: item }"
              ></div>
            </div>
          </a-form-model-item>
          <a-form-model-item label="状态">
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
  getLabelList,
  addLabels,
  editLabels,
  deleteLabels,
} from "@/api/specfation";
export default {
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
  data() {
    return {
      data: [],
      colorlist: [
        "#f5b148",
        "#999999",
        "#e8f6b2",
        "#d6839e",
        "#e8f6b1",
        "#6df083",
        "#3a1a4f",
        "#900c",
        "#852eaf",
        "#54deac",
        "#3f4a9c",
        "#666adb",
        "#13b464",
        "#1127e1",
        "#f2b240",
        "#6d5c36",
        "#e7a65e",
        "#25f4ab",
        "#67f5bd",
        "#8d9792",
      ],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 100,
        },
        {
          title: "标签名称",
          scopedSlots: { customRender: "label_name" },
        },
        {
          title: "点击数",
          dataIndex: "thumbs_count",
          key: "thumbs_count",
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          key: "create_time",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "enabled" },
        },
        {
          title: "操作",
          fixed: "right",
          width: 150,
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
      form: {
        label_name: "",
        status: 0,
        color: "#f5b148",
      },
      rules: {
        label_name: [
          { required: true, message: "请输入标签名称", trigger: "change" },
        ],
        color: [
          {
            required: true,
            message: "请选择标签颜色",
            trigger: "change",
          },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
      getLabelList({ page: current, size: pageSize })
        .then((res) => {
          if (res.code == 5200) {
            this.listLoading = false;
            this.data = res.data.rows;
            this.total = res.data.count;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //选择标签颜色
    choiceColor(val) {
      console.log(val);
      this.form.color = val;
    },
    // 创建标签
    createLabel() {
      // Object.assign(this.$data.form,this.$options.data.form)
      Object.assign(this.$data.form, this.$options.data().form);
      const { status } = this.form;
      this.form.status = status == 0 ? false : true;
      this.dialogVisible = true;
    },
    // 编辑标签
    editCloumn(record) {
      this.form = JSON.parse(JSON.stringify(record));
      const { status } = this.form;
      this.form.status = status == 0 ? false : true;
      this.dialogVisible = true;
    },
    // 状态切换
    isShowChange(val) {
      this.form.status = val ? 1 : 0;
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            editLabels(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message);
                this.dialogVisible = false;
                this.getList();
              }
            });
          } else {
            addLabels(this.form).then((res) => {
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
    deleteCloumn(id) {
      let _this = this;
      this.$antconfirm({
        title: "确认删除分享信息？",
        content: "删除分享后不能恢复，商城内也不在展示是否继续删除操作。",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          deleteLabels({ id }).then((res) => {
            if (res.code === 5200) {
              _this.$antmessage.success(res.message);
              _this.getList();
            }
          });
        },
        onCancel() {
          _this.$antmessage.info("取消删除");
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
@import url("../../styles/page-public.less");
a {
  color: #1890ff;
}
.color {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .color-item {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-bottom: 5px;
    // border: 1px solid #bfbfbf;
  }
  .active {
    border: 2px solid #1890ff;
  }
}
</style>
