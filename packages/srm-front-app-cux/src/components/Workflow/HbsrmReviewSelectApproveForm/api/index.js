import { http, SrmUtil } from "srm-mobile-ui";

// 审批同意
export const toApprovalList = (params, rfxSplitNum) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/fJNfgQHDzLCMyZCpZBib28ibkiaKgG9Mjlevlp8txVxic24?rfxSplitNum=${rfxSplitNum}&action=SELECTED`;
  return http.post(url, params);
};