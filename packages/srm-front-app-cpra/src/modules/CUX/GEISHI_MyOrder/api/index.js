import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//订单-创建
const sodrCreate = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/from-pr/line-new/check`;
  return http.post(url, params);
};

// 按行引用创建前校验
const check = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/po_config`;
  return http.get(url, { params });
};

// 转单校验业务规则-推荐供应商/价格校验是否最新
const poFromPrLineNewCheck = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/from-pr/line-new/check`;
  return http.post(url, params);
};

//订单-重新同步
const reSyncBatch = ({ data }) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-line-sync/retry/batch`;
  return http.post(url, data);
};

// 查询订单下单控制-供应商生命周期管理 业务规则定义
const queryOrderControlConfig = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/config/life-cycle-phase`;
  return http.get(url, { params });
};

// 订单明细-保存
const newSave = (params) => {
  const { data, customizeUnitCode } = params;
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/by-pr/maintain?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, data);
};

// 订单明细-保存弱校验
const saveWarn = (params) => {
  const { data, customizeUnitCode } = params;
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/save-warn?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, data);
};

// 订单提交预校验协议
const associatedPcCheck = (params) => {
  const { pageType, body } = params;
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-associated-pc-check/${pageType}`;
  return http.post(url, body);
};

// 引用申请转订单创建提交
const poFromPrSubmit = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/from-pr/line_new?poWorkbenchFlag=1`;
  return http.post(url, params);
};

// 整单删除
const fetchDelete = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header`;
  return http.delete(url, params);
};

// 订单提交预校验协议占用金额
const associatedPcAmountCheck = (params) => {
  const { pageType, body } = params;
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-associated-pc-amount-check/${pageType}`;
  return http.post(url, body);
};

// 订单提交校验是否弹出付款计划弹窗
const paymentCheckSubmit = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/payment-check/detail/submit`;
  return http.post(url, params);
};

// 订单提交校验（采购申请）
const submitValidate = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/by-pr/validate`;
  return http.post(url, params);
};

// 订单提交
const submitDetail = ({ customizeUnitCode, data }) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/submit?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, data);
};

// 订单提交添加一个新接口
const addNewSubmitDetail = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-header/submit-warn`;
  return http.post(url, params);
};

// 预算校验
const budgetVerification = (params) => {
  const url = `spuc/v1/${storage.getItem(
    "organizationId",
  )}/po-budget-check`;
  return http.post(url, params);
};

export {
  sodrCreate,
  reSyncBatch,
  queryOrderControlConfig,
  newSave,
  saveWarn,
  associatedPcCheck,
  check,
  poFromPrLineNewCheck,
  poFromPrSubmit,
  fetchDelete,
  associatedPcAmountCheck,
  paymentCheckSubmit,
  submitValidate,
  submitDetail,
  addNewSubmitDetail,
  budgetVerification,
};
