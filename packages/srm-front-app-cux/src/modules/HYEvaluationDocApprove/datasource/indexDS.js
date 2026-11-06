import { SrmUtil, $T } from "srm-mobile-ui";

function listDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    // table表单显示的字段
    fields: [
      {
        fieldCode: "archiveDescribe",
        fieldName: $T("scux.myModoList.model.archiveDescribe").$D("档案描述"),
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.myModoList.model.supplierName").$D("供应商"),
      },
      {
        fieldCode: "totalScore",
        fieldName: $T("scux.myModoList.model.totalScore").$D("综合得分"),
      },
      {
        fieldCode: "finalConclusion",
        fieldName: $T("scux.myModoList.model.finalConclusion").$D("最终结论"),
      },
      {
        fieldCode:"attachmentUuid",
        fieldName: $T("spcm.common.view.message.title.purchaseAttachmentList").$D("附件信息"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.procurementDecisionReview.model.remark").$D("相关说明"),
      },
    ],
    fastQueryField: {
      fieldCode: "processDescription",
      fieldType: "TEXT",
      fieldName: $T("sinv.common.model.common.processDescription").$D("流程描述"),
    },
    transport: {
      read: {
        url:`/scux/v1/${SrmUtil.getTenantId()}/hygy-perform-evaluations/listTaskPage`,
        method: "get",
      },
    },
  };
}

export default listDS;
