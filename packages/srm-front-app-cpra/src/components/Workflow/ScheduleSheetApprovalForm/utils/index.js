import { $T } from "srm-mobile-ui";
//import { SrmButton } from "srm-mobile-ui";

// 计划状态-颜色 MAP  SSPL.PLAN_STATUS值集
export const STATUS_COLOR_MAP = {
  NEW:"success",
  RELEASE:"success",
  MODIFY:"success",
  CONFIRM:"success",
  FEEDBACK:"success",
  CLOSE: "brown",
  CANCEL: "brown",
  APPROVING: "success",
  REJECTED: "danger",
  FEEDBACK_APPROVING: "warn",
  FEEDBACK_REJECTED: "danger",
  PENDING: "warn",
};

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
    // if (
    //   item.processTypeCode === "UPDATE" ||
    //   item.processTypeCode === "CHANGE" ||
    //   item.processTypeCode === "ROLLBACK"
    // ) {

    if (
      data.findIndex(
        (val) => val.planActionId === item.planActionId
      ) === -1
    ) {
      // 拼接更新的信息
      let updateRecords = [];
      list.map((val) => {
        if (val.planActionId === item.planActionId) {
          updateRecords.push(val);
        }
      });
      let processRemarks =
          updateRecords.map(
            (u) =>
              `\n${u.processUser ?? ""} ${
                u.processRemark ?
                  u.processRemark :
                  `${$T("sodr.common.model.common.for").$D("将")}【${u.changeFieldNameMeaning ?? ""}】${$T("sodr.common.model.common.from").$D("由")}【${
                    u.priceShieldFlag ? "******" : u.oldValue ?? ""
                  }】${$T("sodr.common.model.common.to").$D("改成")}【${
                    u.priceShieldFlag ? "******" : u.newValue ?? ""
                  }`
              }】`
          ) || [];
      data.push({ ...item, processRemark: processRemarks.join("\n") });
    }
    // } else {
    //  data.push(item);
    //}
  });
  return data.map((e) => {
    e.processStatusMeaning = {
      text: e.processStatusMeaning,
      type: STATUS_COLOR_MAP[e.processStatus]
    };
    return e;
  });
}
