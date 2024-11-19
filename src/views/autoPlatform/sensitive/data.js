let columns = [
  {
    title: " ID",
    dataIndex: "id",
    key: "id",
    ellipsis: true,
    width: 100,
  },
  {
    title: " 敏感词",
    dataIndex: "content",
    key: "content",
    ellipsis: true,
    width: 100,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    key: "create_time",
    ellipsis: true,
    width: 200,
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
    label: "敏感词",
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

module.exports = {
  columns,
  searchOptions,
  renderButton
}