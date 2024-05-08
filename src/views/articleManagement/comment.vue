<template>
  <div class="wrap">
    <div class="app-title">
      <h2>评价列表</h2>
    </div>
    <div class="app-container">
      <!-- 查询条件 -->
      <div class="search">
        <div class="serachItem">
          <a-input placeholder="搜索关键词"></a-input>
          <a-input placeholder="搜索关键词"></a-input>
        </div>
        <span style="margin-left:10px">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left:10px">查询</a-button>
        </span>
      </div>
      <a-table :columns="columns" :data-source="commentList" rowKey="comment_id" :scroll="{ x: 1200 }" :expanded-row-keys.sync="expandedRowKeys" @expand="handleExpand">
        <a-tag color="blue" slot="parent_id" slot-scope="text, record"> {{ record.parent_id == 0 ? "一级" : "二级" }}</a-tag>
        <template slot="action" slot-scope="text, record">
          <a style="margin-left: 5px; color: red" @click="deleteMenus(record)">删除</a>
        </template>
        <!-- 嵌套子表格 -->
        <a-table slot="expandedRowRender" :columns="innerColumns" :data-source="innerData" :pagination="false">
          <a-tag color="blue" slot="parent_id" slot-scope="text, record"> {{ record.parent_id == 0 ? "一级" : "二级" }}</a-tag>
        </a-table>
      </a-table>
      <!-- 添加和编辑表单 -->
    </div>
  </div>

</template>

<script>
import { formatTreeList } from "@/utils/perrmisson";
import { getMenusList, deleteMenus } from "@/api/menus/menulist";
import { getCommentList, getSecondList } from "@/api/article/comment";
export default {
  data() {
    return {
      columns: [
        { title: "评价文章标题", dataIndex: "article_title", key: "article_title", width: 150 },
        {
          title: "评论等级",
          scopedSlots: { customRender: "parent_id" },
          width: 150,
        },
        {
          title: "评论内容",
          dataIndex: "comment_content",
          key: "comment_content",
          width: 300,
          ellipsis: true,
        },
        {
          title: "评论图",
          width:200
        },
        {
          title: "用户昵称",
          dataIndex: "user_name",
          key: "user_name",
          width: 200,
          ellipsis: true,
        },

        // { title: "回复评论人", dataIndex: "url", key: "url"},
        { title: "评论时间", dataIndex: "comment_time", key: "comment_time", width: 200, },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          width: 200,
        },
      ],
      innerColumns: [
        { title: "评价文章标题", dataIndex: "article_title", key: "article_title", width: 150 },
        {
          title: "评论等级",
          scopedSlots: { customRender: "parent_id" },
          width: 150,
        },
        {
          title: "评论内容",
          dataIndex: "comment_content",
          key: "comment_content",
          width: 300,
          ellipsis: true,
        },
        {
          title: "评论图",
          width:200
        },
        {
          title: "用户昵称",
          dataIndex: "user_name",
          key: "user_name",
          width: 200,
          ellipsis: true,
        },
        {
          title: "回复用户昵称",
          dataIndex: "reply_user_name",
          key: "reply_user_name",
          width: 200,
          ellipsis: true,
        },
        // { title: "回复评论人", dataIndex: "url", key: "url"},
        { title: "评论时间", dataIndex: "comment_time", key: "comment_time", width: 200 },
      ],
      menuList: [],
      commentList: [],
      data: [],
      expandedRowKeys: [],
      form: {},
      childInfo: {},
      innerData: [],
      expandedRowKeys: []
    };
  },
  methods: {
    createMenus() {
      this.$refs.modalmenus.isShow();
      // console.log(this.$refs.);
    },
    getCommentList() {
      getCommentList({}).then((res) => {
        if (res.code === 5200) {
          this.commentList = res.data;
        }
      });
    },
    // 查询子评论
    handleExpand(expanded, record) {
      let temp = []
      if (expanded) {
        temp.push(record.comment_id)
      }
      this.expandedRowKeys = temp
      getSecondList({ comment_id: record.comment_id }).then(res => {
        if (res.code === 5200) {
          this.innerData = res.data
        }
      })
    },
    addChildMenus(record) {
      this.$refs.modalmenus.isShow(JSON.parse(JSON.stringify(record)));
    },
    editChildMenus(record, action) {
      this.$refs.modalmenus.isShow(JSON.parse(JSON.stringify(record)), action);
    },
    // 删除菜单
    deleteMenus(record) {
      const { id } = record;
      let _this = this;
      this.$antconfirm({
        title: "确认删除菜单？",
        content: "删除菜单后不能恢复，平台内也不在展示是否继续删除操作。",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          deleteMenus({ id }).then((res) => {
            if (res.code === 5200) {
              _this.$antmessage.success("删除成功");
              _this.getList();
            }
          });
        },
        onCancel() {
          _this.$antmessage.info("取消删除");
        },
      });
    },
    getList() {
      getMenusList().then((res) => {
        if (res.code === 5200) {
          this.data = formatTreeList(res.data);
        }
      });
    },
  },
  created() {
    this.getCommentList();
  },
};
</script>

<style scoped lang="less">
a {
  color: #1890ff;
}
.wrap {
  .app-title{
    width: 90%;
    margin: 0 auto;
    padding: 20px 0;
    h2{
      font-weight: bold;
      margin-bottom: 0;
    }
  }
  .app-container {
    .search{
      padding: 10px 0;
      .serachItem{
        display: flex;
        display: inline-block;
        .ant-input{
          width: 200px;
          margin-right: 10px;
        }
      }
    }
    width: 90%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 5px;
  }
}
</style>