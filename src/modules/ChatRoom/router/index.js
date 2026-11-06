let route = [
  {
    path: "/ChatRoom",
    name: "ChatRoom",
    meta: {
      appName: "在线沟通",
    },
    component: (resolve) => require(["../views/ChatRoom"], resolve),
  },
  {
    path: "/RoomDetail",
    name: "RoomDetail",
    meta: {
      appName: "房间详情",
    },
    component: (resolve) => require(["../views/RoomDetail"], resolve),
  },
  {
    path: "/RoomLabel",
    name: "RoomLabel",
    meta: {
      appName: "群信息",
    },
    component: (resolve) => require(["../views/RoomInfo/Label.vue"], resolve),
  },
  {
    path: "/RoomMember",
    name: "RoomMember",
    meta: {
      appName: "群成员",
    },
    component: (resolve) => require(["../views/RoomInfo/Member.vue"], resolve),
  },
  {
    path: "/RoomAnnouncement",
    name: "RoomAnnouncement",
    meta: {
      appName: "修改群公告",
    },
    component: (resolve) => require(["../views/Edit/RoomAnnouncement.vue"], resolve),
  },
  {
    path: "/RoomName",
    name: "RoomName",
    meta: {
      appName: "修改群名称",
    },
    component: (resolve) => require(["../views/Edit/RoomName.vue"], resolve),
  },
  {
    path: "/RecordSearch",
    name: "RecordSearch",
    meta: {
      appName: "搜索聊天记录",
    },
    component: (resolve) => require(["../views/MessageRecords/Search.vue"], resolve),
  },
  {
    path: "/FileRecordList",
    name: "FileRecordList",
    meta: {
      appName: "文件",
    },
    component: (resolve) => require(["../views/MessageRecords/FileRecordList.vue"], resolve),
  },
  {
    path: "/ImageRecordList",
    name: "ImageRecordList",
    meta: {
      appName: "图片及视频",
    },
    component: (resolve) => require(["../views/MessageRecords/ImageRecordList.vue"], resolve),
  },
  {
    path: "/TextRecordList",
    name: "TextRecordList",
    meta: {
      appName: "文本记录",
    },
    component: (resolve) => require(["../views/MessageRecords/TextRecordList.vue"], resolve),
  },
];

export default route;
