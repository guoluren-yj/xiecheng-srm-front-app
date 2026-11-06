import { http, SrmUtil } from "srm-mobile-ui";

// 询价单头信息、采购组织及人员
export const getRfxHeaderApi = (params, rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}`;
  return http.get(url, { params });
};

//全部物料筛选
export const getBatchApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check/batch`;
  return http.post(url, params);
};

//阶梯报价
export const getLadderQuotationApi = (quotationLineId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${quotationLineId}/ladder-quotation`;
  return http.get(url);
};

//报价明细接口
export const getPriceDetailApi = (params) => {
  const { rfxHeaderId } = params;
  const sourceFrom = params.sourceFrom === "RFX" ? "rfx" : "bid";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/${sourceFrom}/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};

//报价明细信息
export const getQuotationTemplateApi = (rfxHeaderId, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};

//核价保存数据
export const saveCheckDataApi = (params) => {
  const { customizeUnitCode, ...otherParams } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check?customizeUnitCode=SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL,SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO${customizeUnitCode ? `,${customizeUnitCode}` : ""}`;
  return http.post(url, otherParams);
};

//获取物料头数据
export const getItemDataApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/items`;
  return http.get(url, { params });
};

//获取物料数据
export const getCheckDataApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check`;
  return http.get(url, { params });
};

//获取操作记录数据
export const getActionDataApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/actions?page=0&size=10`;
  return http.get(url);
};

//再次询价
export const inquiryAgainApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/round?rfxHeaderId=${rfxHeaderId}`;
  return http.post(url);
};

//获取供应商数据
export const getSupplierDataApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/check/suppliers?page=0&size=10`;
  return http.get(url);
};

//核价提交数据
export const submitCheckDataApi = (params) => {
  const { rfxHeaderId, customizeUnitCode } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check/submit?rfxHeaderId=${rfxHeaderId}&customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

//供应商整包推荐
export const supplierAllSuggestApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/suppliers/single`;
  return http.post(url, params);
};

//发起多轮询价
export const beginRoundQuotationApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/round-headers/${rfxHeaderId}/begin-round-quotation`;
  return http.post(url);
};

//核价退回评审
export const submitReturnToPretrialApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/pretrial/back`;
  return http.post(url, params);
};

//获取多轮报价创建新报价
export const getCreateNewQuoteApi = (id, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/round-headers/start-quotation/${id}?roundQuotationEndDate=${params.roundQuotationEndDate}&startingReason=${params.startingReason}`;
  const postParams = {
    roundQuotationEndDate: params.roundQuotationEndDate,
    startingReason: params.startingReason,
  };
  return http.post(url, postParams);
};

// 多轮报价确定
export const getSubmitQuotaeApi = (id, sourceFrom) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/round-headers/end-quotation/${id}?sourceFrom=${sourceFrom}`;
  return http.post(url);
};

//获取多轮报价头信息
export const getHeadInfoApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}`;
  return http.get(url);
};

//获取多轮报价行信息
export const getLineInfoApi = (id, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/round-headers/${id}/all-round-quotation`;
  return http.get(url, { params });
};
