<template>
  <!-- 遮罩层 style="margin-left:15px"-->
  <div style="display:flex;justify-content:flex-start;">
    <!--图片裁剪框 start-->
    <div class="tailoring-container">
      <div class="black-cloth" @click="closeTailor" />
      <div class="tailoring-content">
        <div class="tailoring-content-one">
          <label title="$t('order.uploadImage')" for="chooseImg" class="l-btn choose-btn select-cropper-btn">
            <input v-if="showCropper" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" name="file" @change="selectImg">
            {{ $t('table.selectImage') }}
          </label>
          <div class="close-tailoring" @click="closeTailor">×</div>
        </div>
        <div class="tailoring-content-two">
          <div class="tailoring-box-parcel">
            <img :id="thumbId">
          </div>
          <div class="preview-box-parcel">
            <p>{{ $t('order.picturePreview') }}</p>
            <div :id="'preview'+thumbId" class="square previewImg" />
          </div>
        </div>
        <div class="tailoring-content-three">
          <div class="l-btn sureCut" @click="sureCut">{{ $t('permission.confirm') }}</div>
        </div>
      </div>
    </div>
    <!--图片裁剪框 end-->
  </div>
</template>
<script>
import 'cropper/dist/cropper.css'
import cropper from "cropper/dist/cropper.min.js" // 请不要把这行代码删除，下面有jq调用
import $ from 'jquery'
import { uploadImg } from '@/api/goods'
import draggable from "vuedraggable"
export default {
  props: {
    showCropper: {
      type: Boolean,
      default: false
    },
    goodsImg: {
      type: Object,
      default() {
        return {}
      }
    },
    thumbId: {
      type: String,
      default: ''
    },
    editThumb: {
      type: Array,
      default: () => []
    },
    editAttrthumb: {
      type: String,
      default: ''
    },
    adminUserImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list2: [],
      base64url: '',
      show: true,
      showDelete: false,
      image_type: "image/png",
      allThumb: {
        carouserImg: [],
        thumbImg: [],
        describeImg: [],
        combinationImg: [],
        adminUserImg: []
      }
    }
  },
  components: {
    draggable
  },
  created() {
    var id = this.thumbId
    this.allThumb[id] = this.allThumb[id] ? this.allThumb[id] : [];
    var obj = {
      'goodsThumb_id': 'thumbImg',
      'goodsCarousel_id': 'carouserImg',
      'goodsDescribe_id': 'describeImg',
      'adminUserIcon_id': 'adminUserImg'
    }
    if (obj[id] && this.allThumb[obj[id]].length == 0 && this.editThumb.length) {
      this.allThumb[obj[id]] = this.editThumb
    }
    if (this.allThumb['combinationImg'].length == 0 && this.editAttrthumb) {
      this.allThumb['combinationImg'].push(this.editAttrthumb)
    }
    if (this.allThumb['adminUserImg'].length == 0 && this.adminUserImg) {
      this.allThumb['adminUserImg'] = this.adminUserImg
    }
  },
  mounted() {
    var goodsImg = this.goodsImg
    var id = this.thumbId// tailoringImg
    this.initThumb(id, goodsImg);
  },
  watch: {
    showCropper(newval, oldval) {
      if (newval) {
        this.initThumb(this.thumbId, this.goodsImg)
      }
    }
  },
  methods: {
    // 轮播图拖动结束
    dragEnd(evt) {
      // 移动结束后更新值到父组件
      this.$emit('goodsCarousel', { imgStr: this.allThumb.carouserImg })
    },
    // 详情图拖动结束
    dragDescEnd(evt) {
      // 移动结束后更新值到父组件
      this.$emit('goodsDescribe', { imgStr: this.allThumb.describeImg })
    },
    // 编辑图片的时候传递数据
    init: function () {},
    showContain: function () {
      if (this.goodsImg.length >= 5) {}
    },
    closeTailor: function () {
      event.stopPropagation()
      var id = this.thumbId
      $('#' + id).cropper('destroy')
      this.$emit('showCropperClick')
    },
    selectImg: function (e) {
      var id = this.thumbId;
      var obj = {};
      if (!e.target.files || !e.target.files[0]) {
        return
      }
      this.image_type = e.target.files[0].type
      var reader = new FileReader()
      reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        $('#' + id).cropper('replace', replaceSrc, false)// 默认false，适应高度，不失真
        var test = $('#' + id);
        var bl = (test.width() / test.height()).toFixed(2);
        obj["width"] = 400;
        obj["height"] = Math.ceil(400 / bl) || 200;
        $('#' + id).cropper({ aspectRatio: bl });
      };
      reader.readAsDataURL(e.target.files[0])
    },
    sureCut: function () {
      var id = this.thumbId;
      if ($('#' + id).attr('src') == null) {
        return false
      } else {
        var cas = $('#' + id).cropper('getCroppedCanvas', {
          width: this.goodsImg.width,
          height: this.goodsImg.height,
          fillColor: '#fff'
        })
        var base64url = ""// 转换为base64地址形式
        if (this.image_type == "image/gif") {
          base64url = $(".cropper-canvas img").attr("src")
        } else {
          base64url = cas.toDataURL('image/png')
        }
        // 请求接口数据 返回的url 插入到对应的数组中
        var objId = {
          'goodsCarousel_id': 2,
          'goodsDescribe_id': 4,
          'goodsThumb_id': 3,
          'adminUserIcon_id': 5
        }
        this.getImgUrl(objId[id] || 1, base64url, id)
        // 关闭裁剪框
        this.closeTailor()
      }
    },
    getImgUrl: function (actType, imgStr, id) {
      var that = this
      uploadImg({ actType: actType, imgStr: imgStr }).then(response => {
        var obj = {
          '2': that.allThumb.carouserImg,
          '4': that.allThumb.describeImg,
          '3': that.allThumb.thumbImg,
          '1': that.allThumb.combinationImg,
          '5': that.allThumb.adminUserImg
        }
        var goodsImg = this.goodsImg
        if (response.code == '5200' && response.data.imgUrl) {
          // if (actType == '3') {
          //   that.allThumb.thumbImg.length = 0
          //   that.$emit('goodsThumb', { imgStr: [response.data.imgUrl] })
          // } else if (actType == '1') {
          //   // 截取字符串最后一个元素
          //   var index = this.thumbId.substr(this.thumbId.length - 1, 1)
          //   that.$emit('childrenCropper', { 'index': index, imgStr: response.data.imgUrl })
          //   that.allThumb.combinationImg.length = 0
          // }
          // obj[actType].push(response.data.imgUrl)
          // if (actType == '2') {
          //   that.$emit('goodsCarousel', { imgStr: obj[actType] })
          // } else if (actType == '4') {
          //   that.$emit('goodsDescribe', { imgStr: obj[actType] })
          // } else if (actType == '5') {
          //   that.$emit('adminUserImg', { imgStr: response.data.imgUrl })
          // }
          // that.allThumb[id].push(response.data.imgUrl);
          // that.closeTailor()
          that.$emit('getCuttingImgUrl',response.data.imgUrl)
        }
      })
    },
    closeCarousel: function (item) {
      var index = this.allThumb.carouserImg.indexOf(item)
      if (index !== -1) {
        this.allThumb.carouserImg.splice(index, 1)
      }
      this.$emit('goodsCarousel', { imgStr: this.allThumb.carouserImg })
    },
    closeDescribe: function (item) {
      var index = this.allThumb.describeImg.indexOf(item)
      if (index !== -1) {
        this.allThumb.describeImg.splice(index, 1)
      }
      this.$emit('goodsDescribe', { imgStr: this.allThumb.describeImg })
    },
    initThumb: function (id, goodsImg) {
      var previewId = '#preview' + id
      var bi = goodsImg.width / goodsImg.height
      if (id == "goodsDescribe_id") {
        bi = NaN
      }
      $('#' + id).cropper({
        viewMode: 1,
        aspectRatio:bi, // 默认比例
        preview: previewId, // 预览视图
        guides: false, // 裁剪框的虚线(九宫格)
        autoCropArea: 1, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        movable: false, // 是否允许移动图片
        dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true, // 是否允许移动剪裁框
        resizable: true, // 是否允许改变裁剪框的大小
        zoomable: false, // 是否允许缩放图片大小
        mouseWheelZoom: false, // 是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true, // 是否允许通过触摸移动来缩放图片
        rotatable: false, // 是否允许旋转图片
        crop: function(e) {}
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang='scss' scoped>
* {
  margin: 0;
  padding: 0;
}
.l-btn {
  display: inline-block;
  outline: none;
  resize: none;
  border: none;
  padding: 0px 8px;
  background: #1890ff;
  color: #fff;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
}
.l-btn:hover {
  background: #8078e3;
  animation: anniu 1s infinite;
}
.l-btn:active {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2) inset;
}
.hidden {
  display: none;
}
.tailoring-container,
.tailoring-container div,
.tailoring-container p {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.tailoring-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99999999;
  top: 0;
  left: 0;
}
.tailoring-container .black-cloth {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #111;
  opacity: 0.5;
  z-index: 1001;
}
.tailoring-container .tailoring-content {
  position: absolute;
  width: 768px;
  height: 575px;
  background: #fff;
  z-index: 1002;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px #000;
  padding: 10px;
}
.tailoring-content-one {
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ddd;
}
.tailoring-content-one label {
  display: block;
  width: 72px;
  height: 36px;
  line-height: 36px;
}
.tailoring-content .choose-btn {
  float: left;
}
.tailoring-content .close-tailoring {
  display: inline-block;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: #eee;
  color: #fff;
  font-size: 22px;
  text-align: center;
  line-height: 30px;
  float: right;
  cursor: pointer;
}
.tailoring-content .close-tailoring:hover {
  background: #ccc;
}
.tailoring-content .tailoring-content-two {
  width: 100%;
  height: 460px;
  position: relative;
  padding: 5px 0;
}
.cropper-preview {
  height: auto;
}
.cropper-preview img {
  width: 140px;
  height: auto;
  display: block;
  float: left;
  margin-right: 10px;
}
.tailoring-content .tailoring-box-parcel {
  width: 520px;
  height: 450px;
  position: absolute;
  left: 0;
  border: solid 1px #ddd;
}
.tailoring-content .preview-box-parcel {
  display: inline-block;
  width: 228px;
  height: 450px;
  position: absolute;
  right: 0;
  padding: 4px 14px;
}
.preview-box-parcel p {
  color: #555;
}
.previewImg {
  width: 200px;
  height: auto;
  min-height: 100px;
  overflow: hidden;
}
.previewImg img {
  min-width: 100px;
  min-height: 50px;
}
.preview-box-parcel .square {
  margin-top: 10px;
  border: solid 1px #ddd;
}
.preview-box-parcel .circular {
  border-radius: 100%;
  margin-top: 10px;
  border: solid 1px #ddd;
}
.tailoring-content .tailoring-content-three {
  width: 100%;
  height: 40px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.sureCut {
  float: right;
  width: 60px;
  height: 35px;
  text-align: center;
  line-height: 35px;
}
@media all and (max-width: 768px) {
  .tailoring-container .tailoring-content {
    width: 100%;
    min-width: 320px;
    height: 460px;
  }
  .tailoring-content .tailoring-content-two {
    height: 360px;
  }
  .tailoring-content .tailoring-box-parcel {
    height: 350px;
  }
  .tailoring-container .tailoring-box-parcel {
    width: 100%;
  }
  .tailoring-container .preview-box-parcel {
    display: none;
  }
}
.select-cropper-btn {
  position: relative;
}
.select-cropper-btn input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 50px;
  display: block;
  overflow: hidden;
  opacity: 0;
}
.cropper-close-box {
  width: 140px;
  height: auto;
  position: relative;
  display: inline-block;
  margin-left: 15px;
  max-height: 105px;
}
/*.cropper-close-box:first-of-type{margin-left:0}*/
.cropper-close-box .close-tailoring {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #757575;
  color: #fff;
  width: 20px;
  height: 20px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
}

</style>
