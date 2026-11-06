import { http, SrmUtil } from "srm-mobile-ui";

const SRM_SMBL = "/smbl";

// 查询房间信息
export async function getUserChatRoomInfoApi(params) {
  return http.get(`${SRM_SMBL}/v1/chat-online/room/user-room-info`, { params });
}

// 查询房间消息
export async function getChatRoomMessagesApi(params) {
  return http.get(`${SRM_SMBL}/v1/chat-online/messages/list`, { params });
}

// 查询房间公告
export async function getRoomAnnouncementApi(params) {
  return http.get(`${SRM_SMBL}/v1/chat-online/messages/last-announcement`, { params });
}

// 更新房间公告
export async function updateRoomAnnouncementApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/messages/publish-announcement`, params);
}

// 更新群名称
export async function updateChatRoomNameApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/room/rename-room`, params);
}

// 置顶在线沟通聊天室
export async function topChatRoomApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/user/room/top-room`, params);
}

// 取消置顶在线沟通聊天室
export async function cancelTopChatRoomApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/user/room/cancel-top-room`, params);
}

// 禁言
export async function muteChatRoomApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/room/mute-room`, params);
}

// 解除禁言
export async function cancelMuteChatRoomApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/room/unmute-room`, params);
}

// 发送消息
export async function sendMessageApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/messages/send`, params);
}

// 撤回消息
export async function recallMessageApi(params) {
  return http.post(`${SRM_SMBL}/v1/chat-online/messages/recall-message`, params);
}

// 请求历史消息
export async function getChatRoomHistoryMessagesApi(params) {
  return http.get(`${SRM_SMBL}/v1/chat-online/messages/search-message`, { params });
}

// 上传附件接口
export async function uploadFileApi(file) {
  const url = `/hfle/v1/${SrmUtil.getOrganizationId()}/files/multipart`;
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("bucketName", SrmUtil.getDefaultBucketName());
  formData.append("directory", "smbl-chatonline");
  formData.append("fileName", file.name);
  return http.post(url, formData, { responseType: "text" });
}
