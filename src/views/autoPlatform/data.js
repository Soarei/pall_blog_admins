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
let voiceList = [
  {
    id: 'BV701_streaming',
    label: '擎苍'
  },
  {
    id: 'BV123_streaming',
    label: '阳光青年'
  },
  {
    id: 'BV120_streaming',
    label: '反卷青年'
  },
  {
    id: 'BV217_streaming',
    label: '沪上阿姐'
  },
  {
    id: 'BV104_streaming',
    label: '温柔淑女'
  }
]
let emotionList = [
  {
    id: 'pleased',
    label: '愉悦'
  },
  {
    id: 'sorry',
    label: '抱歉'
  },
  {
    id: 'annoyed',
    label: '嗔怪'
  },
  {
    id: 'scare',
    label: '害怕'
  },
  {
    id: 'angry',
    label: '愤怒'
  },
  {
    id: 'hate',
    label: '憎恨'
  },
  {
    id: 'sad',
    label: '悲伤'
  },
  {
    id: 'surprise',
    label: '惊讶'
  }
]
let audioColumns = [
  {
    title: " ID",
    dataIndex: "id",
    key: "id",
    ellipsis: true,
    width: 70,
  },
  {
    title: " 音色Code",
    dataIndex: "voiceCode",
    key: "voiceCode",
    ellipsis: true,
    width: 150,
  },
  {
    title: " 音色名称",
    dataIndex: "voiceName",
    key: "voiceName",
    ellipsis: true,
    width: 150,
  },
  {
    title: " 创建时间",
    dataIndex: "startTime",
    key: "startTime",
    ellipsis: true,
    width: 150,
  },
  {
    title: "风格/情感",
    scopedSlots: { customRender: "stylelist" },
    ellipsis: true,
    width: 150,
  },
  {
    title: "所属类型",
    dataIndex: "type",
    key: "type",
    ellipsis: true,
    width: 150,
  },
  {
    title: "操作",
    fixed: "right",
    width: 200,
    scopedSlots: { customRender: "action" },
  },
]
let audioSearchOptions = [
  {
    label: "音色名称",
    value: "voiceName",
    placeholder: "请输入",
    type: "input",
  },
]
let audiorenderButton = {
  query: {
    label: "查询",
    type: "search",
  },
  export: {
    label: "导出",
    type: "export",
  },
}

module.exports = {
  columns,
  searchOptions,
  renderButton,
  voiceList,
  emotionList,
  audioColumns,
  audioSearchOptions,
  audiorenderButton
}