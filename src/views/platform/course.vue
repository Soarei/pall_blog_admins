<template>
  <div class="wrap">
    <!-- <uploadImage :uploadOption="uploadOption" /> -->
    <div class="app-title">
      <h2>轮播图设置</h2>
      <a-button type="primary" @click="addCourese">添加轮播图</a-button>
    </div>
    <div class="app-container">
      <a-table
        :columns="columns"
        :data-source="list"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ x: 600 }"
      >
        <template slot="address" slot-scope="text, record">
          <span style="color: #1890ff; cursor: pointer" class="copyKey">
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ record.address }}
              </template>
              {{ record.address }}
            </a-tooltip>
          </span>
        </template>
        <template slot="picture" slot-scope="text, record">
          <div style="width: 150px; height: 60px">
            <img
              :src="record.picture"
              alt="error"
              style="width: 150px; height: 60px"
            />
          </div>
        </template>
        <template slot="rangeTime" slot-scope="text, record">
          <div>{{ record.startTime }}</div>
          <div>{{ record.endTime }}</div>
        </template>
        <template slot="enabled" slot-scope="text, record">
          <span v-if="record.enabled" style="color: red">已关闭</span>
          <span v-else style="color: green">已开启</span>
        </template>
        <!-- 操作 -->
        <template slot="action" slot-scope="text, record">
          <a
            style="margin-left: 5px; color: #1890ff"
            @click="editProblem(record)"
            >编辑</a
          >
          <a
            style="margin-left: 5px; color: red"
            @click="deleteProblem(record.id)"
            >删除</a
          >
        </template>
      </a-table>
    </div>
    <!--添加或者编辑轮播图 -->
    <a-modal
      v-model="visible"
      title="添加轮播图"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm('form')"
      @cancel="cancelForm"
      option-label-prop="label"
    >
      <a-form-model
        layout="vertical"
        :model="form"
        ref="form"
        :rules="rules"
        :validateOnRuleChange="true"
      >
        <a-form-model-item label="轮播图" prop="picture">
          <uploadImage
            :uploadOption="uploadOption"
            @updateFilesList="updateFilesList"
            :picture="form.picture"
          ></uploadImage>
        </a-form-model-item>
        <a-form-model-item label="标题" prop="title">
          <a-input
            v-model="form.title"
            placeholder="请输入少于50字符文字，不填写默认为“未命名”"
          />
        </a-form-model-item>
        <a-form-model-item label="跳转地址" prop="address">
          <a-input
            v-model="form.address"
            placeholder="请输入http://或者https://开头链接"
          />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input v-model="form.sort" placeholder="请输入排序号" />
        </a-form-model-item>
        <a-form-model-item label="展示时间" prop="rangeTime">
          <a-space direction="horizontal">
            <a-config-provider :locale="zhCN">
              <a-range-picker
                :disabled-date="disabledDate"
                v-model="form.rangeTime"
                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-config-provider>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import uploadImage from "@/components/Antd/uploadImage.vue";
import {
  getCourseList,
  addCourseList,
  updateCourse,
  delCourse,
} from "@/api/platform/course";
export default {
  components: {
    uploadImage,
  },
  data() {
    let vaildUrl = (rule, value, callback) => {
      if (value.substr(0, 7) == "http://" || value.substr(0, 8) == "https://") {
        return true;
      } else {
        return callback("请输入http://或者https://开头链接");
      }
    };
    return {
      columns: [
        {
          title: " 标题",
          dataIndex: "title",
          key: "title",
          ellipsis: true,
          width: 150,
        },
        {
          title: "轮播图",
          scopedSlots: { customRender: "picture" },
          ellipsis: true,
          width: 150,
        },
        {
          title: "跳转地址",
          scopedSlots: { customRender: "address" },
          ellipsis: true,
          width: 200,
        },
        {
          title: "展示时间",
          scopedSlots: { customRender: "rangeTime" },
          ellipsis: true,
          width: 180,
        },
        {
          title: "排序",
          dataIndex: "sort",
          key: "sort",
          ellipsis: true,
          width: 85,
        },
        {
          title: "状态",
          scopedSlots: { customRender: "enabled" },
          ellipsis: true,
          width: 85,
        },
        {
          title: "操作",
          fixed: "right",
          width: 150,
          scopedSlots: { customRender: "action" },
        },
      ],
      list: [],
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
      visible: false,
      rules: {
        address: [{ required: true, validator: vaildUrl, trigger: "change" }],
        picture: [
          { required: true, message: "请上传轮播图", trigger: "change" },
        ],
        rangeTime: [
          { required: true, message: "请选择展示时间", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "change" }],
      },
      form: {},
      // 定义上传图片类型
      uploadOption: {
        name: "avatar",
        listType: "picture-card",
        showUploadlist: false,
        width: 390, //上传图片宽度的限制
        height: 260, //上传图片高度的限制
        imgSize: 3, //支持上传图片的大小,
        innerWidth: 200,
        innerHeight: 120,
        sizetax: "3:2",
      },
      zhCN,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { current, pageSize } = this.pagination;
      const params = {
        page: current,
        size: pageSize,
      };
      getCourseList(params).then((res) => {
        if (res.code === 5200) {
          this.list = res.data.list;
        }
      });
    },
    onSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    onPageChange(page, pageSize) {
      console.log(page, pageSize);
    },
    moment,
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },
    addCourese() {
      this.form = this.$options.data().form;
      this.visible = true;
    },
    /*
     *@description:接受上传组件传来的url
     *@author: pf
     *@date: 2022-12-27 11:02:16
     *@version: V1.0.5
     */
    updateFilesList(url) {
      console.log(url);
      this.form.picture = url;
    },
    /*
     *@description:插入or更新轮播图
     *@author: pf
     *@date: 2022-12-27 15:06:58
     *@version: V1.0.5
     */
    submitForm(form) {
      this.form.startTime = moment(this.form.rangeTime[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.form.endTime = moment(this.form.rangeTime[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            addCourseList(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success("添加成功");
                this.visible = false;
                this.getList();
              }
            });
          } else {
            updateCourse(this.form).then((res) => {
              if (res.code === 5200) {
                this.$antmessage.success("更新成功");
                this.visible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /*
     *@description:编辑轮播图
     *@author: pf
     *@date: 2022-12-27 15:07:14
     *@version: V1.0.5
     */
    editProblem(record) {
      this.form = JSON.parse(JSON.stringify(record));
      this.form.rangeTime = [record.startTime, record.endTime];
      this.visible = true;
    },
    /*
     *@description:删除
     *@author: pf
     *@date: 2022-12-28 19:05:46
     *@version: V1.0.5
     */
    deleteProblem(id) {
      let _this = this;
      this.$antconfirm({
        title: "确定删除轮播图？",
        content: "删除操作后，博客首页将不展示",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          delCourse({ id }).then((res) => {
            if (res.code === 5200) {
              _this.$antmessage.success("删除成功");
              let { current, total, pageSize } = _this.pagination;
              _this.pagination.current =
                (total - 1) % pageSize === 0 && _this.list.length === 1
                  ? current - 1
                  : current;
              _this.getList();
            }
          });
        },
        onCancel() {
          _this.$antmessage.info("取消删除");
        },
      });
    },
    cancelForm() {
      console.log("取消弹窗");
    },
  },
};
</script>

<style lang="less" scoped src="../../styles/page-public.less"></style>
<style lang="less" scoped></style>
