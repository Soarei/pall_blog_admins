<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <a-menu
      mode="inline"
      theme="dark"
      :inline-collapsed="isCollapse"
      :open-keys.sync="openKeys"
      :selectedKeys="selectedKeys"
      @click="select"
    >
      <template v-for="route in routes">
        <a-sub-menu v-if="!route.hidden" :key="route.path">
          <span slot="title"
            ><a-icon type="mail" /><span>{{
              route.meta ? route.meta.title : ""
            }}</span></span
          >
          <template v-if="route.children.length > 0">
            <a-menu-item v-for="menu in route.children" :key="menu.path">
              <router-link :to="menu.path">
                {{ menu.meta.title }}
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
    <el-scrollbar wrap-class="scrollbar-wrapper" v-if="false">
      <!-- <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu> -->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarSub.vue";
import variables from "@/styles/variables.scss";
import Cookies from "js-cookie";
export default {
  components: { SidebarItem, Logo },
  props: {
    selectIndex: {
      type: String,
      default() {
        return Cookies.get("sliderActiveIndex");
      },
    },
  },
  data() {
    return {
      openKeys: [this.$route.path.substr(0, this.$route.path.lastIndexOf("/"))],
      selectedKeys: JSON.parse(localStorage.getItem("selectedKeys")),
    };
  },
  created() {
    console.log(this.routes);
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "permission_routes", // vuex中存储的侧栏
    ]),
    routes() {
      if (this.permission_routes) {
        return this.permission_routes;
      } else {
        return [];
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    select({ item, key, selectedKeys }) {
      // 选中项
      this.selectedKeys = [key];
      localStorage.setItem("selectedKeys", JSON.stringify(this.selectedKeys));
    },
  },
};
</script>
