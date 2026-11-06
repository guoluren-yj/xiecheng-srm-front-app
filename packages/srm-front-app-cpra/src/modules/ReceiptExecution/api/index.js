import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// eslint-disable-next-line no-unused-vars
const bucketName = "private-bucket";

// 获取树形列表
export const getTreeListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/left-tree`;

  return http.get(url, { params });
};

// 获取未执行列表
export const getWaitListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/waiting`;

  return http.get(url, { params });
};

// 获取执行中列表
export const getDoingListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/doing`;

  return http.get(url, { params });
};

// 获取已执行明细列表
export const getLineListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/finish/line`;

  return http.get(url, { params });
};

// 获取已执行d单列表
export const getHeaderListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/finish/header`;

  return http.get(url, { params });
};

// 获取列表的进度
export const getProgressApi = (urlP, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/${urlP}`;

  return http.get(url, { params });
};

// 获取执行中列表策略
export const getCodeTypeApi = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`;

  return http.get(url, { params });
};

// 获取已执行列表退回原因
export const getReasonApi = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`;

  return http.get(url, { params });
};

// 执行中部分获取lov数据
export const getExecLovApi = (param) => {
  const { listStatus, ...params } = param;
  let url;

  if (listStatus === "WAITING") {
    url = "/spuc/v1/lovs/sql/data";
  } else {
    url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/line/reverse-node-url`;
  }
  console.log(params);
  return http.get(url, { params });
};

// 执行
export const getBatchSetExecApi = (list, type, params) => {
  const urlP =
    type === "WAITING" ?
      "waiting-todo-sinv" :
      type === "DOING" ?
        "doing-sinv" :
        "finished-line-todo-sinv";
  const { customizeUnitCode, rcvTrxTypeId, rcvTypeCode = "", nodeConfigId = "" } = params;
  const url = `spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/${urlP}?customizeUnitCode=${customizeUnitCode}&rcvTrxTypeId=${rcvTrxTypeId}&rcvTypeCode=${rcvTypeCode}&nodeConfigId=${nodeConfigId}`;

  return http.post(url, list);
};

//全部执行
export const getBatchSetAllExecApi = (rcvTrxTypeId, params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/waiting-todo-sinv-all?rcvTrxTypeId=${rcvTrxTypeId}`;

  return http.post(url, params);
};

// 获取执行中头部信息
export const getHeadInfoApi = (id, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/${id}/detail`;

  return http.get(url, { params });
};

// 获取执行中行信息
export const getLineInfoApi = (id, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/line/${id}/detail`;

  return http.get(url, { params });
};

// 保存执行中全部信息
export const getDoingSaveApi = (customizeUnitCode, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/save?customizeUnitCode=${customizeUnitCode}`;

  return http.put(url, params);
};

// 提交执行中全部信息
export const getDoingSubmitApi = (customizeUnitCode, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/submitted?customizeUnitCode=${customizeUnitCode}`;

  return http.post(url, params);
};

// 删除执行中全部信息
export const getDoingDeleteApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/delete`;

  return http.delete(url, params);
};
