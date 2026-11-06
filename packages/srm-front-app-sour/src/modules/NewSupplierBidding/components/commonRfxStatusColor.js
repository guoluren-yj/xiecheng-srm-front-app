// SSRC.RFX_DISPLAY_QUOTATION_STATUS  状态
/**
 NOT_PARTICIPATED 未参与
 ABANDONED 已放弃
 PENDING_PREQUAL 未提交资格预审
 RETURN_PREQUAL 预审退回
 IN_PREQUAL 预审审批中
 NOT_BIDDING 预审未通过
 NOT_START 报价未开始
 NOT_QUOTED 未报价
 QUOTED 已报价
 BARGAINED 已还价
 QUOTED_END 报价截止
 BARGAINING 议价中
 BARGAINED_REPLIED 议价已回复
 CHECK_PENDING 待核价
 OBSOLETE 已淘汰
 BIDDED 已中标
 NOT_BIDDED 未中标
 PAUSED 暂停
 CLOSED 关闭
 * */

const commonRfxStatusColor = (val = "", meaning = "") => {
  let color = "#FFC043";

  const status1 = val === "NOT_START" ||
    val === "NOT_PARTICIPATED" ||
    val === "PENDING_PREQUAL" ||
    val === "IN_PREQUAL" ||
    val === "RETURN_PREQUAL" ||
    val === "NOT_START" ||
    val === "NOT_QUOTED" ||
    val === "QUOTED" ||
    val === "BARGAINED" ||
    val === "BARGAINING" ||
    val === "BARGAINED_REPLIED" ||
    val === "CHECK_PENDING";
  const status2 = val === "BIDDED";
  const status3 = val === "ABANDONED" || val === "OBSOLETE" || val === "CLOSED";
  const status4 = val === "NOT_BIDDING" || val === "QUOTED_END";

  if (status1) {
    color = "#FFC043";
  } else if (status2) {
    color = "#05944F";
  } else if (status3) {
    color = "#AFAFAF";
  } else if (status4) {
    color = "#E11900";
  }

  return (
    <span style={{ color: color, }}>
      { meaning ?? "" }
    </span>
  );
};

export { commonRfxStatusColor };
