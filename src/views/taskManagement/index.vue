<template>
  <div class="wrap">
    <div class="app-title">
      <h2>任务列表</h2>
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
      <a-table
        :columns="columns"
        :data-source="datalist"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ x: 600 }"
      >
        <template slot="completed" slot-scope="text, record">
          <a-tag color="green" v-if="record.completed"> 完成 </a-tag>
          <a-tag color="gray" v-else> 未完成 </a-tag>
        </template>
        <template slot="taskicon" slot-scope="text, record">
          <img
            :src="record.taskicon"
            srcset=""
            style="width: 50px; height: 50px"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getTaskList, addTask } from "@/api/task/index";
import Pagination from "@/components/Pagination/index.vue";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      datalist: [],
      pagination: {
        page: 1,
        size: 10,
      },
      columns: [
        {
          title: "任务名称",
          dataIndex: "taskname",
          key: "taskname",
        },
        {
          title: "任务周期",
          dataIndex: "clockhabit",
          key: "clockhabit",
        },
        {
          title: "任务状态",
          scopedSlots: { customRender: "completed" },
        },
        {
          title: "任务图标",
          scopedSlots: { customRender: "taskicon" },
        },
        {
          title: "开始时间",
          dataIndex: "startdate",
          key: "startdate",
        },
        {
          title: "结束时间",
          dataIndex: "duedate",
          key: "duedate",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getTaskList({ page: 1, size: 10 }).then((res) => {
        this.datalist = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../styles/page-public.less");
</style>
