<template>
  <div class="wrap">
    <div class="app-title">
      <h2>管理员列表</h2>
    </div>
    <div class="app-container">
      <!-- <a-button class="editable-add-btn" @click="createLabel">
        添加标签
    </a-button> -->
      <div class="search">
        <div class="serachItem">
          <a-input
            placeholder="用户账号或用户昵称"
            v-model="searchForm.user_account"
          ></a-input>
        </div>
        <span class="btnConfig">
          <a-button type="primary" @click="getList">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </span>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1000 }"
        rowKey="user_id"
        :pagination="pagination"
      >
        <template slot="user_avatar" slot-scope="text, record">
          <img
            :src="record.user_avatar"
            alt=""
            srcset=""
            style="width: 50px; height: 50px"
          />
        </template>
        <template slot="roles" slot-scope="text, record">
          <a-tag
            v-for="(item, index) in record.roles"
            :key="index"
            :color="item | formatRoles"
            >{{ item }}</a-tag
          >
        </template>
        <template slot="status" slot-scope="text, record">
          {{ record.status === 0 ? "正常" : "异常" }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a style="margin-left: 5px" @click="distriBution(record)">分配角色</a>
          <a style="margin-left: 5px" @click="frozenCloumn(record)">{{
            record.status === 0 ? "冻结" : "解冻"
          }}</a>
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
          <a-form-model-item label="状态">
            <a-switch
              :default-checked="form.status"
              @change="isShowChange"
              size="small"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 分配角色 -->
      <a-modal
        v-model="roleVisable"
        title="分配角色"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitFormRole"
      >
        <a-checkbox-group v-model="roleChecked">
          <a-checkbox v-for="item in roleList" :value="item.id" :key="item.id">
            {{ item.name }}
          </a-checkbox>
        </a-checkbox-group>
      </a-modal>
    </div>
  </div>
</template>

<script>
import {
  getAdminUser,
  updateAdminStatus,
  getRoles,
  getUserRolesIds,
  updateRolesAuth,
  distributeRoles,
} from "@/api/menus/roles";
import searchForm from "@/components/Antd/Search/index.vue";
export default {
  components: {
    searchForm,
  },
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
      columns: [
        {
          title: "ID",
          dataIndex: "user_id",
          key: "user_id",
          width: 100,
        },
        {
          title: "用户头像",
          scopedSlots: { customRender: "user_avatar" },
          width: 100,
        },
        {
          title: "用户账号",
          dataIndex: "user_account",
          key: "user_account",
          width: 150,
        },
        {
          title: "用户昵称",
          dataIndex: "user_name",
          key: "user_name",
          width: 150,
        },
        {
          title: "角色",
          scopedSlots: { customRender: "roles" },
          width: 150,
        },
        {
          title: "状态",
          scopedSlots: { customRender: "status" },
          width: 150,
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          width: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          width: 200,
          fixed: "right",
        },
      ],
      searchForm: {
        user_account: "",
        user_name: "",
      },
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
      },
      rules: {
        label_name: [
          { required: true, message: "请输入标签名称", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      roleVisable: false,
      roleList: [],
      roleChecked: [],
    };
  },
  created() {
    this.getList();
    this.getRoles();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const { current, pageSize } = this.pagination;
      const params = { ...this.searchForm, page: current, size: pageSize };
      getAdminUser(params)
        .then((res) => {
          if (res.code == 5200) {
            this.listLoading = false;
            this.data = res.data.rows;
            this.pagination.total = res.data.count;
            this.data.forEach((item) => {
              if (item.roles) {
                item.roles = item.roles.split(",");
              } else {
                item.roles = [];
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 重置表单
    resetForm() {
      this.searchForm = this.$options.data().searchForm;
      this.getList();
    },
    // 编辑标签
    frozenCloumn(record) {
      var _this = this;
      this.form.status = record.status === 0 ? 1 : 0;
      this.form.user_id = record.user_id;
      this.$antconfirm({
        title: "确定冻结账户嘛？",
        content: "冻结账户后,该账户无法登录",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          updateAdminStatus(_this.form).then((res) => {
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
    // 分配角色
    distriBution(record) {
      this.roleVisable = true;
      this.form.user_id = record.user_id;
      getUserRolesIds({ user_id: record.user_id }).then((res) => {
        if (res.code === 5200) {
          this.roleChecked = res.data.roleIds.split(",").map((item) => {
            return (item = Number(item));
          });
        }
      });
    },
    // 获取所有角色
    getRoles() {
      getRoles({ page: 1, size: 10 }).then((res) => {
        if (res.code === 5200) {
          this.roleList = res.data.rows;
        }
      });
    },
    // 更新角色信息
    submitFormRole() {
      distributeRoles({
        roleIds: this.roleChecked,
        userId: this.form.user_id,
      }).then((res) => {
        console.log(res);
      });
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
  filters: {
    formatRoles(item) {
      if (item === "超级管理员") {
        return "pink";
      }
      return "blue";
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
