import { http, SrmUtil } from "srm-mobile-ui";

// 获取核价结果审批标段信息
export const getProjectSection = (rfxHeaderIds) => http.get(`/ssrc/v2/${SrmUtil.getTenantId()}/rfx/project/section`, { params: { rfxHeaderIds } });

// 获取rfx头信息
export const getRfxHeader = (sourceHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${sourceHeaderId}`, {
  params: {
    customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO,SSRC.INQUIRY_HALL_CHECK_PRICE.COST",
    sourceHeaderId
  }
});

// 获取rfx头信息
export const getRfxItemLines = (sourceHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${sourceHeaderId}`, {
  params: {
    customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO",
    sourceHeaderId
  }
});

// 获取rfx头信息
export const getRfxItemLinesCheck = (rfxHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check`, {
  params: {
    page: 0,
    size: 1000,
    customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL",
    rfxHeaderId
  }
});

// 获取过程附件
export const getProcessFileApi = (rfxHeadId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeadId}/process-attachment/download-query`);

// 获取专家评分
export const getRfxScoreApi = (rfxHeadId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeadId}/score/detail`, {
  params: {
    sourceForm: "RFX",
    organizationId: SrmUtil.getTenantId()
  }
});

//采购申请查询接口
export const getPurchaseApi = (params) => http.get(`/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/purchase-platform/execution-status-tracking-tiled/page`, { params });

// 获取文件列表
export const getFileList = ({ uuid } = {}) => http.get(`/hfle/v1/${SrmUtil.getTenantId()}/files/${uuid}/file`, {
  params: {
    attachmentUUID: SrmUtil.getTenantId(),
    bucketName: "public-bucket",
    size: 1000,
  }
});