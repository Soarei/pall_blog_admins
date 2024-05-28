<template>
  <div ref="upload">
    <ImgCutter
      @cutDown="cutDown"
      :cutWidth="uploadOption.width"
      :cutHeight="uploadOption.height"
    >
      <template slot="open">
        <div class="upload">
          <div class="upload_avatar">
            <img
              v-if="picture"
              :src="picture"
              alt="avatar"
              :style="{
                width: uploadOption.innerWidth + 'px',
                height: uploadOption.innerHeight + 'px',
              }"
            />
            <a-icon
              :type="loading ? 'loading' : 'plus'"
              v-else
              class="upload_icon"
            />
          </div>
          <!-- <a-upload name="avatar" :list-type="uploadOption.listType" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" :customRequest="customRequest">
            <img v-if="picture" :src="picture" alt="avatar" :style="{width:uploadOption.innerWidth+'px',height:uploadOption.innerHeight+'px'}" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload> -->
          <span class="remark">
            <p>支持格式：jpg、png</p>
            <p>{{ `支持大小：最大不能超过${uploadOption.imgSize}MB` }}</p>
            <p>
              支持尺寸：{{ `${uploadOption.width} * ${uploadOption.height}` }}
            </p>
          </span>
        </div>
      </template>
    </ImgCutter>
  </div>
</template>

<script>
import { uploadImg } from "@/api/goods";
import { uploadFileImage } from "@/api/article/upload";
import ImgCutter from "vue-img-cutter";
export default {
  components: {
    ImgCutter,
  },
  data() {
    return {
      // 上传图片的相关参数
      fileList: [], //存储图片的地址，用来判断回调
      loading: false,
      dataURL: "",
    };
  },
  props: {
    picture: {
      type: String,
      default: () => {
        return "";
      },
    },
    // 相关图片参数
    uploadOption: {
      type: Object,
      default: () => {
        return {
          name: "avatar",
          listType: "picture-card",
          showUploadlist: false,
          width: 100, //上传图片宽度的限制
          height: 100, //上传图片高度的限制
          supportImg: ["image/jpeg", "image/png"], //支持图片格式
          imgSize: 3, //支持上传图片的大小
          innerWidth: 80,
          innerHeight: 80,
        };
      },
    },
  },
  methods: {
    // 上传之前回调
    async beforeUpload(file) {
      this.fileList = [];
      this.loading = true;
      this.$refs.avatarModal.edit((fileObj) => {});
    },
    // 校验图片的尺寸，后缀是否满足要求
    validImage(file) {
      var _this = this;
      // 解构赋值
      const { width, height, imgSize } = _this.uploadOption;
      return new Promise((resolve, reject) => {
        const isJpgOrPng =
          file.type === "image/jpeg" || file.type === "image/png";
        const isLtSize = file.size / 1024 / 1024 < imgSize;
        if (!isJpgOrPng) {
          this.$antmessage.error("只能上传jpg或者png的图片");
          return isJpgOrPng;
        }
        if (!isLtSize) {
          this.$antmessage.error("图片大小超出限制，请修改后重新上传");
          return isLtSize;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var w = image.width;
            var h = image.height;
            const ratio = width / height;
            if (w / h == ratio) {
              resolve(true);
            } else {
              _this.$antmessage.error(
                `图片尺寸错误，只能上传${width}x${height}横纵比一致的图片`
              );
              reject(false);
            }
          };
        };
      });
    },
    // 自定义尺寸
    customRequest(options) {
      var reader = new FileReader();
      var _this = this;
      reader.readAsDataURL(options.file); // 读出 base64
      reader.onloadend = function () {
        uploadImg({ actType: 5, imgStr: reader.result }).then((res) => {
          if (res.code === 5200) {
            const { imgUrl } = res.data;
            _this.picture = imgUrl;
            _this.loading = false;
            // 通知父组件更新状态
            _this.$emit("updateFilesList", _this.fileList, _this.picture);
          }
        });
      };
    },
    // 裁剪工具
    cutDown(res) {
      console.log(res);
      let formdata = new FormData();
      formdata.append("file", res.file);
      this.dataURL = res.dataURL;
      uploadFileImage(formdata).then((response) => {
        if (response.code === 5200) {
          this.$emit("updateFilesList", response.data.url);
        }
      });
    },
  },
  created() {
    // this.dataURL = this.picture
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.upload.style.setProperty(
        "--width",
        this.uploadOption.innerWidth + "px"
      );
      this.$refs.upload.style.setProperty(
        "--height",
        this.uploadOption.innerHeight + "px"
      );
    });
  },
};
</script>

<style lang="less" scoped>
/*
  定义全局变量
  @width = @uploadOption.width
*/
.upload {
  width: 100%;
  display: flex;
  .upload_avatar {
    width: var(--width);
    height: var(--height);
    background-color: #f7f7f7;
    border: 1px dashed #ccc;
    .upload_icon {
      display: block;
      margin: 0 auto;
      line-height: var(--height);
    }
  }
  .remark {
    text-align: left;
    font-size: 12px;
    padding-left: 10px;
    margin-top: 10px;
    p {
      margin: 0;
      line-height: 20px;
    }
  }
}
// antd样式穿透
/deep/ .ant-upload-select-picture-card {
  width: var(--width);
  height: var(--height);
}
</style>
