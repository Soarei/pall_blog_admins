<template>
  <div class="wrap">
    <div class="app-title">
      <h2>敏感词列表</h2>
      <div class="rightButton">
        <a-button type="primary" @click="createMenus">添加敏感词</a-button>
      </div>
    </div>
    <div class="app-container">
      <SearchForm @handleFilter="handleFilter" :searchOptions="searchOptions" />
      <a-table :columns="columns" :data-source="list" rowKey="id" :pagination="pagination" :scroll="{ x: 600 }">
        <template slot="status" slot-scope="text,record">
          <a style="color:red" v-if="record.status">已关闭</a>
          <a v-else>已开启</a>
        </template>
        <!-- 操作 -->
        <template slot="action" slot-scope="text,record">
          <a style="margin-left:5px;" @click="changeStatus(record)">{{record.status ? '关闭' : '开启'}}</a>
          <a style="margin-left:5px;" @click="editProblem(record)">编辑</a>
          <a style="margin-left:5px;color:red;" @click="deleteProblem(record.id)">删除</a>
        </template>
      </a-table>
    </div>
    <!-- 弹窗 -->
    <a-modal v-model="dialogVisible" title="添加" ok-text="确认" cancel-text="取消" @ok="submitForm('form')" @cancel="(dialogVisible=false)">
      <a-form-model layout="vertical" :model="form" ref="form" :rules="rules">
        <a-form-model-item label="敏感词" prop="content">
          <a-input placeholder="请输入敏感词" v-model="form.content"></a-input>
          <!-- <TextArea v-model="form.content" :maxLength="2000" :autoSize="{ minRows: 6, maxRows: 10}" :showWordLimit="true" placeholder="请输入公告内容" /> -->
        </a-form-model-item>
        <a-form-model-item label="状态" prop="rangeTime">
          <a-switch v-model="form.status" @change="isChange" size="small"></a-switch>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getNoticeList, insertNotice, updateNotice, delNotice } from '@/api/platform/noticeInfo'
import { getSenstiveList, insertSensitive } from '@/api/platform/sensitive'
import SearchForm from '@/components/Antd/SearchForm'
import TextArea from '@/components/Antd/TextArea.vue'
import moment from 'moment'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  components: {
    TextArea, VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
    SearchForm
  },
  data() {
    return {
      listLoading: false,
      list: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 100
        },
        {
          title: '敏感词内容',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        }
      ],
      searchOptions: [
        {
          label: "敏感词内容",
          value: "content",
          placeholder: "请输入敏感词内容",
          type: 'input',
        },
      ],
      moment,
      zhCN,
      pagination: {
        position: 'bottom',
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize),//点击页码事件
      },
      dialogVisible: false,
      form: {
        content: '',
        rangeTime: [],
        startTime: '',
        endTime: '',
        status: false
      },
      rules: {
        content: [{ required: true, message: '请输入公告内容', trigger: 'change' }],
        rangeTime: [{ required: true, message: '请选择展示时间', trigger: 'change' }],
      },
      searchParams: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter(params) {
      this.searchParams = { ...params }
      this.getList()
    },
    getList() {
      const { current, pageSize } = this.pagination
      const params = { page: current, size: pageSize, ...this.searchParams }
      getSenstiveList(params).then(res => {
        if (res.code === 5200) {
          this.list = res.data.list
          this.pagination.total = res.data.total
        }
      })
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day');
    },
    // 添加公告信息
    createMenus() {
      this.form = this.$options.data().form
      this.dialogVisible = true
    },
    isChange(val) {
      this.form.status = val
    },
    // 编辑公告问题
    editProblem(record) {
      this.form = JSON.parse(JSON.stringify(record))
      this.$set(this.form, 'rangeTime', [moment(this.form.startTime), moment(this.form.endTime)])
      this.dialogVisible = true
    },
    submitForm(form) {
      this.form.startTime = moment(this.form.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss')
      this.form.endTime = moment(this.form.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateNotice(this.form).then(res => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message)
                this.dialogVisible = false
                this.getList()
              }
            })
          } else {
            insertNotice(this.form).then(res => {
              if (res.code === 5200) {
                this.$antmessage.success(res.message)
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        }
      })
    },
    // 删除常见问题
    deleteProblem(id) {
      let _this = this
      this.$antconfirm({
        title: '确定删除公告？',
        content: '删除操作后，商城公告信息将不展示',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          delNotice({ id }).then(res => {
            if (res.code === 5200) {
              _this.$antmessage.success('删除成功')
              let { current, total, pageSize } = _this.pagination
              _this.pagination.current = (total - 1) % pageSize === 0 && _this.data.length === 1 ? current - 1 : current
              _this.getList()
            }
          })
        },
        onCancel() {
          _this.$antmessage.info('取消删除')
        }
      })
    },
    onPageChange(current, pageSize) {
      this.pagination.current = current
      this.getList()
    }
  },
  filters: {
    formatRq(data) {
      if (data > 50) {
        return 'red'
      } else {
        return 'blue'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/page-public.less");
a {
  color: #1890ff;
}
</style>