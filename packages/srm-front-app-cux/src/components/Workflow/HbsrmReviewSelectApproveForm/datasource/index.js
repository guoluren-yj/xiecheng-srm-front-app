import { $T } from "srm-mobile-ui";

export function headerDs() {
  return {
    autoQuery: false,
    fields: [
      {
        fieldCode: "rfxSplitNum",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitNum").$D("评审表编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "templateName",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.templateName").$D("寻源模板"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxTitle",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxTitle").$D("标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceProjectNum",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectNum").$D("项目编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "docStatusMeaning",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.docStatus").$D("评审表状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceProjectName",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectName").$D("项目名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "lastApprover",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApprover").$D("审批人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "lastApproverComment",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApproverComment").$D("审批意见"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxSplitUuid",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitUuid").$D("评审表附件"),
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
      {
        fieldCode: "bidding",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/fJNfgQHDzLCMyZCpZBib28ibkiaKgG9Mjlevlp8txVxic24?action=RFX_SPLIT_HEADER`,
        method: "get",
      },
    },
  };
}

export function supplierDs() {
  return {
    autoQuery: false,
    fields: [
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxIncludedAmountSum",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/fJNfgQHDzLCMyZCpZBib28ibkiaKgG9Mjlevlp8txVxic24?action=RFX_SPLIT_DETAIL_ARRANGE`,
        method: "get",
      },
    },
  };
}

export function lineDs() {
  return {
    autoQuery: false,
    paging: false,
    editable: false,
    fields: [
      {
        fieldCode: "rfxLineItemNum",
        fieldType: "TEXT",
      },
      {
        fieldCode: "ouName",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.ouName").$D("公司"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.itemCode").$D("物料编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "specifications",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.specifications").$D("规则型号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uomName",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.uomName").$D("单位"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxQuantity",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxQuantity").$D("数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "currentQuotationQuantity",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.currentQuotationQuantity").$D("可供数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxQuantity",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxQuantity").$D("单价（元）"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "isSelect",
        fieldName: $T("scux.HbsrmReviewSelectForm.model.isSelect").$D("是否已选用"),
        fieldType: "Boolean",
      },
    ],
    // queryFields: [
    //   {
    //     fieldCode: "ouName",
    //     fieldName: $T("scux.HbsrmReviewSelectForm.model.ouName").$D("公司"),
    //     fieldType: "TEXT",
    //   },
    // ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/fJNfgQHDzLCMyZCpZBib28ibkiaKgG9Mjlevlp8txVxic24?action=RFX_SPLIT_DETAIL_MOBILE`,
        method: "get",
      },
    },
  };
}