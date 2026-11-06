import { SrmUtil } from "srm-mobile-ui";
import { isEmpty, isArray } from "lodash";

import { fetchConfigSheet } from "./api";

// 查询招标文件模板是否启用
export async function queryBidFileTemplateConfig() {
  let data = null;

  let flag = false;
  const param = {
    configCode: "ssrc_file_template_cnf",
    data: {
      tenantNum: SrmUtil.getUserInfo().tenantNum,
    },
  };

  data = await fetchConfigSheet(param);
  if (data && data.failed) {
    return flag;
  }
  if (!isEmpty(data)) { // 黑名单
    flag = false;
  } else {
    flag = true;
  }

  return flag;
}

// 获取核价-附件列表个性化编码
export function getCustomizeUnitCode({ type = null, bidFlag } = {}) {

  if (!type || isEmpty(type)) {
    return null;
  }

  const RfxCodeMap = new Map([
    // 寻源大厅-核价
    [ "fileTempAttach-update", "SMBL.INQUIRY_HALL.LIST.CHECK_PRICE.FILE_TEMPLATE_ATTACHMENT" ],
    // 寻源大厅-核价明细页面
    [ "fileTempAttach-detail", "SMBL.INQUIRY_HALL.CHECK_PRICE.FILE_TEMPLATE_ATTACHMENT" ],
    // 核价概览审批-新
    [ "fileTempAttach-approval-overview", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.RFX_FILE_TEMPLATE_ATTACHMENT" ],
    // 核价审批-老
    [ "fileTempAttach-approval", "SMBL.WORKFLOW.PRICING_APPROVAL_RFX.FILE_TEMPLATE_ATTACHMENT" ],
    // 退回至核价审批概览
    [ "fileTempAttach-back-to-check-price-overview", "SMBL.WORKFLOW.RFX_BACK_TO_CHECK_PRICE_OVERVIEW.FILE_TEMPLATE_ATTACHMENT" ]
  ]);

  const BidCodeMap = new Map([
    // 招标工作台-定标
    [ "fileTempAttach-update", "SMBL.NEW_BID_HALL.BID_SELECTION.FILE_TEMPLATE_ATTACHMENT" ],
    // 招标工作台-定标明细
    [ "fileTempAttach-detail", "SMBL.NEW_BID_HALL.BID_SELECTION_DETAIL.FILE_TEMPLATE_ATTACHMENT" ],
    // 定标概览审批
    [ "fileTempAttach-approval-overview", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.FILE_TEMPLATE_ATTACHMENT" ],
    // 定标审批-老
    [ "fileTempAttach-approval", "SMBL.WORKFLOW.PRICING_APPROVAL_BID.FILE_TEMPLATE_ATTACHMENT" ],
    // 退回至定标审批概览
    [ "fileTempAttach-back-to-check-price-overview", "SMBL.WORKFLOW.RFX_BACK_TO_CHECK_PRICE_OVERVIEW_BID.FILE_TEMPLATE_ATTACHMENT" ]
  ]);

  const CodeDataMap = !bidFlag ? RfxCodeMap : BidCodeMap;
  let currentUnitCode = null;

  if (typeof type === "string") {
    currentUnitCode = CodeDataMap.get(type);
  }

  if (isArray(type)) {
    const codeSet = new Set();
    type.forEach((unitCode) => {
      const currentCode = CodeDataMap.get(unitCode);
      if (!currentCode) {
        return;
      }
      codeSet.add(currentCode);
    });

    currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
  }

  return currentUnitCode;
}