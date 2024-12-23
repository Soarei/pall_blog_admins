<template>
  <div>
    <div class="wrap" v-if="dialogVisible">
      <div class="app-title">
        <h2>文章列表</h2>
      </div>
      <div class="app-container">
        <SearchForm
          :searchOptions="searchOptions"
          :renderButton="renderButton"
        ></SearchForm>
        <!-- <Pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="getList" /> -->
        <a-table
          :columns="columns"
          :data-source="list"
          :scroll="{ x: 1000 }"
          rowKey="article_id"
        >
          <template slot="recommend" slot-scope="text, record">
            <a-rate :value="record.level" disabled :count="3" />
          </template>
          <template slot="labels" slot-scope="text, record">
            <!--:color="item.color" -->
            <a-tag v-for="(item, index) in record.labels" :key="index">{{
              item.name
            }}</a-tag>
          </template>
          <template slot="status" slot-scope="text, record">
            <a-tag color="#87d068">{{
              record.status == 1
                ? "审批中"
                : record.status == "2"
                ? "审核成功"
                : "审核失败"
            }}</a-tag>
          </template>
          <template slot="listing" slot-scope="text, record">
            <a-tag color="cyan">{{ record.listing ? "上架" : "下架" }}</a-tag>
          </template>
          <template slot="action" slot-scope="text, record">
            <a style="margin-left: 5px" @click="handleEdit(record)">编辑</a>
            <a
              style="margin-left: 5px; color: red"
              @click="handleDel(record.article_id)"
              >删除</a
            >
          </template>
        </a-table>
      </div>
    </div>
    <AddGoods
      v-if="!dialogVisible"
      :editForm="addGoodsForm"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
// import { getGoods,delGoods,updateGoods } from '@/api/goods'
import { getArticleList, delArticle } from "@/api/pall_article";
import SearchBox from "../../components/searchBox";
import CursorImage from "../../components/CursorImage";
import SearchForm from "../../components/Antd/CommonSearch/index.vue";
// 引入添加修改商品组件
import AddGoods from "./component/addGoods.vue";
export default {
  components: {
    SearchBox,
    AddGoods,
    CursorImage,
    SearchForm,
  },
  data() {
    return {
      list: null,
      columns: [
        // {
        //   title: "ID",
        //   dataIndex: "article_id",
        //   key: "article_id",
        //   width: 50,
        // },
        {
          title: "创建时间",
          dataIndex: "release_time",
          key: "release_time",
          width: 200,
        },
        // {
        //   title: "文章封面",
        //   scopedSlots: { customRender: "article_cover" },
        //   width: 100,
        // },
        {
          title: "文章标题",
          dataIndex: "article_title",
          key: "article_title",
          ellipsis: true,
          width: 300,
          align: "left",
        },
        {
          title: "推荐",
          scopedSlots: { customRender: "recommend" },
          width: 200,
        },
        {
          title: "文章分类",
          dataIndex: "catgory_name",
          key: "catgory_name",
          width: 100,
        },
        {
          title: "标签",
          scopedSlots: { customRender: "labels" },
          width: 250,
        },
        {
          title: "作者",
          dataIndex: "user_name",
          key: "user_name",
          width: 120,
        },
        {
          title: "状态",
          width: 80,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "上下架",
          width: 80,
          scopedSlots: { customRender: "listing" },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
      },
      dialogVisible: true,
      // 商品图片处理
      bigImg: "",
      // 编辑商品对象
      addGoodsForm: {},
      search: {
        article_title: "",
      },
      searchOptions: [
        {
          label: "文章标题",
          value: "article_title",
          placeholder: "请输入文章标题",
          type: "input",
        },
        {
          label: "文章分类",
          value: "category",
          placeholder: "请输入文章分类",
          type: "select",
          options: [],
        },
        {
          label: "状态",
          value: "user_name",
          placeholder: "请输入文章标题",
          type: "input",
        },
      ],
      renderButton: {
        query: {
          label: "查询",
          type: "primary",
          click: () => {
            this.getList();
          },
        },
        export: {
          label: "导出",
          type: "info",
          click: () => {
            console.log("导出");
          },
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { current } = this.pagination;
      getArticleList({
        page: current,
        size: 10,
        article_title: this.search.article_title,
      })
        .then((res) => {
          if (res.code === 5200) {
            this.listLoading = false;
            this.list = res.data.rows;
            this.pagination.total = res.data.count;
            console.log(this.list);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetSearch() {
      this.pagination.current = 1;
      this.search.article_title = "";
      this.getList();
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current;
      this.getList();
    },
    handleFilter() {
      this.getList();
    },
    handleReset() {
      this.selectSearch = {};
      this.getList();
    },
    // 添加商品
    handleAdd() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.dialogVisible = false;
    },
    // 编辑商品
    handleEdit(row) {
      this.dialogVisible = false;
      this.addGoodsForm = JSON.parse(JSON.stringify(row));
      this.addGoodsForm.tags = JSON.parse(JSON.stringify(row)).labels.map(
        (item) => {
          return item.id;
        }
      );
      console.log(this.addGoodsForm, "list");
    },
    // 放大商品图片
    imgHover(src, ref) {
      // this.bigImg = src
      // console.log(this.bigImg);
      // const leftOff = this.$refs[ref].x + this.$refs[ref].naturalWidth + 15
      // const topOff = this.$refs[ref].y
      // this.$refs.bigImg.style.left = leftOff / 1.7 + 'px'
      // this.$refs.bigImg.style.top = topOff + 'px'
      // this.$refs.bigImg.style.display = 'block'
    },
    imgMouseOut() {
      // this.$refs.bigImg.style.display = 'none'
    },
    // 删除商品接口
    handleDel(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delArticle({ article_id: id })
            .then((res) => {
              if (res.code == 5200) {
                this.$antmessage.success(res.message);
                this.getList();
              } else {
                this.$antmessage.error(res.message);
              }
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },
    // 接收子组件传来的方法
    closeDialog() {
      this.dialogVisible = true;
      this.getList();
    },
  },
  filters: {
    formatRoles(item) {
      if (item === "超级管理员") {
        return "pink";
      }
      return "blue";
    },
  },
};
</script>

<style scoped lang="less">
@import url("../../styles/page-public.less");
.bigImg {
  display: none;
  position: fixed;
  z-index: 9;
  /* left:400px; */
  top: 0;
  background: white;
  transition: display 1s ease 1s;
}
a {
  color: #1890ff;
}
</style>
