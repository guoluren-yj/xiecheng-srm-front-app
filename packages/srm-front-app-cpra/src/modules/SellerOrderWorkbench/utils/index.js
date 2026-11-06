import { $T } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { SrmMath, SrmButton } from "srm-mobile-ui";

/*
 * 金额格式化
 * @param {Number} aumont 金额
 * @param {Number} precision 精度
 * @param {Boolean} isSupplement 是否补0
 * @returns
 */
export function formatAumont(aumont, precision, isSupplement) {
  if (isNaN(parseFloat(aumont))) {
    return null;
  }
  const decimal = String(aumont).split(".")[1];
  let newPrecision = Number(precision);
  newPrecision = isNaN(newPrecision) ? null : newPrecision > 20 ? 20 : newPrecision;
  if ((decimal && decimal.length && decimal.length < newPrecision || !decimal) && !isSupplement) {
    newPrecision = null;
  }
  return SrmMath.toFormat(aumont, newPrecision, BigNumber.ROUND_HALF_CEIL);
}

export function renderStatus(code, meaning) {
  const colorConfigList = [
    {
      // 黄色
      status: [
        "PENDING",
        "SUBMITTED",
        "SUBMITTED_WFL",
        "DELIVERY_DATE_REVIEW",
        "CLOSEING",
        "CANCELING",
        "CLOSETOBECOMFIRMED",
        "CANCELTOBECOMFIRMED",
      ],
      type: "warn",
    },
    {
      // 蓝色
      status: [ "APPROVED", "PUBLISHED", "CONFIRMED", "PART_FEED_BACK" ],
      type: "success",
    },
    {
      // 红色
      status: [ "REJECTED", "DELIVERY_DATE_REJECT" ],
      type: "danger",
    },
    {
      // 黑色
      status: [ "CLOSED", "CANCELED", "PUBLISH_CANCEL" ],
      type: "info",
    },
  ];
  const colorConfig = colorConfigList.find((i) => i.status.includes(code));
  return (
    <SrmButton
      rect
      plain
      style={{ fontWeight: "bold" }}
      class="srm-list-item-header-right-btn"
      type={colorConfig?.type}>
      {meaning}
    </SrmButton>
  );
}

/**
 * 操作记录数据处理
 * @param {Array} list 源数据
 * @returns {Array} 数组
 */
export function getRecord(list) {
  let data = [];
  /**
   * 动作为【新增行/删除行】的操作记录直接隐藏，
   * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
   * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
   * 动作为【分配】的操作记录不允许合并
   * 动作为【更新/变更】的操作记录 对字段进行合并记录
   */
  list.map((item) => {
    if (
      item.processTypeCode === "UPDATE" ||
      item.processTypeCode === "CHANGE" ||
      item.processTypeCode === "ROLLBACK"
    ) {
      if (
        data.findIndex(
          (val) => val.poProcessActionId === item.poProcessActionId
        ) === -1
      ) {
        // 拼接更新的信息
        let updateRecords = [];
        list.map((val) => {
          if (val.poProcessActionId === item.poProcessActionId) {
            updateRecords.push(val);
          }
        });
        let processRemarks =
          updateRecords.map(
            (u) =>
              `\n${u.processUserName ?? ""} ${
                u.processRemark ?
                  u.processRemark :
                  `${$T("sodr.common.model.common.for").$D("将")}【${u.changeFieldNameMeaning ?? ""}】${$T("sodr.common.model.common.from").$D("由")}【${
                    u.priceShieldFlag ? "******" : u.oldValue ?? ""
                  }】${$T("sodr.common.model.common.to").$D("改成")}【${
                    u.priceShieldFlag ? "******" : u.newValue ?? ""
                  }】 ${
                    u.changeTableName === "SODR_PO_HEADER" ?
                      "" :
                      `${$T("sodr.common.model.common.displayLineNum").$D("行号")}【${u.displayLineNum ?? ""}】`
                  }`
              }`
          ) || [];
        data.push({ ...item, processRemark: processRemarks.join("\n") });
      }
    } else {
      data.push(item);
    }
  });
  return data.map((e) => {
    e.processTypeMeaning = {
      text: e.processTypeMeaning,
      type: "primary"
    };
    if (e.processTypeCode === "SUBMIT") {
      e.processTypeMeaning.type = "primary";
    } else if (e.processTypeCode === "APV_REJECT") {
      e.processTypeMeaning.type = "danger";
    } else if (e.processTypeCode === "NEW") {
      e.processTypeMeaning.type = "info";
    }
    return e;
  });
}
