<template>
  <div class="wrap">
    <div class="app-title">
      <h2>音色管理</h2>
      <a-button type="primary" @click="addCourese">添加音色</a-button>
    </div>
    <div class="app-container">
      <SearchForm
        :searchOptions="searchOptions"
        :renderButton="renderButton"
        @handleFilter="handleFilter"
      ></SearchForm>
      <a-table
        :columns="columns"
        :data-source="list"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ x: 600 }"
      >
        <template slot="stylelist" slot-scope="text, record">
          <!-- <a-rate :value="record.level" disabled :count="3" /> -->
          <a-tag
            v-for="item in computeStyle(record.stylelist)"
            :key="item.id"
            >{{ item.label }}</a-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="action" slot-scope="text, record">
          <a
            style="margin-left: 5px; color: #1890ff"
            @click="editProblem(record)"
            >配置情感</a
          >

          <a
            style="margin-left: 5px; color: #1890ff"
            @click="editProblem(record)"
            >编辑</a
          >
          <a-popconfirm
            title="您确定要删除这条记录吗"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteVoice(record.id)"
            @cancel="deleteCancel"
          >
            <a style="margin-left: 5px; color: red" href="#">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model="visible"
      :title="form.id ? '编辑' : '添加'"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm('form')"
      @cancel="cancel"
      option-label-prop="label"
    >
      <a-form-model
        layout="vertical"
        :model="form"
        ref="form"
        :rules="rules"
        :validateOnRuleChange="true"
      >
        <a-form-model-item label="音色Code" prop="voiceCode">
          <a-input v-model="form.voiceCode" placeholder="请输入音色Code" />
        </a-form-model-item>
        <a-form-model-item label="音色名称" prop="voiceName">
          <a-input v-model="form.voiceName" placeholder="请输入音色名称" />
        </a-form-model-item>
        <a-form-model-item label="所属类型" prop="type">
          <a-select v-model="form.type">
            <a-select-option value="男生">男生</a-select-option>
            <a-select-option value="女生">女生</a-select-option>
            <a-select-option value="儿童">儿童</a-select-option>
            <a-select-option value="老人">老人</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="风格/情感" prop="stylelist">
          <a-select v-model="form.stylelist" mode="multiple">
            <a-select-option
              v-for="item in emotionList"
              :key="item.id"
              :value="item.id"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  audioColumns,
  emotionList,
  audioSearchOptions,
  audiorenderButton,
} from "./data";
import { getVoiceList, addVoice, deleteVoice } from "@/api/platform/voice";
import { addCollectionGoods } from "@/api/platform/course";
import SearchForm from "@/components/Antd/SearchForm.vue";
export default {
  components: {
    SearchForm,
  },
  data() {
    return {
      // 搜索筛选项
      searchOptions: audioSearchOptions,
      renderButton: audiorenderButton,
      emotionList,
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
      list: [
        {
          voiceValue: "BV701_streaming",
          voiceName: "擎苍",
          id: 1,
          startTime: "2022-04-01 00:00:00",
        },
      ],
      columns: audioColumns,
      form: {
        voiceName: "",
        voiceCode: "",
        type: "男生",
        stylelist: [],
      },
      visible: false,
      rules: {},
      goodsUrl: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleFilter(params) {
      this.getList();
    },
    getList() {
      getVoiceList({ page: 1, size: 10 }).then((res) => {
        this.list = res.data.rows;
        this.pagination.total = res.data.count;
        this.visible = false;
      });
    },
    addCourese() {
      this.visible = true;
      this.form = {
        voiceName: "",
        voiceCode: "",
        type: "男生",
        stylelist: [],
      };
    },
    addtest() {
      addCollectionGoods({
        url: this.goodsUrl,
      }).then((res) => {
        console.log(res);
      });
    },
    submitForm(form) {
      const { voiceCode, voiceName, type, stylelist } = this.form;
      addVoice({
        voiceCode,
        voiceName,
        type,
        stylelist: stylelist.toString(),
      }).then((res) => {
        this.$notify.success("添加成功");
        this.getList();
      });
    },
    editProblem(record) {
      const row = JSON.parse(JSON.stringify(record));
      this.form = row;
      this.form.stylelist = row.stylelist.split(",");
      this.visible = true;
    },
    //取消
    cancel() {},
    // 删除
    deleteVoice(id) {
      deleteVoice({ id }).then((res) => {
        this.$notify.success("删除成功");
        this.getList();
      });
    },
    deleteCancel() {},
  },
  computed: {
    computeStyle() {
      return (data) => {
        if (!data) return "";
        return this.emotionList.filter((item) =>
          data.split(",").includes(item.id)
        );
      };
    },
  },
};
</script>

<style lang="less" scoped src="../../styles/page-public.less"></style>

<style scoped>
.ant-form-vertical .ant-form-item {
  margin-bottom: 12px;
}
</style>
