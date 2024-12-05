let columns = [
  {
    title: " ID",
    dataIndex: "id",
    key: "id",
    ellipsis: true,
    width: 100,
  },
  {
    title: "素材图",
    scopedSlots: { customRender: "goodsPicture" },
    width: 100,
  },
  {
    title: "习惯名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 200,
  },
  {
    title: " 打卡周期",
    scopedSlots: { customRender: "collectUrl" },
    // dataIndex: "collectUrl",
    // key: "collectUrl",
    // ellipsis: true,
    width: 240,
  },
  {
    title: " 创建时间",
    dataIndex: "createTime",
    key: "createTime",
    ellipsis: true,
    width: 200,
  },
  {
    title: "状态",
    width: 100,
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: 160,
    fixed: 'right'
  },
]

let searchOptions = [
  {
    label: "商品名称",
    value: "goodsName",
    placeholder: "请输入",
    type: "input",
  },
]
let renderButton = {
  query: {
    label: "查询",
    type: "search",
  },
}
let plainOptions = [
  {
    value: 0,
    label: '周一'
  },
  {
    value: 1,
    label: '周二'
  },
  {
    value: 2,
    label: '周三'
  },
  {
    value: 3,
    label: '周四'
  }
]
let formRules = {
  name: [{ required: true, message: "请输入习惯名称", trigger: "blur" }],
  url: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
}
module.exports = {
  columns,
  searchOptions,
  renderButton,
  formRules,
  plainOptions
}