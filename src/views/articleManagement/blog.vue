<template>
  <div>
    <div class="wrap" v-if="dialogVisible">
      <div class="app-title">
        <h2>文章列表</h2>
      </div>
      <div class="app-container">
        <div class="search">
          <div class="serachItem">
            <a-input placeholder="搜索关键词"></a-input>
            <a-input placeholder="搜索关键词"></a-input>
          </div>
          <span class="btnConfig">
            <a-button type="primary" @click="handleAdd">添加文章</a-button>
            <a-button type="primary" @click="getList">查询</a-button>
            <a-button style="margin-left:10px">查询</a-button>
          </span>
        </div>
        <!-- <Pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="getList" /> -->
        <a-table :columns="columns" :data-source="list" :scroll="{ x: 1000 }" rowKey="article_id" :pagination="pagination">
          <template slot="article_cover" slot-scope="text,record">
            <img :src="record.article_cover" alt="" srcset="" style="width:50px;height:50px;">
          </template>
          <template slot="labels" slot-scope="text,record">
            <a-tag v-for="(item,index) in record.labels" :key="index" :color="item | formatRoles">{{item}}</a-tag>
          </template>
          <template slot="action" slot-scope="text,record">
            <a style="margin-left:5px;" @click="handleEdit(record)">编辑</a>
            <a style="margin-left:5px;color:red;" @click="handleDel(record.article_id)">删除</a>
          </template>
        </a-table>
      </div>
    </div>
    <AddGoods v-if="!dialogVisible" :editForm="addGoodsForm" @closeDialog="closeDialog" />
  </div>
</template>

<script>
// import { getGoods,delGoods,updateGoods } from '@/api/goods'
import { getArticleList, delArticle } from '@/api/pall_article'
import Pagination from '../../components/Pagination'
import SearchBox from '../../components/searchBox'
import CursorImage from '../../components/CursorImage'
// 引入添加修改商品组件
import AddGoods from './component/addGoods.vue'
export default {
  components: {
    Pagination,
    SearchBox,
    AddGoods,
    CursorImage
  },
  data() {
    return {
      list: null,
      columns: [
        {
          title: 'ID',
          dataIndex: 'article_id',
          key: 'article_id',
          width: 100
        },
        {
          title: '文章封面',
          scopedSlots: { customRender: 'article_cover' },
          width: 100
        },
        {
          title: '文章标题',
          dataIndex: 'article_title',
          key: 'article_title',
          ellipsis: true,
          width:100,
        },
        {
          title: '文章分类',
          dataIndex: 'catgory_name',
          key: 'catgory_name',
          width:100,
        },
        {
          title: '标签',
          scopedSlots: { customRender: 'labels' },
          width: 250
        },
        {
          title: '作者',
          dataIndex: 'user_name',
          key: 'user_name',
          width:100,
        },
        {
          title: '创建时间',
          dataIndex: 'release_time',
          key: 'release_time',
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 150,
          fixed: 'right'
        },
      ],
      pagination: {
        position: 'bottom',
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize),//点击页码事件
      },
      dialogVisible: true,
      // 商品图片处理
      bigImg: '',
      // 编辑商品对象
      addGoodsForm: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const { current } = this.pagination
      getArticleList({ page: current, size: 10 }).then(res => {
        if (res.code === 5200) {
          this.listLoading = false
          this.list = res.data.rows
          this.pagination.total = res.data.count
          console.log(this.list);
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.selectSearch = {}
      this.getList()
    },
    // 添加商品
    handleAdd() {
      Object.assign(this.$data, this.$options.data.call(this))
      this.dialogVisible = false
    },
    // 编辑商品
    handleEdit(row) {
      this.dialogVisible = false
      this.addGoodsForm = row
      console.log(this.addGoodsForm,'list');
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
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle({ article_id: id }).then(res => {
          if (res.code == 5200) {
            this.$antmessage.success(res.message)
            this.getList()
          } else {
            this.$antmessage.error(res.message)
          }
        }).catch((err) => { })
      }).catch(() => {
      });
    },
    // 接收子组件传来的方法
    closeDialog() {
      this.dialogVisible = true
      this.getList()
    }
  },
  filters: {
    formatRoles(item) {
      if (item === '超级管理员') {
        return 'pink'
      }
      return 'blue'
    }
  }
}
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
