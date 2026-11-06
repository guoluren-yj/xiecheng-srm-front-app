import { SrmUtil, http } from "srm-mobile-ui";

/**
 *查询专家库注册申请明细
 *
 * @export
 * @param {Number} params.expertReqId
 * @returns
 */

// 头信息查询
export const getExpertRegisDetailData = (expertReqId, params = {}) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/expert-req/queryDetail/${expertReqId}`;
  return http.get(url, { params });
};