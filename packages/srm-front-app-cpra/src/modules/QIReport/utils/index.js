import {
  take,
  invert,
  isObject,
  isArray,
  isString,
  isFunction,
} from "lodash";
import { $T, http } from "srm-mobile-ui";

export function formatListColumns(fieldsList, options = {}) {
  const { endRow = 7, showLabelTop, editorFlag = false, onItemClick } = options;
  const filterList = fieldsList.filter((item) => item);
  const takeList = take(filterList, endRow).reduce((total, item, formRow) => {
    const currentList = [];
    if (isArray(item)) {
      item.forEach((childItem, formCol) => {
        if (isObject(childItem)) {
          currentList.push({ formRow, formCol, ...childItem });
        } else if (isString(childItem)) {
          currentList.push({ formRow, formCol, fieldCode: childItem });
        }
      });
    } else if (isObject(item)) {
      currentList.push({ formRow, ...item });
    } else if (isString(item)) {
      if (formRow === 0) {
        currentList.push({
          formRow,
          fieldCode: item,
          fieldType: "EMPTY",
          render: (value, _, field) => {
            const content = showLabelTop ?
              `${field.fieldName}：${value || "-"}` :
              value || "-";
            return <SrmListHeader>{content}</SrmListHeader>;
          },
        });
      } else {
        currentList.push({ formRow, fieldCode: item });
      }
    }
    return total.concat(currentList);
  }, []);
  if (isFunction(onItemClick) && filterList.length > endRow) {
    takeList.push({
      fieldCode: "handleMore",
      fieldType: "EMPTY",
      render: () =>
        <div style={{ width: "calc(100% + 30px)", margin: "0 -15px" }}>
          <srm-flex justify="end" align="center" style={{ padding: "20px 15px 0 0", borderTop: "1px solid #E9E9E9" }}>
            <SrmButton fill onClick={onItemClick}>
              {editorFlag ?
                $T("smbl.common.view.button.editMore").$D("编辑更多") :
                $T("smbl.common.view.button.viewMore").$D("查看更多")
              }
            </SrmButton>
          </srm-flex>
        </div>
    });
  }
  return takeList;
}
export function formatDetailColumns(fieldsList) {
  const filterList = fieldsList.filter((item) => item && item !== "selectBox");
  const newList = filterList.reduce((total, item) => {
    const currentList = [];
    if (isArray(item)) {
      item.forEach((childItem) => {
        if (isObject(childItem)) {
          currentList.push(item);
        } else if (isString(childItem)) {
          currentList.push({ fieldCode: childItem });
        }
      });
    } else if (isObject(item)) {
      currentList.push(item);
    } else if (isString(item)) {
      currentList.push({ fieldCode: item });
    }
    return total.concat(currentList);
  }, []);
  return newList;
}

export function formatColumns(fieldsList, options = {}) {
  const { takeFlag, editorFlag } = options;
  const newList = takeFlag ? formatListColumns(fieldsList, options) : formatDetailColumns(fieldsList, options);
  if (editorFlag === false) {
    return newList.map((item) => ({ editor: false, disabled: true, ...item }));
  }
  return newList;
}

export function approveNameRenderTemp(action) {
  let actionText = null;
  let actionColor = null;
  if (action) {
    switch (action.toLowerCase()) {
    case "startevent":
      actionColor = "#2C3E50";
      actionText = $T("hzero.common.text.startEvent").$D("开始");
      break;
    case "endevent":
      actionText = $T("hzero.common.text.endEvent").$D("结束");
      break;
    case "approved":
      actionColor = "#87d068";
      actionText = $T("hzero.common.status.agree").$D("同意");
      break;
    case "rejected":
      actionColor = "#f50";
      actionText = $T("hzero.common.status.reject").$D("拒绝");
      break;
    case "addsign":
      actionColor = "cyan";
      actionText = $T("hzero.common.status.addSign").$D("加签");
      break;
    case "approveandaddsign":
      actionColor = "green";
      actionText = $T("hzero.common.status.ApproveAndAddSign").$D("同意并加签");
      break;
    case "delegate":
      actionColor = "#108ee9";
      actionText = $T("hzero.common.status.$Delegate").$D("转交");
      break;
    case "jump":
      actionColor = "red";
      actionText = $T("hzero.common.status.jump").$D("驳回");
      break;
    case "recall":
      actionColor = "orange";
      actionText = $T("hzero.common.status.recall").$D("撤回");
      break;
    case "revoke":
      actionColor = "gold";
      actionText = $T("hzero.common.status.revoke").$D("撤销");
      break;
    case "autodelegate":
      actionColor = "#2db7f5";
      actionText = $T("hzero.common.status.autoDelegate").$D("自动转交");
      break;
    case "carboncopy":
      actionColor = "purple";
      actionText = $T("hzero.common.status.carbonCopy").$D("抄送");
      break;
    case "autocarboncopy":
      actionColor = "purple";
      actionText = $T("hzero.common.status.autocarboncopy").$D("自动抄送");
      break;
    case "specify":
      actionColor = "magenta";
      actionText = $T("hzero.common.status.specify").$D("指定");
      break;
    case "stop":
      actionText = $T("hzero.common.status.stop").$D("终止");
      break;
    default:
      break;
    }
  }
  return { actionText, actionColor };
}

export class PermissionCaller {
  constructor(permissionCodeMap) {
    this.data = {};
    this.permissionCodeMap = permissionCodeMap;
    this.init();
  }

  async init() {
    const res = await http.post("/iam/hzero/v1/menus/check-permissions", Object.values(this.permissionCodeMap))
      .catch((error) => {
        throw error;
      });
    if (res) {
      const invertCodeMap = invert(this.permissionCodeMap);
      res.map(({ code, approve }) => {
        const permissionKey = invertCodeMap[code];
        this.set(permissionKey, approve);
      });
      // 触发computed更新
      this.data = Object.assign({}, this.data);
    }
  }

  set(permissionKey, approve) {
    this.data[permissionKey] = approve;
  }

  get(permissionKey) {
    return this.data[permissionKey];
  }
}

export const getPcUnitCodeMap = (pageCode) => {
  switch (pageCode) {
  case "creation":
    return {
      basicInfo: "SQAM.CREATE_8D_DETAIL.BASIC",
      relatedQIReport: "SQAM.CREATE_8D_DETAIL.CORRELATION_8D_LIST",
      relatedQCDoc: "SQAM.CREATE_8D_DETAIL.INSPECT",
      relatedQCAffair: "SQAM.CREATE_8D_DETAIL.TRX",
      problemDesc: "SQAM.CREATE_8D_DETAIL.PROBLEM",
      groupMember: "SQAM.CREATE_8D_DETAIL.GROUPMEMBER",
      continueProvide: "SQAM.CREATE_8D_DETAIL.TEMPMEASURE",
      shortMeature: "SQAM.CREATE_8D_DETAIL.SHORTMEASURES",
      reasonAnalyze: "SQAM.CREATE_8D_DETAIL.ROOTCAUSE",
      correctMeature: "SQAM.CREATE_8D_DETAIL.PERMANENTACTION",
      applyItem: "SQAM.CREATE_8D_DETAIL.OTHERAPPLICABLE",
      standard: "SQAM.CREATE_8D_DETAIL.STANDARDIZATION",
      congratulation: "SQAM.CREATE_8D_DETAIL.TEAMCONGRATULATIONS",
      otherInfo: "SQAM.CREATE_8D_DETAIL.OTHERINFO",
    };
  case "initiated":
    return {
      basicInfo: "SQAM.INITIATED_8D.DETAIL.BASIC",
      relatedQIReport: "SQAM.INITIATED_8D.DETAIL.CORRELATION_8D_LIST",
      relatedQCDoc: "SQAM.INITIATED_8D.DETAIL.INSPECT",
      relatedQCAffair: "SQAM.INITIATED_8D.DETAIL.TRX",
      problemDesc: "SQAM.INITIATED_8D.DETAIL.PROBLEM",
      groupMember: "SQAM.INITIATED_8D.DETAIL.GROUPMEMBER",
      continueProvide: "SQAM.INITIATED_8D.DETAIL.TEMPMEASURE",
      shortMeature: "SQAM.INITIATED_8D.DETAIL.SHORTMEASURES",
      reasonAnalyze: "SQAM.INITIATED_8D.DETAIL.ROOTCAUSE",
      correctMeature: "SQAM.INITIATED_8D.DETAIL.PERMANENTACTION",
      applyItem: "SQAM.INITIATED_8D.DETAIL.OTHERAPPLICABLE",
      standard: "SQAM.INITIATED_8D.DETAIL.STANDARDIZATION",
      congratulation: "SQAM.INITIATED_8D.DETAIL.TEAMCONGRATULATIONS",
      otherInfo: "SQAM.INITIATED_8D.DETAIL.OTHERINFO",
      effectTrack: "SQAM.INITIATED_8D.DETAIL.RESULTSTRACKING",
      customFormA: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM",
      customFormB: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM_B",
      customFormC: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM_C",
    };
  case "audit":
    return {
      basicInfo: "SQAM.INITIATED_8D.DETAIL.BASIC",
      relatedQIReport: "SQAM.AUDIT_8D_DETAIL.CORRELATION_8D_LIST",
      relatedQCDoc: "SQAM.AUDIT_8D_DETAIL.INSPECT",
      relatedQCAffair: "SQAM.AUDIT_8D_DETAIL.TRX",
      problemDesc: "SQAM.AUDIT_8D_DETAIL.PROBLEM",
      groupMember: "SQAM.AUDIT_8D_DETAIL.GROUPMEMBER",
      continueProvide: "SQAM.AUDIT_8D_DETAIL.TEMPMEASURE",
      shortMeature: "SQAM.AUDIT_8D_DETAIL.SHORTMEASURES",
      reasonAnalyze: "SQAM.AUDIT_8D_DETAIL.ROOTCAUSE",
      correctMeature: "SQAM.AUDIT_8D_DETAIL.PERMANENTACTION",
      applyItem: "SQAM.AUDIT_8D_DETAIL.OTHERAPPLICABLE",
      standard: "SQAM.AUDIT_8D_DETAIL.STANDARDIZATION",
      congratulation: "SQAM.AUDIT_8D_DETAIL.TEAMCONGRATULATIONS",
      otherInfo: "SQAM.AUDIT_8D_DETAIL.OTHERINFO",
      customFormA: "SQAM.AUDIT_8D_DETAIL.CUSZ_FORM",
      customFormB: "SQAM.AUDIT_8D_DETAIL.CUSZ_FORM_B",
      customFormC: "SQAM.AUDIT_8D_DETAIL.CUSZ_FORM_C",
      continuePCA: "SQAM.AUDIT_8D_DETAIL.PCA_STAGE",
      complete: "SQAM.AUDIT_8D_DETAIL.APPROVE_STAGE",
      reject: "SQAM.AUDIT_8D_DETAIL.REJECT_STAGE",
      cancel: "SQAM.AUDIT_8D_DETAIL.MODAL_CANCEL",
    };
  default:
    return {};
  }
};

export const getMblUnitCodeMap = (pageCode) => {
  switch (pageCode) {
  case "creation":
    return {
      listGrid: "SMBL.QI_REPORT_CREATION.LIST_GRID", // 【质量整改8D】-8D质量整改[基础信息、问题描述]
      scrollTab: "SMBL.QI_REPORT_CREATION.SCROLL_TAB",
      basicInfo: "SMBL.QI_REPORT_CREATION.BASIC_INFO", // 【质量整改8D】-8D质量整改[基础信息、问题描述]
      relatedQIReport: "SMBL.QI_REPORT_CREATION.RELATED_QI_REPORT", // 【质量整改8D】-8D质量整改[基础信息、问题描述]
      relatedQCDoc: "SMBL.QI_REPORT_CREATION.RELATED_QC_DOC", //  【质量整改8D】-质检单（来料检验单）头表
      relatedQCAffair: "SMBL.QI_REPORT_CREATION.RELATED_QC_AFFAIR", // 【采购接收事务】-采购接收事务
      problemDesc: "SMBL.QI_REPORT_CREATION.PROBLEM_DESC", // 【质量整改8D】-8D质量整改[基础信息、问题描述]
      groupMember: "SMBL.QI_REPORT_CREATION.GROUP_MEMBER", // 【质量整改8D】-8D质量整改 [小组成员]
      continueProvide: "SMBL.QI_REPORT_CREATION.CONTINUE_PROVIDE", // 【质量整改8D】-8D质量整改 [临时围堵措施—保证持续供货]
      shortMeature: "SMBL.QI_REPORT_CREATION.SHORT_MEASURE", // 【质量整改8D】-8D质量整改[短期措施
      reasonAnalyze: "SMBL.QI_REPORT_CREATION.REASON_ANALYZE", // 【质量整改8D】-8D质量整改 [根本原因分析]
      correctMeature: "SMBL.QI_REPORT_CREATION.CORRECT_MEASURE", // 【质量整改8D】-8D质量整改 [永久纠正措施]
      applyItem: "SMBL.QI_REPORT_CREATION.APPLY_ITEM", //  【质量整改8D】-8D质量整改 [是否适用以下项目]
      standard: "SMBL.QI_REPORT_CREATION.STANDARD", // 【质量整改8D】-8D质量整改 [相关标准化]
      congratulation: "SMBL.QI_REPORT_CREATION.CONGRATULATION", // 【8D故障应对措施】-8D故障应对措施
      otherInfo: "SMBL.QI_REPORT_CREATION.OTHER_INFO", // 【质量整改8D】-8D质量整改 [其他信息]
      customFormA: "SMBL.QI_REPORT_CREATION.CUSTOM_FORM_A", // 自定义
      customFormB: "SMBL.QI_REPORT_CREATION.CUSTOM_FORM_B", // 自定义
      customFormC: "SMBL.QI_REPORT_CREATION.CUSTOM_FORM_C", // 自定义
    };
  case "initiated":
    return {
      listGrid: "SMBL.QI_REPORT_INITIATED.LIST_GRID", // 我发起的质量整改列表页-列表
      scrollTab: "SMBL.QI_REPORT_INITIATED.SCROLL_TAB", // 我发起的质量整改详情页-滚动标签
      basicInfo: "SMBL.QI_REPORT_INITIATED.BASIC_INFO", // 我发起的质量整改详情页-基本信息
      relatedQIReport: "SMBL.QI_REPORT_INITIATED.RELATED_QI_REPORT", // 我发起的质量整改详情页-关联整改报告
      relatedQCDoc: "SMBL.QI_REPORT_INITIATED.RELATED_QC_DOC", // 我发起的质量整改详情页-关联质检单
      relatedQCAffair: "SMBL.QI_REPORT_INITIATED.RELATED_QC_AFFAIR", // 我发起的质量整改详情页-关联质检事务
      problemDesc: "SMBL.QI_REPORT_INITIATED.PROBLEM_DESC", // 我发起的质量整改详情页-问题描述
      groupMember: "SMBL.QI_REPORT_INITIATED.GROUP_MEMBER", // 我发起的质量整改详情页-小组成员
      continueProvide: "SMBL.QI_REPORT_INITIATED.CONTINUE_PROVIDE", // 我发起的质量整改详情页-（临时围堵措施-保证持续供货）
      shortMeature: "SMBL.QI_REPORT_INITIATED.SHORT_MEASURE", // 我发起的质量整改详情页-短期措施
      reasonAnalyze: "SMBL.QI_REPORT_INITIATED.REASON_ANALYZE", // 我发起的质量整改详情页-根本原因分析
      correctMeature: "SMBL.QI_REPORT_INITIATED.CORRECT_MEASURE", // 我发起的质量整改详情页-永久纠正措施
      applyItem: "SMBL.QI_REPORT_INITIATED.APPLY_ITEM", // 我发起的质量整改详情页-是否适用以下项目
      standard: "SMBL.QI_REPORT_INITIATED.STANDARD", // 我发起的质量整改详情页-相关标准化
      congratulation: "SMBL.QI_REPORT_INITIATED.CONGRATULATION", // 我发起的质量整改详情页-小组祝贺
      otherInfo: "SMBL.QI_REPORT_INITIATED.OTHER_INFO", // 我发起的质量整改详情页-其他信息
      effectTrack: "SMBL.QI_REPORT_INITIATED.EFFECT_TRACK", // 我发起的质量整改详情页-成效追踪
      customFormA: "SMBL.QI_REPORT_INITIATED.CUSTOM_FORM_A", // 自定义
      customFormB: "SMBL.QI_REPORT_INITIATED.CUSTOM_FORM_B", // 自定义
      customFormC: "SMBL.QI_REPORT_INITIATED.CUSTOM_FORM_C", // 自定义
    };
  case "audit":
    return {
      listGrid: "SMBL.QI_REPORT_AUDIT.LIST_GRID", // 质量整改反馈审核列表页-列表
      scrollTab: "SMBL.QI_REPORT_AUDIT.SCROLL_TAB", // 质量整改反馈审核详情页-滚动标签
      basicInfo: "SMBL.QI_REPORT_AUDIT.BASIC_INFO", // 质量整改反馈审核详情页-基本信息
      relatedQIReport: "SMBL.QI_REPORT_AUDIT.RELATED_QI_REPORT", // 质量整改反馈审核详情页-关联整改报告
      relatedQCDoc: "SMBL.QI_REPORT_AUDIT.RELATED_QC_DOC", // 质量整改反馈审核详情页-关联质检单
      relatedQCAffair: "SMBL.QI_REPORT_AUDIT.RELATED_QC_AFFAIR", // 质量整改反馈审核详情页-关联质检事务
      problemDesc: "SMBL.QI_REPORT_AUDIT.PROBLEM_DESC", // 质量整改反馈审核详情页-问题描述
      groupMember: "SMBL.QI_REPORT_AUDIT.GROUP_MEMBER", // 质量整改反馈审核详情页-小组成员
      continueProvide: "SMBL.QI_REPORT_AUDIT.CONTINUE_PROVIDE", // 质量整改反馈审核详情页-（临时围堵措施-保证持续供货）
      shortMeature: "SMBL.QI_REPORT_AUDIT.SHORT_MEASURE", // 质量整改反馈审核详情页-短期措施
      reasonAnalyze: "SMBL.QI_REPORT_AUDIT.REASON_ANALYZE", // 质量整改反馈审核详情页-根本原因分析
      correctMeature: "SMBL.QI_REPORT_AUDIT.CORRECT_MEASURE", // 质量整改反馈审核详情页-永久纠正措施
      applyItem: "SMBL.QI_REPORT_AUDIT.APPLY_ITEM", // 质量整改反馈审核详情页-是否适用以下项目
      standard: "SMBL.QI_REPORT_AUDIT.STANDARD", // 质量整改反馈审核详情页-相关标准化
      otherInfo: "SMBL.QI_REPORT_AUDIT.OTHER_INFO", // 质量整改反馈审核详情页-其他信息
      customFormA: "SMBL.QI_REPORT_AUDIT.CUSTOM_FORM_A", // 自定义
      customFormB: "SMBL.QI_REPORT_AUDIT.CUSTOM_FORM_B", // 自定义
      customFormC: "SMBL.QI_REPORT_AUDIT.CUSTOM_FORM_C", // 自定义
      continuePCA: "SMBL.QI_REPORT_AUDIT.CONTINUE_PCA_POPUP", // 质量整改反馈审核详情页-继续反馈PCA弹窗
      complete: "SMBL.QI_REPORT_AUDIT.COMPLETE_POPUP", // 质量整改反馈审核详情页-完成整改弹窗
      reject: "SMBL.QI_REPORT_AUDIT.REJECT_POPUP", // 质量整改反馈审核详情页-审核拒绝弹窗
      cancel: "SMBL.QI_REPORT_AUDIT.CANCEL_POPUP", // 质量整改反馈审核详情页-取消整改弹窗
    };
  default:
    return {};
  }
};

export const getStateKeyMap = (pageCode) => {
  switch (pageCode) {
  case "creation":
    return {
      continueProvide: "create8DProvide",
      shortMeature: "create8DFollowUp",
      reasonAnalyze: "create8DReason",
      correctMeature: "create8DSolution",
      applyItem: "create8DSuit",
      standard: "create8DStandard",
    };
  case "initiated":
    return {
      continueProvide: "initiated8DProvide",
      shortMeature: "initiated8DFollowUp",
      reasonAnalyze: "initiated8DReason",
      correctMeature: "initiated8DSolution",
      applyItem: "initiated8DSuit",
      standard: "initiated8DStandard",
    };
  default:
    return {};
  }
};