import { judgeMessageRecords } from "../utils/message";

const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {
  init: false,
  id: null,
  socket: null,
  roomInfo: {}, // 房间信息
  originMessage: [], // 原始消息
  announcement: "", // 群公告
  sendTextValue: "", // 发送文本消息内容
  searchTextValue: "", // 搜索文本消息内容
  panelVm: null, // 聊天面板vue实例
  editorVm: null, // 输入框vue实例
  messageMenu: {
    // 长按消息菜单
    msgId: "", // 当前打开菜单的消息ID
    list: [], // 消息列表
  },
  quoteMsgId: "", // 引用的消息ID
};

// 处理成员列表
const parseMembers = (list = [], isPurchase = false) => {
  const members = [];
  list.forEach((item) => {
    members.push(
      ...(item.members?.map((member) => ({
        ...member,
        name: member.displayName?.slice(0, 1),
        companyName: item.displayName,
        isPurchase,
      })) || [])
    );
  });
  return members;
};

export default {
  namespaced: true,
  state,
  getters: {
    ...createGetter(state),
    message(_state) {
      return judgeMessageRecords(_state.originMessage, _state.roomInfo);
    },
    memberInfo(_state) {
      const { purchase = {}, suppliers = [] } = _state.roomInfo;
      const purchaseMembers = parseMembers([purchase], true);
      const supplierMembers = parseMembers(suppliers);
      const members = [...supplierMembers, ...purchaseMembers];
      return { members, purchaseMembers, supplierMembers };
    },
  },
  mutations: createMutations(state),
};
