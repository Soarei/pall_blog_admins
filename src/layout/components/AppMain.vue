<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <router-view :key="key" /> -->
      <keep-alive :include="cachedViews">
         <router-view  />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: rgb(234, 237, 241);
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
