<template>
  <div class="wrap">
    <div class="app-title">
      <h2>角色列表</h2>
    </div>
    <div class="app-container">
      <!-- <a-button class="editable-add-btn" @click="createLabel">
        添加角色
    </a-button> -->
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
        <template slot="action" slot-scope="text, record">
          <a style="margin-left: 5px" @click="authMenus(record)">业务授权</a>
          <a style="margin-left: 5px" @click="editCloumn(record)">编辑</a>
          <!-- <a style="margin-left:5px;" @click="closeInfo(record)">{{record.enabled ? '关闭': '开启'}}</a> -->
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
        title="添加角色"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitForm('form')"
      >
        <a-form-model layout="vertical" :model="form" ref="form" :rules="rules">
          <a-form-model-item label="角色名称" prop="name">
            <a-input v-model="form.name" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item label="角色标识" prop="code">
            <a-input v-model="form.code" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item label="角色状态">
            <a-switch
              :default-checked="form.status"
              @change="isShowChange"
              size="small"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 业务授权 -->
      <a-drawer
        title="授权菜单"
        placement="right"
        :width="720"
        :closable="false"
        :visible="visible"
        @close="visible = false"
      >
        <a-tree
          checkable
          :checkStrictly="true"
          :auto-expand-parent="true"
          :tree-data="treeData"
          v-model="checkedKeys"
          @select="onSelect"
        />
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose">
            取消
          </a-button>
          <a-button type="primary" @click="updateRoles"> 更新 </a-button>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import {
  getRoles,
  getRolesAuth,
  updateRolesAuth,
  addRoles,
  deletRoles,
  editRoles,
} from "@/api/menus/roles";
import { formatTreeList } from "@/utils/perrmisson";
import { getMenusList } from "@/api/menus/menulist";
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
      menulist: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 100,
        },
        {
          title: "角色名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "用户标识",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          key: "create_time",
        },
        {
          title: "更新时间",
          dataIndex: "update_time",
          key: "update_time",
        },
        {
          title: "操作",
          dataIndex: "address",
          key: "address 7",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        position: "bottom",
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} 条`,
        onShowSizeChange: (current, pageSize) =>
          this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize), //点击页码事件
      },
      // 筛选条件
      dialogVisible: false,
      // 抽屉状态
      visible: false,
      form: {
        name: "",
        code: "",
        status: true,
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入角色标识", trigger: "change" },
        ],
      },
      // tree树形控件相关
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      roleId: "",
      allSelectedNodes: [],
    };
  },
  created() {
    this.getList();
    this.getMenusList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const { current, pageSize } = this.pagination;
      getRoles({ page: current, size: pageSize })
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
    getMenusList() {
      getMenusList().then((res) => {
        if (res.code === 5200) {
          this.treeData = formatTreeList(res.data);
        }
      });
    },
    // 创建标签
    createLabel() {
      // Object.assign(this.$data.form,this.$options.data.form)
      this.form = this.$options.data().form;
      const { status } = this.form;
      this.form.status = status == 0 ? false : true;
      this.dialogVisible = true;
    },
    // 授权菜单信息
    authMenus(record) {
      this.visible = true;
      const { id } = record;
      this.roleId = record.id;
      getRolesAuth({ id }).then((res) => {
        if (res.code === 5200) {
          const { menus } = res.data;
          if (!menus) {
            this.checkedKeys = [];
            this.expandedKeys = [];
          } else {
            const list = menus.split(",");
            const reslist = list.map((item) => {
              return (item = Number(item));
            });
            this.checkedKeys = reslist;
          }
        }
      });
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys;
    },
    // 更新角色信息
    updateRoles() {
      const { checked } = this.checkedKeys;
      updateRolesAuth({ roleId: this.roleId, list: checked }).then((res) => {
        if (res.code === 5200) {
          this.$antmessage.success(res.message);
          this.getMenusList();
          this.visible = false;
        }
      });
    },
    // 关闭抽屉回调
    onClose() {},
    // 编辑标签
    editCloumn(record) {
      this.form = JSON.parse(JSON.stringify(record));
      // const {status}  = this.form
      // this.form.status = status == 0 ? false : true
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
            editRoles(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message);
                this.dialogVisible = false;
                this.getList();
              }
            });
          } else {
            addRoles(this.form).then((res) => {
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
        title: "确认删除该角色？",
        content: "删除角色后不能恢复,是否继续删除操作。",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          deletRoles({ id }).then((res) => {
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
    // 树形控件相关方法
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
      console.log(this.checkedKeys);
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys;
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
