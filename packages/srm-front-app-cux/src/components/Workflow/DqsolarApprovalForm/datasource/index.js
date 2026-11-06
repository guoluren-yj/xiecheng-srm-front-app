import { SrmUtil, $T } from "srm-mobile-ui";
function headerData(pcnHeaderId, statusConfigId) {
  const { currentRoleCode } = SrmUtil.getUserInfo();
  const flag = currentRoleCode === "dqsolar_gczz";
  const flag1 = currentRoleCode === "dqsolar_financer";
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate: true,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.dqsolarApproval.model.pcnNum").$D("变更单号"),
        fieldCode: "pcnNum",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar1").$D(
          "合同号",
        ),
        fieldCode: "attributeVarchar1",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar8").$D(
          "期数",
        ),
        fieldCode: "attributeVarchar8",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar40").$D(
          "相关部门",
        ),
        fieldCode: "attributeVarchar40Meaning",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.creationDate").$D("报审日期"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.supplierPrincipal").$D(
          "报审人",
        ),
        fieldCode: "supplierPrincipal",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar2").$D(
          "合同金额",
        ),
        fieldCode: "attributeVarchar2",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar3").$D(
          "送审金额",
        ),
        fieldCode: "attributeVarchar3",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.companyLOV").$D("公司名称"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar4").$D(
          "初审金额",
        ),
        fieldType: "INPUT_NUMBER",
        editor: flag,
        required: flag,
        fieldCode: "attributeVarchar4",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.supplierCompanyName").$D(
          "供应商",
        ),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar5").$D(
          "三方审计金额",
        ),
        fieldCode: "attributeVarchar5",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.typeLOV").$D("报审类型"),
        fieldCode: "typeName",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.remark").$D("说明"),
        fieldCode: "remark",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar6").$D(
          "发票已挂账金额",
        ),
        fieldCode: "attributeVarchar6",
        editor: flag1,
        required: flag1,
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar7").$D(
          "已付款金额",
        ),
        fieldCode: "attributeVarchar7",
        editor: flag1,
        required: flag1,
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar37").$D(
          "是否二公司",
        ),
        fieldCode: "attributeVarchar37Meaning",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar10").$D(
          "需求部门",
        ),
        fieldCode: "attributeVarchar10Meaning",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar39").$D(
          "分管领导",
        ),
        fieldCode: "attributeVarchar39Meaning",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar9").$D(
          "工程名称",
        ),
        fieldCode: "attributeVarchar9",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar38").$D(
          "是否第三方审计",
        ),
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG.NEW",
        editor: flag,
        required: flag,
        fieldCode: "attributeVarchar38",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.supplierAttachmentUuid").$D(
          "供应商附件",
        ),
        fieldCode: "supplierAttachmentUuid",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attachmentUuid").$D(
          "采购方附件",
        ),
        fieldCode: "attachmentUuid",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar36").$D(
          "移动端审批预留1",
        ),
        fieldCode: "attributeVarchar36",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeLongtext1").$D(
          "移动端审批预留2",
        ),
        fieldCode: "attributeLongtext1",
      },
      {
        fieldName: $T("scux.dqsolarApproval.model.attributeVarchar11").$D(
          "移动端审批预留3",
        ),
        fieldCode: "attributeVarchar11",
      },
    ],
    transport: {
      read: {
        url: `/siec/v1/${SrmUtil.getTenantId()}/pcn-headers/${pcnHeaderId}/${statusConfigId}`,
        method: "get",
      },
    },
  };
}

function lineInfoDs(pcnHeaderId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.dqsolarApproval.model.dqsolarApproval.lineNum").$D(
          "行号",
        ),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.dqsolarApproval.model.dqsolarApproval.itemCode").$D(
          "物料编码",
        ),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.dqsolarApproval.model.dqsolarApproval.itemName").$D(
          "物料名称",
        ),
      },
      {
        fieldCode: "industryCategoryName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.industryCategoryName",
        ).$D("物料品类"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("scux.dqsolarApproval.model.dqsolarApproval.uomName").$D(
          "单位",
        ),
      },
      {
        fieldCode: "supplierInventoryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.supplierInventoryQuantity",
        ).$D("供应商库存"),
      },
      {
        fieldCode: "supplierProcessingMethod",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.supplierProcessingMethod",
        ).$D("供应商库存处理方式"),
      },
      {
        fieldCode: "supplierRemark",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.supplierRemark",
        ).$D("供应商备注"),
      },
      {
        fieldCode: "buyerInventoryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.buyerInventoryQuantity",
        ).$D("采购方库存"),
      },
      {
        fieldCode: "buyerProcessingMethod",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.buyerProcessingMethod",
        ).$D("采购方库存处理方式"),
      },
      {
        fieldCode: "buyerRemark",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.buyerRemark",
        ).$D("采购方备注"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T(
          "scux.dqsolarApproval.model.dqsolarApproval.attachmentUuid",
        ).$D("行附件"),
      },
    ],
    transport: {
      read: {
        url: `/siec/v1/${SrmUtil.getTenantId()}/pcn-lines/${pcnHeaderId}`,
        method: "post",
      },
    },
  };
}

export { lineInfoDs, headerData };
