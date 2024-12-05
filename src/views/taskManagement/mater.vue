<template>
  <div class="wrap">
    <div class="app-title">
      <h2>素材库</h2>
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
        >
          <template slot="goodsPicture" slot-scope="text, record">
            <img
              :src="record.url"
              alt="暂无图片"
              style="width: 50px; height: 50px"
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
      v-if="settintModal.visable"
      title="添加素材"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm('form')"
      @cancel="cancel"
      option-label-prop="label"
      width="600px"
    >
      <a-spin :spinning="collectIng">
        <a-form-model layout="vertical" :model="form" ref="form" :rules="rules">
          <a-form-model-item label="习惯名称" prop="name">
            <a-input
              placeholder="请输入习惯名称"
              v-model="form.name"
              style="width: 70%"
            />
          </a-form-model-item>
          <a-form-model-item label="上传素材" prop="url">
            <a-upload
              name="file"
              list-type="picture-card"
              :multiple="false"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="uploadInter"
              :headers="headers"
              :fileList="fileList"
              @change="uploadChange"
              v-decorator="[
                'url',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
            >
              <img
                v-if="form.catgory_icon"
                :src="form.catgory_icon"
                alt="avatar"
                style="width: 80px; height: 80px"
              />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="打卡周期">
            <a-checkbox-group
              v-model="form.cycle"
              :options="plainOptions"
              @change="onChange"
            />
          </a-form-model-item>
          <a-form-model-item label="打卡时长">
            <a-config-provider :locale="zh_CN">
              <a-range-picker
                @change="onChangeDate"
                style="width: 70%"
                v-model="form.punchTimes"
              />
            </a-config-provider>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import {
  columns,
  searchOptions,
  renderButton,
  plainOptions,
  formRules,
} from "./column";
import { uploadInter } from "@/api/article/upload";
import { getHabitsRespons } from "@/api/task/index";
import { getToken } from "@/utils/auth";
import SearchForm from "../../components/Antd/SearchForm.vue";
import zh_CN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";

export default {
  components: { SearchForm },
  data() {
    return {
      spinning: false,
      collectIng: false,
      columns,
      searchOptions,
      renderButton,
      zh_CN,
      list: [],
      rules: formRules,
      plainOptions,
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
      form: {
        cycle: [0, 1, 2, 3],
        punchTimes: [
          moment().format("YYYY-MM-DD"),
          moment().add(7, "days").format("YYYY-MM-DD"),
        ],
      },
      settintModal: {
        visable: false,
      },
      uploadInter,
      loading: false,
      fileList: [],
      headers: {
        token: getToken(),
      },
      defaultValue: [],
    };
  },
  methods: {
    handleFilter() {
      this.getList();
    },
    handleRowsImport() {},
    addCourese() {
      this.settintModal.visable = true;
    },
    uploadChange({ file, fileList }) {
      this.fileList = fileList;
      if (file.status === "uploading") {
        this.loading = true;
        return false;
      }
      if (file.status === "done") {
        this.form.catgory_icon = file.response.data.url;
        this.loading = false;
      }
    },
    onChange(e) {
      console.log(e);
    },
    onChangeDate(e) {
      console.log(e);
    },
    cancel() {
      this.settintModal.visable = false;
    },
    getList() {
      getHabitsRespons().then((res) => {
        this.list = res.data;
        console.log(this.list);
      });
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
