import { SrmUtil, $T } from "srm-mobile-ui";

function headerDS({ rfxHeaderId }) {
  return {
    autoQuery: true,
    editable: false,
    paging: false,
    fields: [
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbNum").$D("招标书编号"),
        fieldCode: "rfxNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationRoundNumber").$D("轮次"),
        fieldCode: "quotationRoundNumber",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbTitle").$D("招标项目名称"),
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbRealName").$D("招标负责人"),
        fieldCode: "realName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbCompanyName").$D("招标公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbMethod").$D("招标方式"),
        fieldCode: "sourceMethod",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.AttributeVarchar2").$D("评标方式"),
        fieldCode: "attributeVarchar2",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar35").$D("是否推荐上商城"),
        fieldCode: "attributeVarchar35",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.zbRemark").$D("招标备注"),
        fieldCode: "rfxRemark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attributeLongtext4").$D("综合评标意见"),
        fieldCode: "attributeLongtext4",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attributeLongtext3").$D("商务评标意见"),
        fieldCode: "attributeLongtext3",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attributeLongtext2").$D("技术评标意见"),
        fieldCode: "attributeLongtext2",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/jKmAeEA3MKcXtUEBM4ORqWiawZMClUeNHOwGk3c3tjiateWibO2hI00LFJf6DlSw0Lz?rfxHeaderId=${rfxHeaderId}&tenantId=${SrmUtil.getTenantId()}`,
        method: "get",
      },
    },
  };
}
function lineDS() {
  return {
    autoQuery: false,
    editable: false,
    paging: false,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoreRank").$D("排名"),
        fieldCode: "scoreRank",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.totalAmount").$D("总金额"),
        fieldCode: "totalAmount",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessScore").$D("商务评分"),
        fieldCode: "businessScore",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessRank").$D("商务排名"),
        fieldCode: "attributeBigint1",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.technologyScore").$D("技术评分"),
        fieldCode: "technologyScore",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.technologyRank").$D("技术排名"),
        fieldCode: "attributeBigint2",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.totalScore").$D("总分"),
        fieldCode: "score",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.recommend").$D("推荐"),
        fieldCode: "candidateFlag",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.candidateSuggestion").$D("推荐意见"),
        fieldCode: "candidateSuggestion",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.bidDetail").$D("投标详情"),
        fieldCode: "bidDetail",
        fieldType: "TEXT",
      },
    ],
  };
}

function scoreElementDS() {
  return {
    autoQuery: false,
    editable: false,
    paging: false,
    fields: [
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.indicateDetail").$D("要素细项"),
        fieldCode: "indicateName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringInterval").$D("评分区间"),
        fieldCode: "scoringInterval",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierScore").$D("供应商分数"),
        fieldCode: "indicScore",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重"),
        fieldCode: "weight",
        fieldType: "TEXT",
      },
    ],
  };
}

function tenderDetailLineDS({ rfxHeaderId, supplierCompanyId, quotationHeaderId }) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("ssrc.queryQuotation.model.queryQuotation.itemName").$D("物料名称"),
        fieldCode: "itemName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.queryQuotation.model.queryQuotation.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.common.model.common.specs").$D("规格"),
        fieldCode: "specs",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.queryQuotation.model.queryQuotation.taxInclude").$D("是否含税"),
        fieldCode: "taxIncludedFlag",
        fieldType: "TEXT",
      },
      {
        fieldName: <span>{$T("ssrc.queryQuotation.model.queryQuotation.taxRate").$D("税率")}%</span>,
        fieldCode: "taxRate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
        fieldCode: "validQuotationPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.queryQuotation.model.queryQuotation.netPrice").$D("单价(不含税)"),
        fieldCode: "validNetPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.queryQuotation.model.queryQuotation.availableQuantity").$D("可供数量"),
        fieldCode: "validQuotationQuantity",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.bidHall.model.bidHall.lineAmount").$D("行金额"),
        fieldCode: "totalAmount",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("hzero.common.upload.modal.attachment").$D("附件"),
        fieldCode: "supplierAttachmentUuid",
        fieldType: "UPLOAD",
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/tender/${rfxHeaderId}/items?rfxHeaderId=${rfxHeaderId}&supplierCompanyId=${supplierCompanyId}&quotationHeaderId=${quotationHeaderId}`,
        method: "get",
      },
    },
  };
}

export { headerDS, lineDS, scoreElementDS, tenderDetailLineDS };
