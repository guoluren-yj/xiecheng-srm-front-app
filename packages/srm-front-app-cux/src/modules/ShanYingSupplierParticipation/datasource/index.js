import { $T } from "srm-mobile-ui";

function listDs() {
  return {
    selection: 0,
    fields: [
      {
        fieldCode: "rfxNum",
        fieldName: $T("scux.supplierParticipatio.model.rfxNum").$D("BID单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "particpateStstusMeaning",
        fieldName: $T("scux.supplierParticipatio.model.particpateStstusMeaning").$D("状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxTitle",
        fieldName: $T("scux.supplierParticipatio.model.title").$D("标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.supplierParticipatio.model.companyName").$D("客户"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime1",
        fieldName: $T("scux.supplierParticipatio.model.attributeDatetime1").$D("反馈截止时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "quotationStartDate",
        fieldName: $T("scux.supplierParticipatio.model.quotationStartDate").$D("招标开始时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "quotationEndDate",
        fieldName: $T("scux.supplierParticipatio.model.quotationEndDate").$D("招标截止时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.supplierParticipatio.model.supplierCompanyName").$D("公司"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceMethodMeaning",
        fieldName: $T("scux.supplierParticipatio.model.sourceMethodMeaning").$D("寻源方式"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "realName",
        fieldName: $T("scux.supplierParticipatio.model.realName").$D("创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "openBidDate",
        fieldName: $T("scux.supplierParticipatio.model.openBidDate").$D("开标时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.supplierParticipatio.model.creationDate").$D("创建时间"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "rfxNum",
        fieldName: $T("scux.supplierParticipatio.model.rfxNum").$D("BID单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxTitle",
        fieldName: $T("scux.supplierParticipatio.model.title").$D("标题"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/BMJeicIeuS8hSw1Oqw1SW92iapZpRzbSIGicTP5nUQz9UdsGLbYLjMn0X8zJoElAaiat`,
        method: "get",
      },
    },
  };
}

function formDs(_this) {
  const {
    app: {
      _route: {
        query: { rfxHeaderId = "", supplierCompanyId = "", tenantId = "", type = "" },
      },
    },
  } = _this.$router;
  return {
    selection: 0,
    fields: [
      {
        fieldCode: "rfxNum",
        fieldName: $T("scux.supplierParticipatio.model.rfxNum").$D("BID单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxTitle",
        fieldName: $T("scux.supplierParticipatio.model.rfxTitle").$D("招标书标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.supplierParticipatio.model.companyName").$D("客户"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "secondarySourceCategoryMeaning",
        fieldName: $T("scux.supplierParticipatio.model.secondarySourceCategoryMeaning").$D("寻源类别"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("scux.supplierParticipatio.model.currencyCode").$D("币种"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "quotationStartDate",
        fieldName: $T("scux.supplierParticipatio.model.quotationStartDate").$D("投标开始时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "quotationEndDate",
        fieldName: $T("scux.supplierParticipatio.model.quotationEndDate").$D("投标截止时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxRemark",
        fieldName: $T("scux.supplierParticipatio.model.rfxRemark").$D("备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime1",
        fieldName: $T("scux.supplierParticipatio.model.attributeDatetime1").$D("反馈截至时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime10",
        fieldName: $T("scux.supplierParticipatio.model.attributeDatetime10").$D("开标时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sealedQuotationFlag",
        fieldName: $T("scux.supplierParticipatio.model.sealedQuotationFlag").$D("密封报价"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "bidFileExpense",
        fieldName: $T("scux.supplierParticipatio.model.bidFileExpense").$D("标书费(元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "bidBond",
        fieldName: $T("scux.supplierParticipatio.model.bidBond").$D("保证金(元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeLongtext3",
        fieldName: $T("scux.supplierParticipatio.model.attributeLongtext3").$D("反馈意见"),
        fieldType: type === "show" ? "INPUT" : "TEXT",
      },
      {
        fieldCode: "attributeVarchar2",
        fieldName: $T("scux.supplierParticipatio.model.attributeVarchar2").$D("反馈附件"),
        fieldType: "UPLOAD",
        uploadButton: type === "show" ? "fixed" : "default",
      },
      {
        fieldCode: "particpateStstusMeaning",
        fieldName: $T("scux.supplierParticipatio.model.particpateStstus").$D("状态"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/BMJeicIeuS8hSw1Oqw1SW96Q37PYdmnbDZOBVl2KWeTdf8esdYvwQRWLqouqgRur3?rfxHeaderId=${rfxHeaderId}&supplierCompanyId=${supplierCompanyId}&tenantId=${tenantId}`,
        method: "get",
      },
    },
  };
}

function itemDs(_this) {
  const {
    app: {
      _route: {
        query: { rfxHeaderId = "", supplierCompanyId = "", tenantId = "" },
      },
    },
  } = _this.$router;
  return {
    selection: 0,
    enableQuery: false,
    fields: [
      {
        fieldCode: "rfxLineItemNum",
        fieldName: $T("scux.supplierParticipatio.model.rfxLineItemNum").$D("行号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "ouName",
        fieldName: $T("scux.supplierParticipatio.model.ouName").$D("业务实体"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("scux.supplierParticipatio.model.invOrganizationName").$D("库存组织"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.supplierParticipatio.model.itemCode").$D("物料编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.supplierParticipatio.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCategoryName",
        fieldName: $T("scux.supplierParticipatio.model.itemCategoryName").$D("物料类别"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "specs",
        fieldName: $T("scux.supplierParticipatio.model.specs").$D("规格"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxQuantity",
        fieldName: $T("scux.supplierParticipatio.model.rfxQuantity").$D("需求数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uomName",
        fieldName: $T("scux.supplierParticipatio.model.uomName").$D("单位"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "batchPrice",
        fieldName: $T("scux.supplierParticipatio.model.batchPrice").$D("价格批量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxIncludedFlag",
        fieldName: $T("scux.supplierParticipatio.model.taxIncludedFlag").$D("是否含税"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("scux.supplierParticipatio.model.taxRate").$D("税率（%）"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "freightIncludedFlag",
        fieldName: $T("scux.supplierParticipatio.model.freightIncludedFlag").$D("是否含运费"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "demandDate",
        fieldName: $T("scux.supplierParticipatio.model.demandDate").$D("需求日期"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/BMJeicIeuS8hSw1Oqw1SW92iapZpRzbSIGicTP5nUQz9Udlt8aMhR0ibqj5iaB9XSfsWy?rfxHeaderId=${rfxHeaderId}&supplierCompanyId=${supplierCompanyId}&tenantId=${tenantId}`,
        method: "get",
      },
    },
  };
}

export { formDs, listDs, itemDs };