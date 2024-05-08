<template>
  <div>
    <!-- @mouseover="imgHover(scope.row.pictureUrl,'smallImg' + scope.row.number )" 
      @mouseout="imgMouseOut" -->
     <el-image
      :style="{width:Iwidth+'px'}"
      :src="ImageInfo"
      :ref="'smallImg' + ImageInfo "
      fit="contain"
      @mouseover="imgHover(ImageInfo,'smallImg' + ImageInfo )"
      @mouseout="imgMouseOut"
      ></el-image>
            <!-- 查看大图 -->
      <div ref="bigImg" class="bigImg"><img :src="bigImg" style="height: 400px" /></div>
  </div>
</template>

<script>
export default {
  props:{
    Iwidth:{type:Number,default:50},
    ImageInfo:{type:String,default:''}
  },
  data(){
    return{
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      bigImg:''
    }
  },
  methods:{
        // 放大商品图片
    imgHover(src,ref){
      this.bigImg = src
      const leftOff = this.$refs[ref].x + this.$refs[ref].naturalWidth + 15
      const topOff = this.$refs[ref].y
      this.$refs.bigImg.style.left = leftOff / 1.7 + 'px'
      this.$refs.bigImg.style.top = topOff + 'px'
      this.$refs.bigImg.style.display = 'block'
    },
    imgMouseOut() {
      this.$refs.bigImg.style.display = 'none'
    },
  }
}
</script>

<style scoped>
.bigImg {
  display: none;
  position: fixed;
  z-index: 9;
  /* left:400px; */
  bottom: 20px;
  background: white;
  transition: display 1s ease 1s;
}
</style>