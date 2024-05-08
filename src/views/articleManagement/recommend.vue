<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.name">
        <div class="tabslist">
          <div class="header">
          <SearchBox :select-search="selectSearch" :searchConfig="searchConfig" :btn-config="btnConfig"  @handleFilter="handleFilter"  @handleReset="handleReset" @handleAdd="handleAdd"/>
        </div>
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            stripe
            highlight-current-row
          >
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column align="center" label="ID" width="195">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="195">
              <template slot-scope="scope">
                {{ scope.row.operation }}
                <!-- <CursorImage :ImageInfo="scope.row.operation"/> -->
              </template>
            </el-table-column>
            <el-table-column align="center" label="请求接口" width="195">
              <template slot-scope="scope">
                {{ scope.row.interlink }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="请求方式" >
              <template slot-scope="scope">
                {{ scope.row.method }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="IP" >
              <template slot-scope="scope">
                {{ scope.row.host }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import SearchBox from '@/components/searchBox'
export default {
  components:{
    SearchBox
  },
  data(){
    return {
      activeName:'0',
      tabs:[{label:"一级推荐",name:0},{label:"二级推荐",name:1},{label:"三级推荐",name:2},{label:"四级推荐",name:3}],
      list:[],
      listLoading:false,
      selectSearch:{},
      searchConfig:[
        {
          dataModel: "notice_title",
          type: "input",
          placeholder: "文章标题",
          options: [],
        },
        {
          dataModel: "offshelf",
          type: "select",
          placeholder: "文章分类",
          options: [],
        },
      ],
      btnConfig:{
        search: false
      }
    }
  },
  methods:{
    handleClick(val){
      console.log(val);
    },
    handleFilter(){

    },
  }
}
</script>

<style scoped>
  .tabslist{
    width: 95%;
    margin: 20px auto;
  }
</style>