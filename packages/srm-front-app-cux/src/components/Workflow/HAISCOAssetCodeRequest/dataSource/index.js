import { $T, SrmUtil } from "srm-mobile-ui";

function basicInfo() {
  return {
    autoQuery: false,
    selection: Infinity,
    paging: false,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.title").$D("标题"),
      },
      {
        fieldCode: "assetCardNo",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.docNum").$D("表单编号"),
      },
      {
        fieldCode: "requestedName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.applicant").$D("申请人"),
      },
      {
        fieldCode: "requestDeptName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.applyDepartment").$D("申请部门"),
      },
      {
        fieldCode: "requestDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.assetCodeRequest.model.applyDate").$D("申请日期"),
        options: {
          format: "yyyy-MM-dd"
        },
        editor: false,
      },
      {
        fieldCode: "assetAdminName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.assetManageDeptAdmin").$D("资产管理部门管理员"),
        lovCode: "SPUC.EMPLOYEE_ON_NUM",
      },
      {
        fieldCode: "assetMgmtDeptName",
        fieldName: $T("scux.assetCodeRequest.model.assetManageDept").$D("资产管理部门"),
      },
      {
        fieldCode: "companyCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.companyCode").$D("所属公司编码"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.companyName").$D("所属公司名称"),
      },
      {
        fieldCode: "supplierCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.supplierCode").$D("供应商编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "budgetPeriod",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.budgetPeriod").$D("预算期间"),
      },
      {
        fieldCode: "currencyCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.currency").$D("币种"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.remark").$D("备注"),
      },
      {
        fieldCode: "erpStatus",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.interfaceStatus").$D("接口集成返回状态"),
      },
      {
        fieldCode: "erpMessage",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.interfaceMessage").$D("接口集成返回信息"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.purchaseAttachment").$D("采购附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.assetCodeRequest.button.viewAttachments").$D("查看附件")}/>
      },
      {
        fieldCode: "assetAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.assetAdminAttachment").$D("资产管理员附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.assetCodeRequest.button.viewAttachments").$D("查看附件")}/>
      },
      {
        fieldCode: "processArchiveUuid",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.processArchiveSheet").$D("流程归档面单"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.assetCodeRequest.button.viewAttachments").$D("查看附件")}/>
      },
      {
        fieldCode: "processRemark",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.model.processDescription").$D("流程说明"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/qTYibmRcTWPjpORh6VfFJT09A4sfN9rGQ65APJIIsltQ5xyl9oxHf0oicHXU87VVicr`,
        method: "get",
      },
    },
  };
}

function businessInfo() {
  return {
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    fields: [
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.lineNum").$D("序号"),
      },
      {
        fieldCode: "poAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.orderLineNum").$D("订单编号-行号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.orderItemName").$D("订单物料名称"),
      },
      {
        fieldCode: "assetName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.assetName").$D("资产名称"),
      },
      {
        fieldCode: "specifications",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.orderSpec").$D("订单规格"),
      },
      {
        fieldCode: "assetSpec",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.assetSpec").$D("资产规格"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.uom").$D("单位"),
        lovCode: "SMDM.UOM",
      },
      {
        fieldCode: "quantity",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.orderQty").$D("订单数量"),
      },
      {
        fieldCode: "taxRate",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.taxRate").$D("税率"),
        lovCode: "SMDM.TAX",
      },
      {
        fieldCode: "taxIncludePrice",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.amountTax").$D("含税金额"),
      },
      {
        fieldCode: "unitPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.amountWithoutTax").$D("原值（不含税金额）"),
        min: 0,
      },
      {
        fieldCode: "accumulatedQty",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.totalAcceptQty").$D("累计验收数量"),
      },
      {
        fieldCode: "manufacturerName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.manufacturer").$D("生产厂商"),
      },
      {
        fieldCode: "warrantyPeriod",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.warrantyPeriodMonths").$D("质保期（月）"),
        min: 0,
        precision: 0,
      },
      {
        fieldCode: "arrivalDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.assetCodeRequest.field.arrivalDate").$D("到货时间"),
        options: {
          format: "yyyy-MM-dd"
        },
        editor: false,
      },
      {
        fieldCode: "currentQty",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.acceptQty").$D("本次验收数量"),
      },
      {
        fieldCode: "lineRemark",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.lineRemark").$D("行备注"),
      },
      {
        fieldCode: "rdProjectName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.rdProject").$D("研发项目"),
        lovCode: "SCUX_HAISCO_DEV_PROJECT",
      },
      {
        fieldCode: "rdProjectBip",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.bipRdProject").$D("BIP研发项目"),
      },
      {
        fieldCode: "rdStageName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.rdStage").$D("研发阶段"),
        lovCode: "SCUX_HAISCO_PROJECT_PHASE",
      },
      {
        fieldCode: "rdStageBip",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.bipRdStage").$D("BIP研发阶段"),
      },
      {
        fieldCode: "trialNoName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.testNum").$D("试验编号"),
        lovCode: "SCUX_HAISCO_CLINICAL_TRIAL",
      },
      {
        fieldCode: "bipTrialNo",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.bipTestNum").$D("BIP试验编号"),
      },
      {
        fieldCode: "govSubsidyName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.govSubsidy").$D("政府补助"),
        lovCode: "SCUX_HAISCO_GOV_PROJECT",
      },
      {
        fieldCode: "displayPrNum",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.prLineNum").$D("采购申请单号-行号"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.pcNum").$D("采购合同单号-行号"),
      },
      {
        fieldCode: "assetCategoryName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.assetCategory").$D("资产类别"),
      },
      {
        fieldCode: "physicalAssetCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.physicalAssetCode").$D("实物资产编码"),
      },
      {
        fieldCode: "mergeMainAssetCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.mergedAssetCode").$D("合并主资产编码"),
      },
      {
        fieldCode: "managementDeptCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.managementDept").$D("管理部门编码"),
        lovCode: "SCUX_HAISCO_ERP_ACCOUNTING_ORG",
      },
      {
        fieldCode: "managementDeptName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.managementDeptName").$D("管理部门名称"),
      },
      {
        fieldCode: "acceptanceDeptCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.acceptDeptCode").$D("验收部门编码"),
        lovCode: "SCUX_HAISCO_ERP_ACCOUNTING_ORG",
      },
      {
        fieldCode: "acceptanceDeptName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.acceptDeptName").$D("验收部门名称"),
      },
      {
        fieldCode: "usageDeptCode",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.useDeptCode").$D("使用部门编码"),
      },
      {
        fieldCode: "usageDeptName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.useDeptName").$D("使用部门名称"),
      },
      {
        fieldCode: "userName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.useResponsiblePerson").$D("使用责任人"),
        lovCode: "SPUC.EMPLOYEE_ON_NUM",
      },
      {
        fieldCode: "assetAdminLineName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.useDeptAssetAdmin").$D("使用部门资产管理员"),
        lovCode: "SPUC.EMPLOYEE_ON_NUM",
      },
      {
        fieldCode: "location",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.storageLocation").$D("存放地点"),
      },
      {
        fieldCode: "deviceNo",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.equipmentNumber").$D("设备号"),
      },
      {
        fieldCode: "startUseDate",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.startUseDate").$D("开始使用日期"),
      },
      {
        fieldCode: "supplierCategoryName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.supplierCategory").$D("供应商类别"),
      },
      {
        fieldCode: "additionMethodName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.addMethod").$D("增加方式"),
      },
      {
        fieldCode: "isUsageRightAsset",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.isRightOfUseAsset").$D("是否使用权资产"),
      },
      {
        fieldCode: "usageStatusName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.useStatus").$D("使用状况"),
      },
      {
        fieldCode: "accountingStageName",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.accountingStage").$D("核算阶段"),
      },
      {
        fieldCode: "invoiceNo",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.invoiceNumber").$D("发票号"),
      },
      {
        fieldCode: "orderInvoiceLink",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.orderRelatedInvoice").$D("订单关联发票"),
      },
      {
        fieldCode: "assetCardNoBip",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.bipAssetCardCode").$D("BIP资产卡片编码"),
      },
      {
        fieldCode: "assetCardDateBip",
        fieldType: "TEXT",
        fieldName: $T("scux.assetCodeRequest.field.bipAssetCardCreateDate").$D("BIP资产卡片创建日期"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/qTYibmRcTWPjpORh6VfFJT1LfL2HAw12D9Osq69jxKc5EibLqxqgibgecOLVN0hN0rD`,
        method: "get",
      },
    },
  };
}

export { basicInfo, businessInfo };
