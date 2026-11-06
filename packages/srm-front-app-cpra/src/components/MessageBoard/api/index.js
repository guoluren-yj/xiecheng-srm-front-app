/**
 * 与 【订单留言板】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

/*
提交留言信息or上传附件
*/
export const sendMessageApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-messages`;
  return http.post(url, params);
};
/*
查询留言信息
*/
export const getMessageApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-messages`;
  return http.get(url, { params });
};

/*
撤回留言信息
*/
export const recallMessage = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-messages`;
  return http.delete(url, params);
};
