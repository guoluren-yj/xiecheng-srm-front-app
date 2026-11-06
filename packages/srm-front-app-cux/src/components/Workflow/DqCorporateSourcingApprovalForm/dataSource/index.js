import { SrmUtil, $T } from "srm-mobile-ui";

// 全部报价明细
function quotationDs(id) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    bodyParameter: { id },
    fields: [
      {
        fieldCode: "suggestedFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.suggestedFlag").$D("选用"),
      },
      {
        fieldCode: "itemCategoryIdMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.categoryName").$D(
          "物料类别"
        ),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "secondaryUomIdMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.uomName").$D("单位"),
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.companyNum").$D(
          "供应商编码"
        ),
      },
      {
        fieldCode: "supplierCompanyIdMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.sourcingApproval.model.supplierCompanyIdMeaning"
        ).$D("供应商名称"),
      },
      {
        fieldCode: "candidateSuggestion",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.candidateSuggestion").$D(
          "推荐意见"
        ),
      },
      {
        fieldCode: "stageDescription",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.stageDescription").$D(
          "生命周期阶段"
        ),
      },
      {
        fieldCode: "validQuotationPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validQuotationPrice").$D(
          "单价(含税)"
        ),
      },
      {
        fieldCode: "attributeVarchar1",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotedUnitPriceUp").$D(
          "报价单价大写"
        ),
      },
      {
        fieldCode: "attributeVarchar11",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.returnCount").$D("返还支数"),
      },
      {
        fieldCode: "validNetPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validNetPrice").$D(
          "单价(不含税)"
        ),
      },
      {
        fieldCode: "differentPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.differentPrice").$D(
          "差异价"
        ),
      },
      {
        fieldCode: "attributeVarchar10",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.brand").$D("品牌"),
      },
      {
        fieldCode: "specs",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.specs").$D("规格"),
      },
      {
        fieldCode: "priceBatchQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.priceBatchQuantity").$D(
          "价格批量"
        ),
      },
      {
        fieldCode: "allottedQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.allottedQuantity").$D(
          "分配数量"
        ),
      },
      {
        fieldCode: "allottedRatio",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.allottedRatio").$D(
          "分配比例(%)"
        ),
      },
      {
        fieldCode: "quotationLineStatusMeaning",
        fildType: "TEXT",
        fieldName: $T(
          "scux.sourcingApproval.model.quotationLineStatusMeaning"
        ).$D("报价状态"),
      },
      {
        fieldCode: "taxIncludedFlagMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.taxIncludedFlag").$D(
          "是否含税"
        ),
      },
      {
        fieldCode: "taxRate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.taxRate").$D("税率（%）"),
      },
      {
        fieldCode: "suggestedRemark",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.suggestedRemark").$D(
          "选用理由"
        ),
      },
      {
        fieldCode: "preQuotationPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.preQuotationPrice").$D(
          "上次报价"
        ),
      },
      {
        fieldCode: "priceFluctuation",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.priceFluctuation").$D(
          "价格浮动"
        ),
      },
      {
        fieldCode: "rfxQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.rfxQuantity").$D("需求数量"),
      },
      {
        fieldCode: "validQuotationQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.validQuotationQuantity").$D(
          "可供数量"
        ),
      },
      {
        fieldCode: "totalPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.totalPrice").$D("行金额"),
      },
      {
        fieldCode: "attributeVarchar2",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotationAmountUp").$D(
          "报价行金额大写"
        ),
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.netAmount").$D(
          "行金额(不含税)"
        ),
      },
      {
        fieldCode: "validQuotationRemark",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validQuotationRemark").$D(
          "报价说明"
        ),
      },
      {
        fieldCode: "paymentTypeIdMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.paymentTypeName").$D(
          "付款方式"
        ),
      },
      {
        fieldCode: "paymentTermIdMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.paymentTermName").$D(
          "付款条款"
        ),
      },
      {
        name: "attachmentUuid",
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
        fieldName: $T("scux.sourcingApproval.model.attachmentUuid").$D(
          "供应商行附件"
        ),
      },
      {
        fieldCode: "origin",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.origin").$D("产地"),
      },
      {
        fieldCode: "validExpiryDateFrom",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validExpiryDateFrom").$D(
          "报价有效期从"
        ),
      },
      {
        fieldCode: "validExpiryDateTo",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validExpiryDateTo").$D(
          "报价有效期至"
        ),
      },
      {
        fieldCode: "validPromisedDate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validPromisedDate").$D(
          "承诺交货日期"
        ),
      },
      {
        fieldCode: "validDeliveryCycle",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validDeliveryCycle").$D(
          "供货周期(天)"
        ),
      },
      {
        fieldCode: "minPurchaseQuantity",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.minPurchaseQuantity").$D(
          "最小购买量"
        ),
      },
      {
        fieldCode: "minPackageQuantity",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.minPackageQuantity").$D(
          "最小包装量"
        ),
      },
      {
        fieldCode: "freightIncludedFlagMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.freightIncludedFlag").$D(
          "是否含运费"
        ),
      },
      {
        fieldCode: "freightAmount",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.freightAmount").$D("运费"),
      },
      {
        fieldCode: "quotedDate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotedDate").$D("报价时间"),
      },
      {
        fieldCode: "rfxLineItemNum",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.rfxLineItemNum").$D("行号"),
      },
      {
        fieldCode: "prDisplayNum",
        fieldName: $T("scux.sourcingApproval.model.prDisplayNum").$D(
          "采购申请号"
        ),
      },
      {
        fieldCode: "prDisplayLineNum",
        fieldName: $T("scux.sourcingApproval.model.prDisplayLineNum").$D(
          "采购申请行号"
        ),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/OicEUnr3l3nkLvtkXBmfrMAw4EibmJPICvKFjfQ7gDQHc`,
        method: "POST",
      },
    },
  };
}

// 供应商行信息
function supplierLineDs(id, supplierCompanyId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    bodyParameter: { id, supplierCompanyId },
    fields: [
      {
        fieldCode: "suggestedFlagMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.suggestedFlag").$D("选用"),
      },
      {
        fieldCode: "rfxLineItemNum",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.rfxLineItemNum").$D("行号"),
      },
      {
        fieldCode: "itemCode",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "stageDescription",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.stageDescription").$D(
          "生命周期阶段"
        ),
      },
      {
        fieldCode: "taxIncludedFlagMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.taxIncludedFlag").$D(
          "是否含税"
        ),
      },
      {
        fieldCode: "taxRate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.taxRate").$D("税率（%）"),
      },
      {
        fieldCode: "quotationLineStatusMeaning",
        fildType: "TEXT",
        fieldName: $T(
          "scux.sourcingApproval.model.quotationLineStatusMeaning"
        ).$D("报价状态"),
      },
      {
        fieldCode: "validQuotationPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validQuotationPrice").$D(
          "单价(含税)"
        ),
      },
      {
        fieldCode: "attributeVarchar1",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotedUnitPriceUp").$D(
          "报价单价大写"
        ),
      },
      {
        fieldCode: "validNetPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validNetPrice").$D(
          "单价(不含税)"
        ),
      },
      {
        fieldCode: "allottedQuantity",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.allottedQuantity").$D(
          "分配数量"
        ),
      },
      {
        fieldCode: "allottedRatio",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.allottedRatio").$D(
          "分配比例(%)"
        ),
      },
      {
        fieldCode: "suggestedRemark",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.suggestedRemark").$D(
          "选用理由"
        ),
      },
      {
        fieldCode: "preQuotationPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.preQuotationPrice").$D(
          "上次报价"
        ),
      },
      {
        fieldCode: "priceFluctuation",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.priceFluctuation").$D(
          "价格浮动"
        ),
      },
      {
        fieldCode: "rfxQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.rfxQuantity").$D("需求数量"),
      },
      {
        fieldCode: "validQuotationQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.validQuotationQuantity").$D(
          "可供数量"
        ),
      },
      {
        fieldCode: "secondaryUomIdMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.secondaryUomName").$D(
          "单位"
        ),
      },
      {
        fieldCode: "totalPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.totalPrice").$D("行金额"),
      },
      {
        fieldCode: "attributeVarchar2",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotationAmountUp").$D(
          "报价行金额大写"
        ),
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.netAmount").$D(
          "行金额(不含税)"
        ),
      },
      {
        fieldCode: "validQuotationRemark",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validQuotationRemark").$D(
          "报价说明"
        ),
      },
      {
        fieldCode: "paymentTypeIdMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.paymentTypeName").$D(
          "付款方式"
        ),
      },
      {
        fieldCode: "paymentTermIdMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.paymentTermName").$D(
          "付款条款"
        ),
      },
      {
        name: "attachmentUuid",
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
        fieldName: $T("scux.sourcingApproval.model.attachmentUuid").$D(
          "供应商行附件"
        ),
      },
      {
        fieldCode: "origin",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.origin").$D("产地"),
      },
      {
        fieldCode: "validExpiryDateFrom",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validExpiryDateFrom").$D(
          "报价有效期从"
        ),
      },
      {
        fieldCode: "validExpiryDateTo",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validExpiryDateTo").$D(
          "报价有效期至"
        ),
      },
      {
        fieldCode: "validPromisedDate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validPromisedDate").$D(
          "承诺交货日期"
        ),
      },
      {
        fieldCode: "validDeliveryCycle",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.validDeliveryCycle").$D(
          "供货周期(天)"
        ),
      },
      {
        fieldCode: "minPurchaseQuantity",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.minPurchaseQuantity").$D(
          "最小购买量"
        ),
      },
      {
        fieldCode: "minPackageQuantity",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.minPackageQuantity").$D(
          "最小包装量"
        ),
      },
      {
        fieldCode: "freightIncludedFlagMeaning",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.freightIncludedFlag").$D(
          "是否含运费"
        ),
      },
      {
        fieldCode: "freightAmount",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.freightAmount").$D("运费"),
      },
      {
        fieldCode: "specs",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.specs").$D("规格"),
      },
      {
        fieldCode: "quotedDate",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.quotedDate").$D("报价时间"),
      },
      {
        fieldCode: "firstQuotationPrice",
        fildType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.firstQuotationPrice").$D(
          "首次报价"
        ),
      },
      {
        fieldCode: "prDisplayNum",
        fieldName: $T("scux.sourcingApproval.model.prDisplayNum").$D(
          "采购申请号"
        ),
      },
      {
        fieldCode: "prDisplayLineNum",
        fieldName: $T("scux.sourcingApproval.model.prDisplayLineNum").$D(
          "采购申请行号"
        ),
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.companyNum").$D(
          "供应商编码"
        ),
      },
      {
        fieldCode: "priceBatchQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.priceBatchQuantity").$D(
          "价格批量"
        ),
      },
      {
        fieldCode: "itemCategoryIdMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.categoryName").$D(
          "物料类别"
        ),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/SC7ibZs54z7m0fnIxVB6sVwgFtegf5gMx024UCFUpyS8`,
        method: "POST",
      },
    },
  };
}

function headerDs(id) {
  return {
    autoQuery: true,
    bodyParameter: { id },
    fields: [
      {
        fieldCode: "rfxNum",
        fieldName: $T("scux.sourcingApproval.model.rfxNum").$D("单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "rfxTitle",
        fieldName: $T("scux.sourcingApproval.model.rfxTitle").$D("标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "invOrganizationIdMeaning",
        fieldName: $T("scux.sourcingApproval.model.invOrganizationName").$D(
          "工厂"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceCategoryMeaning",
        fieldName: $T("scux.sourcingApproval.model.sourceCategoryMeaning").$D(
          "寻源类别"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceMethodMeaning",
        fieldName: $T("scux.sourcingApproval.model.sourceMethodMeaning").$D(
          "寻源方式"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar28",
        fieldName: $T("scux.sourcingApproval.model.checkAttachmentUuid").$D(
          "集采定价附件"
        ),
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
      {
        name: "attributeVarchar28Version",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.sourcingApproval.model.attributeVarchar28Version"
        ).$D("集采定价附件版本"),
      },
      {
        fieldCode: "attributeVarchar10",
        fieldName: $T("scux.sourcingApproval.model.TradingFlag").$D(
          "是否关联交易"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar11",
        fieldName: $T("scux.sourcingApproval.model.engineeringFlag").$D(
          "是否工程类"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar20",
        fieldName: $T(
          "scux.sourcingApproval.model.semiconductorSecurityFlag"
        ).$D("是否半导体保密"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar12Meaning",
        fieldName: $T("scux.sourcingApproval.model.purchasingDepartment").$D(
          "申购部门"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar13Meaning",
        fieldName: $T("scux.sourcingApproval.model.relevantDepartment").$D(
          "相关部门"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "internalRemark",
        fieldName: $T("scux.sourcingApproval.model.internalRemark").$D(
          "备注（内部）"
        ),
        fieldType: "TEXT",
      },
      {
        name: "sourceTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.sourceType").$D("寻源类型"),
      },
      {
        name: "attributeVarchar17",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.headquartersInquiryFlag").$D(
          "是否总部询价"
        ),
      },
      {
        name: "checkRemark",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.checkRemark").$D("核价备注"),
      },
      {
        name: "rfxRemark",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.rfxRemark").$D("备注"),
      },
      {
        name: "attributeVarchar16",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.attributeVarchar16").$D(
          "是否半导体、二期项目"
        ),
      },
      {
        name: "totalPrice2",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("scux.sourcingApproval.model.totalCost").$D("核价总金额"),
      },
      {
        name: "attributeVarchar3",
        fieldType: "TEXT",
        fieldName: $T("scux.sourcingApproval.model.totalCostUp").$D(
          "核价总金额大写"
        ),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/zZM23TU1DXQK1F8GTJNiaTPzpovPYCxibHdicwGMqJ4cqU`,
        method: "POST",
      },
    },
  };
}

export { quotationDs, supplierLineDs, headerDs };
