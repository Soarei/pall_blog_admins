<template>
  <!-- 从素材库添加图片弹框 -->
  <el-dialog title="select image" :visible.sync="selectImgFromFile" width="80%" center :before-close="close">
    <material-manage ref="materialManage" :isComponent="isComponent" @selectFromFile="selectFromFileClick"></material-manage>
  </el-dialog>
</template>

<script>
import MaterialManage from "@/views/shoppingMall/materialBaseManagement/index_new"
export default {
  components: {
    MaterialManage
  },
  props: {
    selectImgFromFile: {
      type: Boolean,
      default: false
    },
    fixGoodsImg: {
      type: Object,
      default() {
        return {}
      }
    },
    selectType: {
      type: String,
      default: ''
    }
  },
  watch: {

  },
  data() {
    return {
      isComponent: true, //展示素材库确定选好了图片的按钮
      close: () => {
        this.$emit("closeSelectFromFile")
      },
    }
  },
  methods: {
    selectFromFileClick(data) { //素材库选中图片的回调函数 data是选中的图片数据
      const _this = this
      const selectType = _this.selectType
      data.forEach((item, index) => {
        var oImg = new Image();
        oImg.src = item;
        oImg.style.opacity = '0'
        document.body.appendChild(oImg);
        oImg.onload = function () {
          var imgWidth = oImg.offsetWidth;
          var imgHeight = oImg.offsetHeight;
          document.body.removeChild(oImg);
          const fixgoodsImg = _this.fixGoodsImg[selectType]
          if (selectType === 'goodsDetailImage') {
            // 不对尺寸限制
            _this.$emit("successCropper", { imgStr: item }, selectType);
          } else {
            if (imgWidth / imgHeight != 1) {
              //尺寸不对需要提示错误
              _this.$message({
                type: "error",
                message: "size error"
              })
            } else {
              //尺寸ok
              _this.$emit("successCropper", { imgStr: item }, selectType);
            }
          }
        };
      })
      this.$refs.materialManage.myGetList()
      this.$emit("closeSelectFromFile")
      // this.selectImgFromFile = false
    }
  }
}
</script>

<style>
</style>