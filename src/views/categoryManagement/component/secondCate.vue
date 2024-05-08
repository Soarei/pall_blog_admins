<template>
  <div class="app-container">
    <div>
      <div class="search" style="margin:10px auto 20px auto;">
        <el-row>
            <el-button  v-waves class="filter-item"  @click="handleCreateFirst" icon="el-icon-plus" round  type="primary" plain >添加二级分类</el-button>
            <el-button  v-waves class="filter-item"  @click="goBack" icon="el-icon-plus" round  type="primary" plain >返回上一级</el-button>
        </el-row>
      </div>
      <el-table
        v-loading="listLoading"
        :data="secondList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column align="center" label="分类名称">
          <template slot-scope="scope">
            {{ scope.row.sortName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类描述">
          <template slot-scope="scope">
            {{ scope.row.sortDesc }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序号">
          <template slot-scope="scope">
            {{ scope.row.sortNumber }}
          </template>
        </el-table-column>
         <el-table-column align="center" label="设置">
          <template slot-scope="scope">
              <el-button @click="goNextCategory(scope.row)" type="primary" size="mini">前往下一级</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDel(scope.row)" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :size.sync="listQuery.pageSize"
        @pagination="getList"
      />
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <div class="form">
          <el-form ref="form" :model="form" :rules="rules" label-width="auto">
              <el-form-item label="分类名称" prop="sortName">
                  <el-input v-model="form.sortName" :autosize="{minRows:1,maxRows:50}" style="width:60%;"></el-input>
              </el-form-item>
              <el-form-item label="分类描述" prop="sortDesc">
                  <el-input v-model="form.sortDesc" :autosize="{minRows:1,maxRows:50}" style="width:60%;"></el-input>
              </el-form-item>
              <el-form-item label="排序号" prop="sortNumber">
                  <el-input v-model="form.sortNumber" :autosize="{minRows:1,maxRows:50}" style="width:60%;"></el-input>
              </el-form-item>
              
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
     </el-dialog>
    </div>
    
  </div>
</template>

<script>
import { getCategoryList,addCategory,delCategory,updateCategory } from "@/api/category";
import Pagination from "../../../components/Pagination";
import SearchBox from "../../../components/searchBox";
import waves from '@/directive/waves' // waves directive
export default {
  directives: { waves },
  props:{
    parentId:{
        type:String,
        default: function() {
            return ''
        }
    },
    secondList:{
        type:Array,
        default: function() {
            return ''
        }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  components: {
    Pagination,
    SearchBox,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 5,
      },
      total: 0,
      // 搜索条件
      selectSearch: {},
      // 筛选条件
      searchConfig: [
        {
          dataModel: "notice_title",
          type: "input",
          placeholder: "分类名称",
          options: [],
        },
      ],
      btnConfig: { search: true, reset: true, add: true },
      dialogVisible: false,
      // 商品图片处理
      bigImg: "",
      // 分类等级
      firstCategory:true,
      secondCategory:false,
      form:{},
      rules:{
        sortName:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        sortDesc:[
        { required: true, message: '请输入分类描述', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        sortNumber:[
        { required: true, message: '请输入排序号', trigger: 'blur' },
        ]
      }
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    // 返回上级分类
    goBack(){
      this.$emit('goBcck')
    },
    getList() {
      this.listLoading = true;
      getCategoryList(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            this.listLoading = false;
            this.list = res.result;
            //   this.total = res.result.total
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 添加二级分类
    handleCreateFirst(){
     this.form = {}
     this.dialogVisible = true
    },
    submitPublic(res){
        if(res.code == 0){
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
        }else{
            this.$message.error(res.msg)
        }
    },
    // 提交分类
    handleSubmit(){
      if(this.form.id){
          updateCategory(this.form).then(res=>{
           this.submitPublic(res)
          })
      }else{
        this.form.parentId = this.parentId
        addCategory(this.form).then(res=>{
        this.submitPublic(res)
      })
      }
    },
    // 编辑分类
    handleEdit(row){
        this.dialogVisible = true
        this.form = JSON.parse(JSON.stringify(row))
    },
    // 删除商品接口
    handleDel(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delCategory({ ycSortId: row.id })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("删除分类成功");
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.bigImg {
  display: none;
  position: fixed;
  z-index: 9;
  /* left:400px; */
  top: 0;
  background: white;
  transition: display 1s ease 1s;
}
</style>
