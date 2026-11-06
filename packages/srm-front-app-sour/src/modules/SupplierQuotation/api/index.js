
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取供应商报价列表
export const getDeliveryList = (params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/list?customizeUnitCode=SSRC.SUPPLIER_QUOTATION_LIST.QUOTATION_TABLE`, { params });

// 获取供应商-客户
export const getSupplierApi = (params) => http.get("/hpfm/v1/lovs/sql/data", { params });

// 获取寻源类别
export const getSourceCategoryList = () => http.get("/hpfm/v1/lovs/value/batch?sourceCategory=SSRC.SOURCE_CATEGORY");

// 获取头信息
export const getOrderHeadInfo = (rfxHeaderId, type, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${type}/${rfxHeaderId}/header`, { params });

// 获取资格预审信息
export const getPreQualInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/prequal`, { params });

// 提交资格预审信息
export const submitPrequalificationApi = (supplierCompanyId, params) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/prequel/submit?supplierCompanyId=${supplierCompanyId}`, params);

// 获取行信息(报价和竞价订单)
export const getOrderLineInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines?`, { params });

// 获取行信息(参与订单)
export const getOrderLineInfos = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/items`, { params });

// 报价参与
export const getParticipateApi = (params) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/participate`, params);

// 放弃参与
export const getAbandonApi = (params) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/abandon`, params);

// 获取操作记录
export const getOperationRecordsApi = ({ asnHeaderId, page = 0, size = 10 }) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action?page=${page}&size=${size}`);

// 获取头信息附件ssrc-rfx-rfxheader
export const getFileApi = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 获取供应商附件ssrc-rfx-quotationheader
export const getSupplierFileApi = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 删除供应商附件ssrc-rfx-quotationheader
export const delSupplierFile = (attachmentUUID, params) => http.post(`/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`, params);

// 获取资格预审文件ssrc-rfx-prequal
export const getPrequalificationFile = (attachmentUUID, params) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&organizationId=${storage.getItem("organizationId")}`, params);

// 删除资格预审文件ssrc-rfx-prequal
export const delPrequalificationFile = (attachmentUUID, params) => http.post(`/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&tenantId=${storage.getItem("organizationId")}`, params);

// 获取行信息供应商附件ssrc-rfx-quotationline
export const getLineRfxFile = (attachmentUUID, params) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&tenantId=${storage.getItem("organizationId")}`, params);

// 删除行信息供应商附件ssrc-rfx-quotationline
export const delLineRfxFile = (attachmentUUID, params) => http.post(`/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&tenantId=${storage.getItem("organizationId")}`, params);

// 获取行信息询价单附件ssrc-rfx-rfxitem
export const getInquiryFile = (attachmentUUID, params) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&tenantId=${storage.getItem("organizationId")}`, params);

// 获取上传附件UUID
export const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 保存生成的UUID
export const saveFileUUIDApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/header/attachment`;
  return http.post(url, params);
};

// 报价单阶梯报价列表
export const getQuotationInfo = (quotationLineId, params, type) => {
  let url = type ? `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`;
  return http.get(url, { params });
};
// 获取报价明细
export const getQuotationDetailApi = (rfxHeaderId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};

// 报价单阶梯报价保存
export const saveQuotationInfo = (quotationLineId, body) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`, body);

// 报价单阶梯报价删除
export const deleteQuotationInfo = (quotationLineId, body) => http.delete(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`, body);

// 报价单保存
export const saveQuotation = (body) =>
  // return http.post(`/ssrc/v1/${storage.getItem('organizationId')}/rfx/quotation/save`, body)
  http.post(`ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/update/quotation-header?customizeUnitCode=SSRC.SUPPLIER_QUOTATION.LINE,SSRC.SUPPLIER_QUOTATION.LINE_FORM,SSRC.SUPPLIER_QUOTATION.ITEM,SMBL.SUPPLIER_QUOTATION.QUOTE_BID_MATERIAL_DETIAL,SMBL.SUPPLIER_QUOTATION.QUOTE_MATERIAL_DETIAL,SMBL.SUPPLIER_QUOTATION.BARGAIN_MATERIAL_DETIAL_NEW,SMBL.SUPPLIER_QUOTATION.MATERIAL_DETIAL`, body)
  ;

// 报价单提交
export const submitQuotation = (body) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/submit?customizeUnitCode=SSRC.SUPPLIER_QUOTATION.LINE,SSRC.SUPPLIER_QUOTATION.LINE_FORM,SSRC.SUPPLIER_QUOTATION.ITEM,SSRC.SUPPLIER_QUOTATION.BASE_FORM`, body);

// 报价明细保存
export const saveQuotationDetail = (quotationHeaderId, body) => http.post(`/ssrc/v1/${storage.getItem("organizationId")}/share/sup-dtl/${quotationHeaderId}`, body);

// 报价明细删除
export const deleteQuotationDetail = (sourceHeaderId, quotationLineId, params) => http.delete(`ssrc/v1/${storage.getItem("organizationId")}/share/sup-dtl/${sourceHeaderId}/${quotationLineId}/supQuotationDetails/batchDelete`, params);
// 查询报价明细模板
export const getAddTemplate = (templateId) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/quotation-column/${templateId}`);

//获取配置信息
export const getSetting = () => http.get(`/spfm/v1/${storage.getItem("organizationId")}/settings/batch?011108=011108`);

// 获取报价明细附件
export const getRfxDetailFileApi = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 适用范围-配置列表查询
export const fetchApplicationScoreUnitList = (params = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/source-app-scopes`;
  return http.get(url, { params });
};

// 获取密封头信息
export const getPurQueryHeadInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/tender/${rfxHeaderId}/header`, { params });

// 获取头信息
export const getQueryHeadInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/header`, { params });

// 获取密封行信息
export const getPurOrderLineInfos = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/tender/${rfxHeaderId}/items`, { params });
