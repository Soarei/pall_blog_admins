<template>
  <div class="wrap">
    <div class="app-title">
      <h2>更新日志</h2>
    </div>
    <div class="app-container">
      <div class="search">
        <span class="btnConfig">
          <a-button type="primary" @click="updateMessage">同步更新</a-button>
        </span>
      </div>
      <a-table
        :columns="columns"
        :data-source="list"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ x: 600 }"
      >
        <template slot="requestTime" slot-scope="text, record">
          <a-tag :color="record.requestTime | formatRq">{{
            record.requestTime + "ms"
          }}</a-tag>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { updateMessage, getGithubList } from "@/api/logs/index";
import Pagination from "@/components/Pagination/index.vue";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      listLoading: false,
      list: [],
      columns: [
        {
          title: "ID",
          dataIndex: "sha",
          key: "sha",
          width: 300,
        },
        {
          title: "操作人",
          dataIndex: "author",
          key: "author",
        },
        {
          title: "邮箱",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "提交备注",
          dataIndex: "message",
          key: "message",
        },
        {
          title: "提交时间",
          dataIndex: "commit_time",
          key: "commit_time",
        },
      ],
      pagination: {
        position: "bottom",
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
        onShowSizeChange: (current, pageSize) =>
          this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize), //点击页码事件
      },
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    updateMessage() {
      updateMessage().then((res) => {
        console.log(res);
      });
    },
    getList() {
      const { current, pageSize } = this.pagination;
      getGithubList({ page: current, size: pageSize }).then((res) => {
        if (res.code === 5200) {
          this.list = res.data.rows;
          this.pagination.total = res.data.count;
        }
      });
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current;
      this.getList();
    },
  },
  filters: {
    formatRq(data) {
      if (data > 50) {
        return "red";
      } else {
        return "blue";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../styles/page-public.less");
</style>
