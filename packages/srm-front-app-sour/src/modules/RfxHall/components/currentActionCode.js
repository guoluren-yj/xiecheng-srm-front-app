// 操作code
export function currentActionCode(record = {}) {
  const { rfxStatus = null, } = record || {};

  let code = "";
  if (!rfxStatus) {
    return code;
  }

  // 报价中/议价中/多轮
  if (rfxStatus === "IN_QUOTATION") {
    code = "SSRC_RFX_QUOTATIOIN_ATTENTION";
  }
  if (rfxStatus === "BARGAINING") {
    code = "SSRC_RFX_BARGAIN_ATTENTION";
  }
  if (rfxStatus === "ROUND_QUOTATION") {
    code = "SSRC_RFX_ROUND_QUOTATIOIN_ATTENTION";
  }

  // SSRC_RFX_COMMON_STATUS_ATTENTION  other status

  return code;
}