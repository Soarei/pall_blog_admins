<!-- 用elementui的upload插件上传图片的插件 -->

<template>
  <div class="imgListOut imgListOut2">
    <!-- 展示图片 -->
    <div class="show" :class="type == 'goodsThumb' ? 'showThumb' : ''" :style="type == 'goodsThumb' ? 'width:10%' : 'width:100%;'">
      <!-- <draggable v-model="myImgList" @end="dragEnd"> -->
      <div class="showInner">
        <draggable class="showInner2" :ref="refImg" v-model="myImgList" animation="1000" @end="dragEnd" v-if="goodsRowSupplyCode" draggable>
          <!-- <div @click.stop="selectCropper()" :keys="index" v-if="item" class="cropper-close-box myUpload" v-for="(item,index) in (maxImgLength == 2 ? 1 : (maxImgLength>10?10:maxImgLength))"> -->
          <div @click.stop="selectCropper()" class="cropper-close-box myUpload" :class="[index > 9 ? 'twoLinw' : '']" v-for="(item, index) in maxImgLength == 2 ? 1 : maxImgLength" :key="index">
            <div class="inner" ref="inner">
              <img
                v-if="imgList[index]"
                :ref="'smallImg_new' + type + index"
                @mouseover="imgHover(imgList[index], 'smallImg_new' + type + index)"
                @mouseout="imgMouseOut"
                class="cropper-preview"
                :src="imgList[index] ? imgList[index] : ''"
              />
              <!-- $t("goods." + type) -->
              <p v-if="!imgList[index]">不知道</p>
              <div v-if="showClose && imgList[index]" class="close-tailoring close-goodsCarousel" @click.stop.prevent="deleteImg(index)">
                ×
              </div>
            </div>
          </div>
        </draggable>
        <draggable class="showInner2" :ref="refImg" v-model="myImgList" animation="1000" @end="dragEnd" v-if="goodsRowSupplyCode?false:true">
          <!-- <div @click.stop="selectCropper()" :keys="index" v-if="item" class="cropper-close-box myUpload" v-for="(item,index) in (maxImgLength == 2 ? 1 : (maxImgLength>10?10:maxImgLength))"> -->
          <div @click.stop="selectCropper()" class="cropper-close-box myUpload" :class="[index > 9 ? 'twoLinw' : '']" v-for="(item, index) in maxImgLength == 2 ? 1 : maxImgLength" :key="index">
            <div class="inner" ref="inner">
              <img
                v-if="imgList[index]"
                :ref="'smallImg_new' + type + index"
                @mouseover="imgHover(imgList[index], 'smallImg_new' + type + index)"
                @mouseout="imgMouseOut"
                class="cropper-preview"
                :src="imgList[index] ? imgList[index] : ''"
              />
              <p v-if="!imgList[index]">不知道</p>
              <div v-if="showClose && imgList[index]" class="close-tailoring close-goodsCarousel" @click.stop.prevent="deleteImg(index)">
                ×
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <!-- </draggable> -->
    </div>
    <!-- 添加素材库图片 -->
    <el-upload v-show="false" ref="upload" action class="upload-demo" accept="image/*" :multiple="type == 'goodsThumb' ? false : true" :auto-upload="false" :on-change="uploadChange" :on-remove="uploadRemove" list-type="picture">
      <el-button ref="uploadBtn" size="small" type="primary">{{
        点击上传
      }}</el-button>
      <div slot="tip" class="el-upload__tip">
        格式：Png。尺寸：200*66px
      </div>
    </el-upload>
    <!-- 从素材库添加图片弹框 -->
    <!-- <el-dialog
      title="选择图片"
      :visible.sync="selectImgFromFile"
      width="80%"
      center
    >
      <material-manage ref="materialManage" :isComponent="isComponent" @selectFromFile="selectFromFile"></material-manage>
    </el-dialog>       -->
    <!-- 查看大图 -->
    <div ref="bigImg" class="bigImg">
      <img :src="bigImg" style="width: 400px" />
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { uploadImg } from "@/api/goods";
export default {
  props: {
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    actType: {
      type: Number,
      default() {
        /*轮播图： 2 / 描述图： 4,
        缩略图： 3, / 用户头像: 5*/
        return 4;
      }
    },
    type: {
      //是哪个类型的图片
      type: String,
      default: ""
    },
    maxImgLength: {
      //最大的图片数量够了就不能再传了
      type: Number,
      default: 10
    },
    showClose: {
      // 是否展示删除图片的按钮
      type: Boolean,
      default() {
        return true
      }
    },
    goodsRowSupplyCode: {
      // 判断是否是供应链商品
      type: Boolean,
      default() {
        return false
      }
    },
    indexKey: {
      //一些特殊情况要传下标，例如在sku的图片里面要传下标
      type: Number,
      default() {
        return 0
      }
    },
    refImg: {
      //图片父级，用来控制其高度不能超过2行图片的高度
      type: String,
      default: ""
    },
    isShowKu: {
      // 是否展示添加素材库按钮
      type: Boolean,
      default: true
    },
    indexTab: {
      // 如果在表格中使用需要当前行的index
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      canUseCropper: true,
      bigImg: "",
      isComponent: true, //展示素材库确定选好了图片的按钮
      myImgList: [],
      fileList: [],
      fixGoodsImg: {
        //这种图片类型的规格定义
        goodsThumb: { width: 800, height: 800 },
        carouselFigure: { width: 800, height: 800 },
        goodsDetailImage: { width: 800, maxheight: 2000 },
        combination: { width: 800, height: 800 },
        avatar: { width: 800, height: 800 },
        selectionGoodsDetailImage: { width: 800, maxheight: 2000 }
      }
    }
  },
  watch: {
    sidebar(n, o) {
      // 商品详情图高度优化
      let innerHeight = this.$refs.inner[0].offsetWidth
      if (this.$refs.detailsImg) {
        if (!n) {
          this.$refs.detailsImg.$el.style.height = innerHeight * 2 + 45 + "px"
        } else {
          this.$refs.detailsImg.$el.style.height = innerHeight * 2 + "px"
        }
      }
    },
    imgList(n, o) {
      if (n) {
        return (this.myImgList = n)
      } else {
        return (this.myImgList = o)
      }
    },
  },
  computed: {
    sidebar() {
      return this.$store.getters.sidebar.opened
    },
  },
  created() {
    this.myImgList = this.imgList
  },
  mounted() {
    // 商品详情图高度优化
    if (this.$refs.detailsImg) {
      let innerHeight = this.$refs.inner[0].offsetWidth
      this.$refs.detailsImg.$el.style.height = innerHeight * 2 + 20 + "px"
    }
  },
  components: {
    draggable,
  },
  methods: {
    reload(list) {
      //在没有刷新的时候强制刷新
      this.myImgList = list;
    },
    dragEnd(evt) {
      //轮播图拖动结束
      this.myImgList = this.myImgList.filter((item, index) => {
        return item
      })
      this.$emit("dragEnd", { imgStr: this.myImgList, type: this.type })
    },
    /**删除某个图片 */
    deleteImg(index) {
      this.$emit("deleteListImg", { index: index, type: this.type })
    },
    /**触发添加本地图片事件 */
    selectCropper() {
      // if(!this.canUseCropper){
      //   this.$message({
      //     type:'error',
      //     message:'Waiting for the last picture to complete before continuing!!'
      //   })
      //   return false
      // }
      if (this.goodsRowSupplyCode) return
      if (this.maxImgLength <= this.myImgList.length) {
        this.$message({
          type: "info",
          message: `最大上传${this.maxImgLength}张图片`
        });
        return false
      }
      this.canUseCropper = false
      this.$refs.uploadBtn.$el.click()
    },
    /**从素材库选择图片 */
    selectMaterial() {
      this.$emit("selectMaterial", this.type);
    },
    uploadRemove(file, fileList) { },
    uploadChange(file, fileList) {
      const _this = this;
      if (file) {
        var reader = new FileReader()
        reader.readAsDataURL(file.raw) // 读出 base64
        reader.onloadend = function () {
          var oImg = new Image()
          oImg.src = this.result
          oImg.style.opacity = "0"
          document.body.appendChild(oImg)
          oImg.onload = function () {
            var imgWidth = oImg.offsetWidth
            var imgHeight = oImg.offsetHeight
            document.body.removeChild(oImg)
            const fixgoodsImg = _this.fixGoodsImg[_this.type]
            if (_this.type == "goodsDetailImage") {
              //商品详情描述图不一样规则，是限定宽和最高的高度
              //尺寸不对需要提示错误
              // _this.$message({
              //   type: "error",
              //   message: file.name + " size error"
              // })
              _this.getImgUrl(reader.result, _this.type, _this.indexKey, _this.indexTab)
            } else if (_this.type == "selectionGoodsDetailImage" && ((imgWidth != fixgoodsImg.width && imgWidth != 1200 && imgWidth != 1500) || imgHeight > fixgoodsImg.maxheight)) {
              _this.$message({
                type: "error",
                message: file.name + " size error"
              })
            } else if (_this.type == "goodsThumb" && (imgWidth / imgHeight) != 1) {
              //尺寸不对需要提示错误
              _this.$message({
                type: "error",
                message: file.name + " size error"
              })
            } else if (_this.type == "carouselFigure" && (imgWidth / imgHeight) != 1) {
              //尺寸不对需要提示错误
              _this.$message({
                type: "error",
                message: file.name + " size error"
              })
            } else if (_this.type != "goodsDetailImage" && _this.type == "carouselFigure" && _this.type == "goodsThumb" && (fixgoodsImg.width != imgWidth || fixgoodsImg.height != imgHeight)) {
              //尺寸不对需要提示错误
              _this.$message({
                type: "error",
                message: file.name + " size error"
              })
            } else {
              // 尺寸ok
              _this.getImgUrl(reader.result, _this.type, _this.indexKey, _this.indexTab)
            }
          }
        }
      }
    },
    /**上传图片 */
    getImgUrl: function (imgStr, type, comIndex, indexTab) {
      var that = this
      uploadImg({ actType: this.actType, imgStr: imgStr }).then((response) => {
        // that.$refs["upload"].uploadFiles.shift();
        if (response.code == "5200" && response.data.imgUrl) {
          that.$emit(
            "successCropper",
            { imgStr: response.data.imgUrl },
            type,
            comIndex,
            indexTab
          )
        }
        this.canUseCropper = true
      }).catch((err) => {
        this.canUseCropper = true
      })
    },
    imgHover(src, ref) {
      // 图片的hover放大事件
      this.bigImg = src
      if (this.$refs[ref]) {
        const leftOff =
          this.$refs[ref][0].getBoundingClientRect().left +
          this.$refs[ref][0].clientWidth + 15
        const topOff = this.$refs[ref][0].getBoundingClientRect().top
        let innerHeight = this.$refs.inner[0].offsetWidth
        this.$refs.bigImg.style.left = leftOff + "px"
        this.$refs.bigImg.style.top = topOff + innerHeight + "px"
        this.$refs.bigImg.style.display = "block"
      }
    },
    imgMouseOut() {
      if (this.$refs.bigImg) {
        this.$refs.bigImg.style.display = "none"
      }
    },
    /**删除某个图片 */
    // deleteImg(index) {
    //   this.$emit("deleteListImg", { index: index, type: this.type });
    // },
  }
}
</script>

<style lang="scss" scoped>
.imgListOut {
  //   display: flex;
  margin-right: 15px;
  .btnSelectImg {
    margin-top: 15px;
  }
  .show > .showInner {
    .showInner2 {
      width: 100%;
      // max-height: 160px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      padding: 5px;
      font-size: 10px;
      border: 1px dashed rgb(88, 88, 88);
      &.one {
        border-bottom: none;
      }
      &.two {
        border-top: none;
      }
    }
  }
  .myUpload {
    background: rgb(213, 213, 213);
    //   line-height: 100%;
    text-align: center;
    // flex:1;
    flex-basis: calc((100% - 90px) / 10);
    flex-shrink: 1;
    margin-left: 10px;
    &:nth-of-type(1) {
      margin-left: 0;
    }
    &:nth-of-type(11) {
      margin-left: 0;
    }
    &[keys="10"] {
      margin-left: 0;
    }
    &.twoLinw {
      margin-top: 10px;
    }
    .inner {
      padding-top: 100%;
      position: relative;
      height: 0;
    }
    p {
      width: 100%;
      font-size: 10px;
      position: absolute;
      top: 50%;
      left: 0;
      text-align: center;
      transform: translateY(-50%);
      margin: 0;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.showThumb {
  .myUpload {
    flex: 1;
  }
}
img.cropper-preview {
  width: 100%;
  height: 100%;
  display: block;
  //   float: left;
  //   margin-right: 15px;
}
.cropper-close-box {
  display: inline-block;
  position: relative;
  .close-tailoring {
    position: absolute;
    top: -5px;
    right: 3px;
    background: #757575;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    z-index: 2;
  }
}
.bigImg {
  display: none;
  position: fixed;
  z-index: 9;
  left: 400px;
  top: 0;
  background: white;
}
.fixHeight {
  width: 100%;
  max-height: 160px !important;
}
.fixHeight1 {
  width: 100%;
  max-height: 139px !important;
}
</style>
<style lang="scss">
.combination {
  img.cropper-preview {
    width: 40px;
    margin-right: 5px;
  }
}
</style>