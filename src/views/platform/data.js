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
let columns = [
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
let searchOptions = [
  {
    label: "音色名称",
    value: "voiceName",
    placeholder: "请输入",
    type: "input",
  },
]
let renderButton = {
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
  voiceList,
  emotionList,
  columns,
  searchOptions,
  renderButton
}