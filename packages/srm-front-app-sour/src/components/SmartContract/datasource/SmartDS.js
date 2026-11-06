/*
 * @Description: 智能审查数据源
 * @Date: 2025-09-03 09:20:33
 * @Author: MYT<yitian.mao@going-link.com>
 * @Version: 1.0.0
 * @Copyright: Copyright (c) 2021, ZhenYun
 */
import { SrmUtil } from "srm-mobile-ui";
import { SRM_SPCM } from "@/utils/utils";

const smartReviewDS = ({ pcHeaderId, onlyPassFlag } = {}) => ({
  paging: false,
  forceValidate: true,
  queryParameter: {
    // customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.HEADER" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL",
    pcHeaderId,
    sortField: "riskLevel",
    onlyPassFlag,
  },
  fields: [],
  transport: {
    read: {
      url: `${SRM_SPCM}/v1/${SrmUtil.getTenantId()}/check-point-results/list`,
      method: "get",
    },
  },
});

export { smartReviewDS };