import { http, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

//获取报价明细数据
export const fetchHeaderData = (params) => {

  const { rfxHeaderId, tenantId, sourceResultId, ...otherParams } = params || {};
  // 协议通过sourceResultId查询报价明细
  if (sourceResultId) {
    const organizationIds = tenantId || organizationId;
    const url = `ssrc/v1/${organizationIds}/rfx/external/quotationTemplate/view`;
    return http.get(url, { params: otherParams });
  }
  const sourceFrom = otherParams.sourceFrom === "RFX" || otherParams.sourceFrom === "PROJECT" ? "rfx" : "bid";
  const organizationIds = tenantId || organizationId;
  const url = `ssrc/v1/${organizationIds}/${sourceFrom}/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params: otherParams });
};