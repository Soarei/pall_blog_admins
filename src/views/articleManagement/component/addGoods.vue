<template>
  <div class="wrap">
    <div class="page-header">
      <div class="header-left">
        <a-button class="cancel-btn" @click="cancelForm">
          <left-outlined />返回
        </a-button>
        <div class="divider"></div>
        <h2>写文章</h2>
      </div>
      <div class="header-right">
        <a-button>存草稿</a-button>
        <a-button type="primary" @click="submitForm">
          <check-outlined />发布文章
        </a-button>
      </div>
    </div>

    <div class="article-form-container">
      <a-form
        :form="addGoodsForm"
        @submit="submitForm"
        ref="form"
        class="article-form"
        layout="vertical"
      >
        <a-input
          v-model="addGoodsForm.article_title"
          placeholder="输入文章标题..."
          class="title-input"
          :maxLength="100"
          :bordered="false"
        />

        <div class="article-meta-wrapper">
          <div class="meta-label">
            <span class="dot"></span>
            <span>文章信息</span>
          </div>
          <div class="article-meta">
            <a-select
              v-model="addGoodsForm.catgory_id"
              placeholder="选择分类"
              class="category-select"
              size="middle"
              :bordered="false"
            >
              <a-select-option
                v-for="item in categoryList"
                :key="item.catgory_id"
                :value="item.catgory_id"
              >
                {{ item.catgory_name }}
              </a-select-option>
            </a-select>

            <a-select
              mode="multiple"
              v-model="addGoodsForm.tags"
              placeholder="添加标签"
              class="tags-select"
              size="middle"
              :bordered="false"
              :maxTagCount="3"
              :maxTagTextLength="10"
            >
              <a-select-option
                v-for="item in labelList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.label_name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="cover-upload">
          <div class="upload-title">
            <span>封面图</span>
            <span class="upload-tip"
              >支持 jpg、png 格式，建议尺寸 1200x400</span
            >
          </div>
          <a-upload-dragger
            name="file"
            :multiple="false"
            action="/api/admin/upload/uploadFile"
            :headers="headers"
            @change="handleChange"
            @preview="handlePreview"
            class="upload-area"
          >
            <div class="upload-content">
              <picture-outlined />
              <p>点击或拖拽上传封面图片</p>
            </div>
          </a-upload-dragger>
        </div>

        <div class="editor-container">
          <Toolbar
            class="editor-toolbar"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            class="editor-content"
            v-model="addGoodsForm.article_content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>

        <div class="publish-settings">
          <h3>发布设置</h3>
          <div class="settings-content">
            <div class="setting-item">
              <span class="setting-label">发布时间</span>
              <a-date-picker
                v-model="addGoodsForm.release_time"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
            <div class="setting-item">
              <span class="setting-label">推荐等级</span>
              <a-rate v-model="addGoodsForm.level" :count="4" />
            </div>
          </div>
        </div>
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
      addGoodsForm: {},
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
      toolbarConfig: {
        toolbarKeys: [
          "headerSelect",
          "bold",
          "italic",
          "underline",
          "through",
          "|",
          "bulletedList",
          "numberedList",
          "todo",
          "|",
          "justifyLeft",
          "justifyCenter",
          "justifyRight",
          "|",
          "insertLink",
          "insertImage",
          "insertTable",
          "codeBlock",
          "|",
          "undo",
          "redo",
        ],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        autoFocus: false,
        scroll: true,
        maxLength: 100000,
        MENU_CONF: {
          uploadImage: {
            server: "/api/admin/upload/uploadFile",
            fieldName: "file",
            headers: {
              token: getToken(),
            },
            maxFileSize: 5 * 1024 * 1024, // 5M
            allowedFileTypes: ["image/*"],
            customInsert(res, insertFn) {
              if (res.code === 5200) {
                insertFn(res.data.url, "", res.data.url);
              }
            },
          },
        },
      },
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
      this.addGoodsForm.catgory_id = Number(this.editForm.catgory_id);
      this.addGoodsForm.level = Number(this.addGoodsForm.level);
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
      console.log(this.editor);
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
      this.editImg[type] = imgList;
    },
  },
  watch: {
    closeCascader: function () {
      if (this.$refs.cascaderRef) {
        this.$refs.cascaderRef.closeVisible = false;
      }
    },
    editForm: function () {
      this.getCategoryList();
      this.getLabels();
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
@primary-color: #ca0c16;
@secondary-color: #f5f6f7;
@border-color: #e4e6eb;
@text-primary: #222226;
@text-secondary: #515767;
@text-light: #86909c;

.wrap {
  min-height: 100vh;
  background-color: @secondary-color;
}

.page-header {
  padding: 12px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid @border-color;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .divider {
      width: 1px;
      height: 24px;
      background: @border-color;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: @text-primary;
    }
  }

  .header-right {
    display: flex;
    gap: 12px;

    .ant-btn {
      height: 36px;
      padding: 0 20px;

      &.ant-btn-primary {
        background: @primary-color;
        border-color: @primary-color;

        &:hover {
          background: darken(@primary-color, 10%);
          border-color: darken(@primary-color, 10%);
        }
      }
    }
  }
}

.article-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  margin-top: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.title-input {
  margin-bottom: 20px;
  font-size: 36px;
  font-weight: 500;
  border: none;
  padding: 0;
  margin: 0 0 40px;
  color: @text-primary;

  &::placeholder {
    color: @text-light;
  }

  &:focus {
    box-shadow: none;
  }
}

.article-meta-wrapper {
  background: @secondary-color;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 32px;

  .meta-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    .dot {
      width: 6px;
      height: 6px;
      background: @primary-color;
      border-radius: 50%;
    }

    span {
      font-size: 15px;
      font-weight: 500;
      color: @text-primary;
    }
  }
}

.article-meta {
  display: flex;
  gap: 16px;

  .category-select {
    width: 200px;

    :deep(.ant-select-selector) {
      background: transparent;
      border-color: @border-color;

      &:hover {
        background: #fff;
        border-color: @primary-color;
      }
    }
  }

  .tags-select {
    width: 400px;

    :deep(.ant-select-selector) {
      background: transparent;
      border-color: @border-color;

      &:hover {
        background: #fff;
        border-color: @primary-color;
      }

      .ant-select-selection-item {
        background: fade(@primary-color, 8%);
        border: none;
        border-radius: 4px;
        color: darken(@primary-color, 10%);
      }
    }
  }
}

.cover-upload {
  margin-bottom: 32px;
  background: @secondary-color;
  padding: 24px;
  border-radius: 8px;

  .upload-title {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      color: @text-primary;
      font-weight: 500;
    }

    .upload-tip {
      color: @text-light;
      font-size: 12px;
      font-weight: normal;
    }
  }

  .upload-area {
    background: #fff;
    border: 2px dashed @border-color;
    border-radius: 4px;

    &:hover {
      border-color: @primary-color;
    }

    .upload-content {
      padding: 32px;
      text-align: center;
      color: @text-secondary;

      .anticon {
        font-size: 28px;
        margin-bottom: 12px;
        color: @text-light;
      }
    }
  }
}

.editor-container {
  border: 1px solid @border-color;
  border-radius: 4px;
  overflow: hidden;
  margin: 24px 0 32px;
  background: #fff;
}

.editor-toolbar {
  border-bottom: 1px solid @border-color;
  background: #fff;
  padding: 8px;
}

.editor-content {
  min-height: 600px;
  overflow-y: auto;
  padding: 32px 40px;
  line-height: 1.8;
  color: @text-primary;
}

.publish-settings {
  background: @secondary-color;
  border-radius: 8px;
  padding: 32px;

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: @text-primary;
  }

  .settings-content {
    display: flex;
    gap: 48px;
  }

  .setting-item {
    display: flex;
    align-items: center;
    gap: 16px;

    .setting-label {
      color: @text-secondary;
      min-width: 70px;
    }

    .ant-rate {
      color: @primary-color;
    }
  }
}

:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 4px;
  border-color: @border-color;

  &:hover,
  &:focus {
    border-color: @primary-color;
  }
}

:deep(.ant-form-item-label) {
  label {
    font-size: 14px;
    color: @text-secondary;
  }
}
</style>
