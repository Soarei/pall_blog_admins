<template>
  <div class="wrap">
    <div class="app-title">
      <h2>添加文章</h2>
    </div>
    <!-- 内容 -->
    <div class="content">
      <el-form :model="addGoodsForm" status-icon ref="addGoodsForm" label-width="150px" class="demo-ruleForm" :rules="addGoodsRules">
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="22">
            <el-form-item label="文章分类" prop="catgory_id">
              <el-select v-model="addGoodsForm.catgory_id" placeholder="请选择" style="width:100%;">
                <el-option v-for="item in categoryList" :key="item.catgory_id" :label="item.catgory_name" :value="item.catgory_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章标签" prop="catgory_id">
              <el-select v-model="addGoodsForm.tags" placeholder="请选择" style="width:100%;" multiple>
                <el-option v-for="item in labelList" :key="item.id" :label="item.label_name" :value="String(item.id)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章标题" prop="article_title">
              <el-input v-model="addGoodsForm.article_title"></el-input>
            </el-form-item>
            <el-form-item label="文章封面" prop="article_title">
              <el-upload class="upload-demo" drag action="/api/admin/upload/images" ref="uploadImg" :headers="headers" name="file" :file-list="fileList" :on-success="handleUploadChange" :limit="1" list-type="picture">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="推荐等级" prop="level">
              <el-radio-group v-model="addGoodsForm.level">
                <el-radio :label="0">一级推荐</el-radio>
                <el-radio :label="1">二级推荐</el-radio>
                <el-radio :label="2">三级推荐</el-radio>
                <el-radio :label="3">四级推荐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布时间" prop="release_time">
              <el-date-picker v-model="addGoodsForm.release_time" type="datetime" placeholder="选择日期时间" style="width:60%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="文章内容" prop="article_content">
              <div style="border: 1px solid #ccc;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
                <Editor style="height: 600px; overflow-y: hidden;" v-model="addGoodsForm.article_content" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mySubmit">
        <el-button @click="submitForm" type="primary" class="saveGoods">保存文章</el-button>
        <el-button @click="cancelForm" type="info" class="cancelGoods">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ImgListElement from "@/components/Cropper/imgList-cutting"
import ImgListElementLast from "@/components/Cropper/imgList-element2"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getToken } from '@/utils/auth'
import { addArticle,updateArticle } from '@/api/pall_article'
import { getAllLabels } from '@/api/specfation'
import { getCategoryList } from '@/api/category'
export default {
  components: { ImgListElement, ImgListElementLast, Editor, Toolbar },
  props: {
    editForm: {
      type: Object,
      default: function () {
        return {
        }
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      addGoodsForm: {
        level: 0
      },
      editImg: {},
      sort: [],
      addGoodsRules: {
        catgory_id: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
        article_title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        article_content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        release_time: [{ required: true, message: '请输入发布时间', trigger: 'blur' }],
        level: [{ required: true, message: '请选择推荐等级', trigger: 'blur' }]
      },
      fileList: [],
      headers: {
        token: getToken(),
      },
      categoryList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      // 富文本编辑器相关
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple',
      // 图片上传
      uploadImgSwiper: {
        cropperType: '',
        selectType: '',
        dialogSelectImgFromFile: false
      },
      detailsImg: "detailsImg",
      labelList: []
    }
  },
  created() {
    if (this.editForm.article_id) {
      this.addGoodsForm = this.editForm
      console.log(this.addGoodsForm);
      this.addGoodsForm.catgory_id = Number(this.editForm.catgory_id)
    }
    this.getCategoryList()
    this.getLabels()
  },
  mounted() {
    setTimeout(() => {
      this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    }, 1500)
  },
  methods: {
    // 获取商品分类列表
    getCategoryList() {
      getCategoryList(this.listQuery).then(res => {
        if (res.code === 5200) {
          this.categoryList = res.data.rows
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取标签列表
    getLabels() {
      getAllLabels({}).then(res => {
        if (res.code === 5200) {
          this.labelList = res.data
        }
      })
    },

    handleSelect() {
      console.log(this.activeName);
    },
    // 跳转节点
    goAnchor(selector) {
      document.querySelector(selector).scrollIntoView(true)
    },
    handleUploadChange(res, file, fileList) {
      const { url } = file.response.data
      this.addGoodsForm.article_cover = url
    },
    handleRemove(file, fileList) {
      console.log(file);
      // let idx = this.fileList.findIndex((item) => item.uid == file.uid)
      // this.fileList.splice(idx, 1)
    },
    handlePreview(file) {
      console.log(file);
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    // submitForm() {
    //   this.$confirm('您确认保存文章吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'success'
    //   }).then(() => {
    //     this.addGoodsForm.tags = this.addGoodsForm.tags.join()
    //     this.$refs['addGoodsForm'].validate(vaild => {
    //       if (vaild) {
    //         this.dialogVisible = true
    //         if(this.addGoodsForm.article_id){
    //           updateArticle(this.addGoodsForm).then(res=>{
    //             this.$message.success(res.message)
    //             this.dialogVisible = false
    //           })
    //         }else{
    //            addArticle(this.addGoodsForm).then(res=>{
    //             this.$message.success(res.message)
    //             this.dialogVisible = false
    //            })
    //         }
    //       }
    //     })
    //   }).catch((err) => {
    //     this.$message.info('取消文章添加')
    //   })
    // },
    submitForm() {
      let _this = this
      _this.$antconfirm({
        title: '提示',
        content: '您确认保存文章吗?',
        okText:'确定',
        cancelText:'取消',
        onOk() {
         _this.addGoodsForm.tags = _this.addGoodsForm.tags.join()
         if(_this.addGoodsForm.article_id){
            
            updateArticle(_this.addGoodsForm).then(res=>{
              _this.$antmessage.success(res.message)
              _this.dialogVisible = false
            })
          }else{
              addArticle(_this.addGoodsForm).then(res=>{
              _this.$antmessage.success(res.message)
              _this.dialogVisible = false
            })
          }
        },
        onCancel() {}
      })
    },
    // 取消商品
    cancelForm() {
      this.$emit('closeDialog')
    },
    // 级联选择框
    handleChange(val) {
      this.addGoodsForm.sort = val[val.length - 1]
    },
    // 富文本编辑器相关
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
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
        this.$refs.cascaderRef.closeVisible = false
      }
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
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