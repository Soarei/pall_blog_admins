<template>
  <div class="wrap">
    <div class="app-title">
      <h2>商品列表</h2>
      <a-button @click="openSettingModal" class="submit">测试淘宝</a-button>
      <a-button type="primary" @click="addCourese">添加音色</a-button>
    </div>
    <div class="app-container">
      <SearchForm
        :searchOptions="searchOptions"
        :renderButton="renderButton"
        @handleFilter="handleFilter"
        @handleRowsImport="handleRowsImport"
      ></SearchForm>
      <a-spin :spinning="spinning">
        <a-table
          :columns="columns"
          :data-source="list"
          rowKey="id"
          :pagination="pagination"
          :scroll="{ x: 600 }"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
        >
          <template slot="goodsPicture" slot-scope="text, record">
            <img
              :src="record.goodsPicture"
              alt="暂无图片"
              style="width: 50px"
            />
          </template>
          <template slot="status" slot-scope="text, record">
            <a-tag color="#87d068"
              >{{ computeGoodStatus(record.status) }}
            </a-tag>
          </template>
          <template slot="collectUrl" slot-scope="text, record">
            <span style="color: #1890ff"> {{ record.collectUrl }} </span>
          </template>
          <template slot="action" slot-scope="text, record">
            <a
              style="margin-left: 5px; color: #1890ff"
              @click="collectSign(record)"
              >采集到TK</a
            >
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
      title="采集设置"
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
          <a-form-item label="采集网址">
            <a-input
              placeholder="请输入网址"
              v-decorator="[
                'goodsUrl',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="是否过滤包邮">
            <a-radio-group
              name="radioGroup"
              :default-value="1"
              v-decorator="[
                'isFreeShip',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
            >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="3">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="采集方式">
            <a-radio-group
              name="radioGroup"
              :default-value="1"
              v-decorator="[
                'type',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
            >
              <a-radio :value="1">批量采集</a-radio>
              <a-radio :value="3">单品采集</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import {
  getGoodsList,
  deleteGoods,
  colletSignGoods,
  colletTaobaoGoods,
} from "@/api/platform/auto";
import { addCollectionGoods, addTaobao } from "@/api/platform/course";
import { columns, searchOptions, renderButton } from "./data";
import SearchForm from "../../components/Antd/SearchForm.vue";
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
    getList(params) {
      const { pageSize, current } = this.pagination;
      this.spinning = true;
      getGoodsList({
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
    submitAudio() {
      this.spinning = true;
      addCollectionGoods({ url: this.goodsUrl }).then((res) => {
        this.$notification.success("采集成功");
        this.spinning = false;
      });
    },
    addCourese() {},
    // 单品采集
    collectSign(record) {
      this.spinning = true;
      colletSignGoods({ id: record.id, collectUrl: record.collectUrl })
        .then((res) => {
          this.$notify.success("成功");
          this.spinning = false;
          this.getList();
        })
        .catch((err) => {
          this.spinning = false;
        });
    },
    // 批量采集
    handleRowsImport() {
      const list = this.list.filter((item) => {
        return this.selectedRowKeys.includes(item.id);
      });
      if (
        list.findIndex((item) => {
          return item.status == 1;
        }) != -1
      ) {
        this.$notify.error("选择商品含有已采集的商品");
        return;
      }
      this.spinning = true;
      colletSignGoods({ goodslist: list }).then((res) => {
        this.$notify.success("成功");
        this.spinning = false;
        this.getList();
      });
    },
    // 删除商品
    deleteGoods(record) {
      this.spinning = true;
      deleteGoods({ id: record.id }).then((res) => {
        this.$notify.success("删除成功");
        this.spinning = false;
        this.pagination.current = 1;
        this.getList();
      });
    },
    // 采集设置
    openSettingModal() {
      this.settintModal.visable = true;
      this.goodsUrl = "";
    },
    submitForm(form) {
      this.collectIng = true;
      const goodsUrl = this.form.getFieldValue("goodsUrl");
      colletTaobaoGoods({ goodsUrl })
        .then((res) => {
          this.collectIng = false;
          console.log(res);
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
<style lang="less" scoped src="../../styles/page-public.less"></style>

<style scoped lang="less">
.ant-form-vertical .ant-form-item {
  margin-bottom: 12px;
}
</style>
