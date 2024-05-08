<template>
  <div class="wrap">
    <div class="app-title">
      <h2>登录日志</h2>
    </div>
    <div class="app-container">
      <div class="search">
        <div class="serachItem">
          <a-input placeholder="搜索操作人"></a-input>
        </div>
        <span class="btnConfig">
          <a-button type="primary" @click="getList">查询</a-button>
          <!-- <a-button style="margin-left:10px" >查询</a-button> -->
        </span>
      </div>
      <a-table :columns="columns" :data-source="list" rowKey="id" :pagination="pagination" :scroll="{ x: 600 }">
        <template slot="requestTime" slot-scope="text,record">
          <a-tag :color="record.requestTime | formatRq">{{record.requestTime+'ms'}}</a-tag>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { getLogList } from '@/api/logs/index'
import Pagination from '@/components/Pagination/index.vue'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      list: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 100
        },
        {
          title: '操作人',
          dataIndex: 'operation',
          key: 'operation',
        },
        {
          title: '请求接口',
          dataIndex: 'interlink',
          key: 'interlink',
        },
        {
          title: '请求方式',
          dataIndex: 'method',
          key: 'method',
        },
        {
          title: 'IP',
          dataIndex: 'host',
          key: 'host',
        },
        {
          title: 'IP来源',
          dataIndex: 'hostorigin',
          key: 'hostorigin',
        },
        {
          title: '请求耗时',
          scopedSlots: { customRender: 'requestTime' },
        },
        {
          title: '创建时间',
          dataIndex: 'asctime',
          key: 'asctime',
        },
      ],
      pagination: {
        position: 'bottom',
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize),//点击页码事件
      },
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const { current, pageSize } = this.pagination
      getLogList({ page: current, size: pageSize }).then(res => {
        if (res.code === 5200) {
          this.list = res.data.rows
          this.pagination.total = res.data.count
        }
      })
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current
      this.getList()
    }
  },
  filters: {
    formatRq(data) {
      if (data > 50) {
        return 'red'
      } else {
        return 'blue'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/page-public.less");
</style>