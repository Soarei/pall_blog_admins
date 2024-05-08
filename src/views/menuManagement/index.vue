<template>
  <div class="wrap">
    <div class="app-title">
      <h2>菜单列表</h2>
    </div>
  <div class="app-container">
    <div class="search">
    <div class="serachItem">
          <a-input placeholder="搜索关键词"></a-input>
          <a-input placeholder="搜索关键词"></a-input>
        </div>
        <span class="btnConfig">
          <a-button type="primary"  @click="createMenus">添加菜单</a-button>
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left:10px">查询</a-button>
        </span>
      </div>
    <a-table :columns="columns" :data-source="data" :expanded-row-keys.sync="expandedRowKeys" rowKey="id">
        <template slot="type" slot-scope="text,record">
          <a-tag color="blue"> {{record.type === 0 ? '菜单' : '按钮'}}</a-tag>
        </template>
        <template slot="action" slot-scope="text,record">
            <a style="margin-left:5px;" @click="addChildMenus(record)">添加</a>
            <a style="margin-left:5px;" @click="editChildMenus(record,'edit')">编辑</a>
            <a style="margin-left:5px;color:red;" @click="deleteMenus(record)">删除</a>
        </template>
    </a-table>
    <!-- 添加和编辑表单 -->
    <ModalMenusAdd ref="modalmenus" @getList="getList"/>
  </div>
</div>
</template>

<script>
import ModalMenusAdd from './modalMenusAdd.vue'
import { formatTreeList } from '@/utils/perrmisson'
import {getMenusList,deleteMenus} from '@/api/menus/menulist'

export default {
  components:{
    ModalMenusAdd
  },
  data() {
    return {
      columns: [
        { title: "菜单名称", dataIndex: "name", key: "name",align:'left' },
        { title: "菜单ID", dataIndex: "id", key: "id"  },
        { title: "父级菜单", dataIndex: "parentId", key: "parentId"},
        { title: "类型",scopedSlots:{ customRender: 'type' }  },
        { title: "资源路径", dataIndex: "url", key: "url"},
        { title: "排序号", dataIndex: "sort", key: "sort" },
        { title:"创建时间",dataIndex:"create_time",key:"dataIndex" },
        { title: "操作", scopedSlots: { customRender: 'action' },},
      ],
      menuList:[],
      data: [],
      expandedRowKeys: [],
      form:{},
      childInfo:{}
    };
  },
  methods:{
    createMenus(){
        this.$refs.modalmenus.isShow()
        // console.log(this.$refs.);
    },
    addChildMenus(record){
      this.$refs.modalmenus.isShow(JSON.parse(JSON.stringify(record)))
    },
    editChildMenus(record,action){
      this.$refs.modalmenus.isShow(JSON.parse(JSON.stringify(record)),action)
    },
    handleExpand(expanded,record){
      console.log(expanded,record);
    },
    // 删除菜单
    deleteMenus(record){
      const { id } = record
      let _this = this
      this.$antconfirm({
        title: '确认删除菜单？',
        content: '删除菜单后不能恢复，平台内也不在展示是否继续删除操作。',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteMenus({ id }).then(res => {
            if (res.code === 5200) {
              _this.$antmessage.success('删除成功')
              _this.getList()
            }
          })
        },
        onCancel() {
          _this.$antmessage.info('取消删除')
        }
      })
    },
    getList(){
      getMenusList().then(res=>{
        if(res.code === 5200){
          this.data = formatTreeList(res.data)
        }
      })
    }
  },
  created(){
    this.getList()
  }
};
</script>

<style scoped lang="less">
@import url('../../styles/page-public.less');
a{
  color:#1890ff
}
</style>