<template>
  <div class="wrap">
    <div class="app-title">
      <h2>敏感词管理</h2>
      <a-button type="primary" @click="addSensitive">添加敏感词</a-button>
    </div>
    <div class="app-container">
      <SearchForm
        :searchOptions="searchOptions"
        :renderButton="renderButton"
        @handleFilter="handleFilter"
      ></SearchForm>
      <a-spin :spinning="spinning">
        <a-table
          :columns="columns"
          :data-source="list"
          rowKey="id"
          :pagination="pagination"
          :scroll="{ x: 600 }"
        >
          <template slot="action" slot-scope="text, record">
            <a
              style="margin-left: 10px; color: red"
              href="#"
              @click="deleteGoods(record)"
              >删除</a
            >
            <!-- <a-tag color="#87d068">{{ computeGoodStatus(record.status) }} </a-tag> -->
          </template>
        </a-table>
      </a-spin>
    </div>
    <!-- 采集商品 -->
    <a-modal
      v-model="settintModal.visable"
      title="添加违禁词"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm('form')"
      @cancel="cancel"
      option-label-prop="label"
      width="800px"
    >
      <a-spin :spinning="collectIng">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="违禁词：">
            <a-input
              placeholder="请输入违禁词"
              v-decorator="[
                'keywords',
                {
                  rules: [{ required: true, message: '请输入违禁词' }],
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import {
  getSenstiveList,
  insertSensitive,
  deleteSensitive,
} from "@/api/platform/sensitive";
import { columns, searchOptions, renderButton } from "./data";
import SearchForm from "@/components/Antd/SearchForm.vue";
export default {
  data() {
    return {
      goodsUrl: "",
      spinning: false,
      columns,
      searchOptions,
      searchParams: {},
      renderButton,
      list: [],
      selectedRowKeys: [],
      pagination: {
        position: "bottom",
        pageSize: 10,
        current: 1,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
        total: 1,
        onShowSizeChange: (current, pageSize) =>
          this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize), //点击页码事件
      },
      form: this.$form.createForm(this, { name: "coordinated" }),
      settintModal: {
        visable: false,
      },
      collectIng: false,
    };
  },
  components: {
    SearchForm,
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { pageSize, current } = this.pagination;
      console.log(pageSize, current);

      this.spinning = true;
      getSenstiveList({
        page: current,
        size: pageSize,
        ...this.searchParams,
      }).then((res) => {
        this.list = res.data.rows;
        this.pagination.total = res.data.count;
        this.spinning = false;
      });
    },
    handleFilter(params) {
      this.searchParams = { ...params };
      this.getList();
    },
    onSelectChange(rows) {
      this.selectedRowKeys = rows;
    },
    onPageChange(page, size) {
      this.pagination.current = page;
      this.pagination.pageSize = size;
      this.getList();
    },
    addSensitive() {
      this.settintModal.visable = true;
    },
    // 删除商品
    deleteGoods(record) {
      this.spinning = true;
      deleteSensitive({ id: record.id }).then((res) => {
        this.$notify.success("删除成功");
        this.spinning = false;
        this.pagination.current = 1;
        this.getList();
      });
    },
    submitForm(form) {
      this.collectIng = true;
      const keywords = this.form.getFieldValue("keywords");
      insertSensitive({ keywords })
        .then((res) => {
          this.collectIng = false;
          this.settintModal.visable = false;
          this.pagination.current = 1;
          this.getList();
        })
        .catch((error) => {
          this.collectIng = false;
          this.$notify.error("服务器开小差啦");
        });
    },
    // 取消弹窗
    cancel() {
      this.settintModal.visable = false;
      this.collectIng = false;
    },
  },
  computed: {
    computeGoodStatus() {
      return (data) => {
        switch (data) {
          case "0":
            return "未采集";
          case "1":
            return "采集成功";
          case "2":
            return "采集失败";
          case "3":
            return "未知";
        }
      };
    },
  },
};
</script>
<style lang="less" scoped src="../../../styles/page-public.less"></style>

<style scoped lang="less">
.ant-form-vertical .ant-form-item {
  margin-bottom: 12px;
}
</style>
