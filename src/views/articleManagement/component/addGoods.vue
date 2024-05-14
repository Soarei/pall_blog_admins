<template>
  <div class="wrap">
    <div class="app-title">
      <h2>添加文章</h2>
    </div>
    <!-- 内容 -->
    <div class="content">
      <a-form
        :form="addGoodsForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="submitForm"
        ref="form"
      >
        <a-form-item label="文章分类">
          <a-select
            v-model="addGoodsForm.catgory_id"
            placeholder="请选择文章分类"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in categoryList"
              :key="item.catgory_id"
              :value="item.catgory_id"
            >
              {{ item.catgory_name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            mode="multiple"
            v-model="addGoodsForm.tags"
            placeholder="请选择标签"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in labelList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label_name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="文章标题">
          <a-input
            v-model="addGoodsForm.article_title"
            placeholder="请输入文章标题"
          ></a-input>
        </a-form-item>
        <a-form-item label="文章封面">
          <a-upload-dragger
            name="file"
            :multiple="false"
            action="/api/admin/upload/uploadFile"
            :headers="headers"
            @change="handleChange"
            @preview="handlePreview"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p class="ant-upload-hint">
              支持单次或批量上传。严禁 上传公司数据或其他波段文件
            </p>
          </a-upload-dragger>
        </a-form-item>
        <!-- 发布时间 -->
        <a-form-item label="发布时间">
          <a-date-picker
            @change="onChange"
            v-model="addGoodsForm.release_time"
            style="width: 100%"
            :locale="locale"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <!-- 推荐等级 -->
        <a-form-item label="推荐等级">
          <a-rate v-model="addGoodsForm.level" :count="4" />
        </a-form-item>
        <a-form-item label="文章内容">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="addGoodsForm.article_content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit"> 确认发布 </a-button>
          <a-button type="info" style="margin-left: 20px" @click="cancelForm">
            返回文章
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import ImgListElement from "@/components/Cropper/imgList-cutting";
import ImgListElementLast from "@/components/Cropper/imgList-element2";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getToken } from "@/utils/auth";
import { addArticle, updateArticle } from "@/api/pall_article";
import { getAllLabels } from "@/api/specfation";
import { getCategoryList } from "@/api/category";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
export default {
  components: { ImgListElement, ImgListElementLast, Editor, Toolbar },
  props: {
    editForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      locale,
      activeName: "first",
      addGoodsForm: {
        level: 0,
      },
      editImg: {},
      sort: [],
      addGoodsRules: {
        catgory_id: [
          { required: true, message: "请选择文章分类", trigger: "blur" },
        ],
        article_title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur",
          },
        ],
        article_content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        release_time: [
          { required: true, message: "请输入发布时间", trigger: "blur" },
        ],
        level: [{ required: true, message: "请选择推荐等级", trigger: "blur" }],
      },
      fileList: [],
      headers: {
        token: getToken(),
      },
      categoryList: [],
      listQuery: {
        page: 1,
        size: 10,
      },
      // 富文本编辑器相关
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple',
      // 图片上传
      uploadImgSwiper: {
        cropperType: "",
        selectType: "",
        dialogSelectImgFromFile: false,
      },
      detailsImg: "detailsImg",
      labelList: [],
    };
  },
  created() {
    if (this.editForm.article_id) {
      this.addGoodsForm = this.editForm;
      console.log(this.addGoodsForm);
      this.addGoodsForm.catgory_id = Number(this.editForm.catgory_id);
    }
    this.getCategoryList();
    this.getLabels();
  },
  mounted() {
    setTimeout(() => {
      this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
    }, 1500);
  },
  methods: {
    onChange(val) {
      console.log(val);
    },
    // 获取商品分类列表
    getCategoryList() {
      getCategoryList(this.listQuery).then((res) => {
        if (res.code === 5200) {
          this.categoryList = res.data.rows;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取标签列表
    getLabels() {
      getAllLabels({}).then((res) => {
        if (res.code === 5200) {
          this.labelList = res.data;
        }
      });
    },

    handleSelect() {
      console.log(this.activeName);
    },
    // 跳转节点
    goAnchor(selector) {
      document.querySelector(selector).scrollIntoView(true);
    },
    handleUploadChange(res, file, fileList) {
      const { url } = file.response.data;
      this.addGoodsForm.article_cover = url;
    },
    handleRemove(file, fileList) {
      console.log(file);
      // let idx = this.fileList.findIndex((item) => item.uid == file.uid)
      // this.fileList.splice(idx, 1)
    },
    submitForm() {
      let _this = this;
      _this.$antconfirm({
        title: "提示",
        content: "您确认保存文章吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          if (_this.addGoodsForm.article_id) {
            updateArticle(_this.addGoodsForm).then((res) => {
              _this.$antmessage.success(res.message);
              _this.dialogVisible = false;
            });
          } else {
            addArticle(_this.addGoodsForm).then((res) => {
              _this.$antmessage.success(res.message);
              _this.dialogVisible = false;
            });
          }
        },
        onCancel() {},
      });
    },
    // 取消商品
    cancelForm() {
      this.$emit("closeDialog");
    },
    // 级联选择框
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        const { url } = info.file.response.data;
        this.addGoodsForm.article_cover = url;
      } else if (status === "error") {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
    },
    handlePreview(file) {},
    // 富文本编辑器相关
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // 图片上传相关
    deleteListImg(data) {
      console.log(data);
    },
    // 上传成功的事件
    successCropper(data, type, comIndex) {
      if (type && typeof type == "string") {
        this.uploadImgSwiper.cropperType = type;
      }
      switch (this.uploadImgSwiper.cropperType) {
        case "goodsThumb":
          this.$set(this.addGoodsForm.goodsThumb, "0", data.imgStr);
          break;
      }
    },
    selectMaterial(type) {
      this.uploadImgSwiper.selectType = type;
      this.uploadImgSwiper.dialogSelectImgFromFile = true;
    },
    // 拖拽图片后的更改
    dragEnd(data) {
      const imgList = data.imgStr;
      const type = data.type;
      // this.addGoodsForm[type] = imgList;
      this.editImg[type] = imgList;
    },
  },
  watch: {
    closeCascader: function () {
      if (this.$refs.cascaderRef) {
        this.$refs.cascaderRef.closeVisible = false;
      }
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style scoped lang="less">
@import url("../../../styles/page-public.less");
.app-title {
  width: 80% !important;
  margin: 0 auto;
}
.myMenu_item {
  display: block;
  height: 100%;
  text-align: center;
}
.el-menu--horizontal > .el-menu-item {
  width: 25%;
}
/* 内容样式 */
.content {
  width: 80%;
  margin: 0 auto;
  padding: 20px 0;
  background-color: #fff;
}
.mySubmit {
  margin: 20px 0;
}
.saveGoods {
  margin-left: 9%;
}
.mycasc .el-radio__inner {
  top: -18px;
  left: -19px;
  border-radius: 0;
  border: 0;
  width: 170px;
  height: 34px;
  background: transparent;
  cursor: pointer;
  box-sizing: border-box;
  position: absolute;
}
.mycasc .el-radio__input .is-checked .el-radio__inner {
  background: transparent;
}
</style>
