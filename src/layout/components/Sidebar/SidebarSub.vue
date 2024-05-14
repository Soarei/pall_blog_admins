<template>
  <div v-if="!item.hidden">
    <a-sub-menu v-for="route in routes" :key="route.path">
      <span slot="title"
        ><a-icon type="mail" /><span>{{
          route.meta ? route.meta.title : ""
        }}</span></span
      >
    </a-sub-menu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
