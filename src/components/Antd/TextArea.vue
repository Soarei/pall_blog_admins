<template>
  <div>
    <a-textarea v-bind="$attrs" v-model="$attrs.value" @change="onChange" style="width:100%" :autosize="autoSize" />
    <span v-if="showWordLimit">{{ textLength }}/<template v-if="$attrs.maxLength">{{ $attrs.maxLength }}</template></span>
  </div>
</template>
<script>
export default {
  props: {
    // 是否展示字数统计
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    autoSize: {
      type: Object,
      default: () => {
        return { minRows: 6, maxRows: 10 }
      }
    }
  },
  // v-model处理
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    // 长度控制
    textLength() {
      return (this.$attrs.value || "").length;
    },
  },
  methods: {
    onChange(e) {
      // v-model 回调函数
      this.$emit("change", e.target.value);
    },
  },
};
</script>
<style scoped>
.textarea-wrapper {
  position: relative;
  display: block;
}
.m-count {
  color: #808080;
  position: absolute;
  font-size: 12px;
  bottom: 0px;
  right: 20px;
}
.m-textarea {
  padding: 8px 12px;
  height: 100%;
}
</style>