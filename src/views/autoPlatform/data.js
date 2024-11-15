let columns = [
  {
    title: " ID",
    dataIndex: "id",
    key: "id",
    ellipsis: true,
    width: 100,
  },
  {
    title: " 商品图片",
    scopedSlots: { customRender: "goodsPicture" },
    width: 100,
  },
  {
    title: " 商品标题",
    dataIndex: "goodsName",
    key: "goodsName",
    ellipsis: true,
    width: 200,
  },
  {
    title: " 商品链接",
    scopedSlots: { customRender: "collectUrl" },
    // dataIndex: "collectUrl",
    // key: "collectUrl",
    // ellipsis: true,
    width: 240,
  },
  {
    title: " 采集时间",
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
  {
    label: '采集时间',
    value: 'rangeTime',
    placeholder: '请选择',
    type: 'date',
  },
]
let renderButton = {
  query: {
    label: "查询",
    type: "search",
  },
  rowsImport: {
    label: "批量采集",
    type: "rowsImport",
  }
}
module.exports = {
  columns,
  searchOptions,
  renderButton
}