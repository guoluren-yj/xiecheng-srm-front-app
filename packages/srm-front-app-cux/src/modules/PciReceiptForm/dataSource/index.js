import { SrmUtil, $T } from "srm-mobile-ui";

function tableDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    fastQueryField: [
      {
        fieldName: $T("scux.receipt.model.signNum").$D("收货单号"),
        fieldCode: "signNum",
        fieldType: "TEXT",
      },
    ],
    fields: [
      {
        fieldName: $T("scux.receipt.model.signStatus").$D("状态"),
        fieldCode: "signStatusMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.workApproveString").$D("工作流审批人"),
        fieldCode: "workApproveString",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.signNum").$D("收货单号"),
        fieldCode: "signNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.asnNum").$D("送货单号"),
        fieldType: "TEXT",
        fieldCode: "asnNum",
      },
      {
        fieldName: $T("scux.receipt.model.asnAddressType").$D("送货地类型"),
        fieldType: "TEXT",
        fieldCode: "asnAddressTypeMeaning",
      },
      {
        fieldName: $T("scux.receipt.model.shipDate").$D("送货日期"),
        fieldCode: "shipDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.supplierName").$D("供应商"),
        fieldCode: "supplierName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.companyName").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.signRemark").$D("备注"),
        fieldCode: "signRemark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.createName").$D("创建人"),
        fieldCode: "createName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.importStatus").$D("ERP导入状态"),
        fieldCode: "importStatusMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.attributeVarchar1").$D("ERP错误信息"),
        fieldCode: "attributeVarchar1",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.attributeVarchar2").$D("SRM收货记录状态"),
        fieldCode: "attributeVarchar2Meaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.attributeVarchar3").$D("SRM错误信息"),
        fieldCode: "attributeVarchar3",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.attributeVarchar5").$D("导出状态"),
        fieldCode: "attributeVarchar5Meaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.attributeVarchar6").$D("失败原因"),
        fieldCode: "attributeVarchar6",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.receipt.model.option").$D("操作记录"),
        fieldCode: "option",
        fieldType: "TEXT",
      },
    ],
    queryFields: [
      {
        fieldName: $T("scux.receipt.model.supplierName").$D("供应商"),
        fieldCode: "supplierName",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-headers/list-all`,
        method: "get",
      },
    },
  };
}

function headerDs(tenantId) {
  return {
    autoQuery: false,
    selection: 0,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("scux.receipt.model.receipt.asnNum").$D("送货单号"),
        fieldCode: "asnNum",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.signNum").$D("收货单号"),
        fieldCode: "signNum",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.attachmentUuids").$D("附件"),
        fieldCode: "attachmentUuid",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.supplierName").$D("供应商名称"),
        fieldCode: "supplierName",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.shipDate").$D("发货日期"),
        fieldCode: "shipDate",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.asnAddressType").$D("送货地类型"),
        fieldCode: "asnAddressTypeMeaning",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.factoryName").$D("外协厂名称"),
        fieldCode: "attributeVarchar27",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.createName").$D("创建人"),
        fieldCode: "createName",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.creationDate").$D("创建日期"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.signStatus").$D("状态"),
        fieldCode: "signStatusMeaning",
      },
      {
        fieldName: $T("scux.receipt.model.receipt.signRemark").$D("备注"),
        fieldCode: "signRemark",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${tenantId}/pci-asn-sign-headers/{asnSignHeaderId}`,
        method: "get",
      },
    },
  };
}

function lineDs(tenantId) {
  return {
    autoQuery: false,
    selection: 0,
    enableQuery: false,
    fields: [
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.itemCode").$D("物料编码"),
        render: (_, item) =>
          <SrmListHeader>
            {item.itemCode}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }}>
              {$T("scux.receipt.model.receipt.asnSignLineNum").$D("行号")}:{item.asnSignLineNum}
            </SrmButton>
          </SrmListHeader>
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.itemName").$D("物料名称"),
      },
      {
        fieldCode: "asnLineNum",
        fieldType: "NUMBER",
        fieldName: $T("scux.receipt.model.receipt.asnLineNum").$D("送货单行号"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.uomName").$D("单位"),
      },
      {
        fieldCode: "quantity",
        fieldType: "NUMBER",
        fieldName: $T("scux.receipt.model.receipt.quantity").$D("送货数量"),
      },
      {
        fieldCode: "receiveQuantity",
        fieldType: "NUMBER",
        fieldName: $T("scux.receipt.model.receipt.receiveQuantity").$D("实收数量"),
      },
      {
        fieldCode: "signDate",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.signDate").$D("实际签收时间"),
      },
      {
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.inventoryName").$D("子库"),
      },
      {
        fieldCode: "productNum",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.productNum").$D("项目号"),
      },
      {
        fieldCode: "productName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.productName").$D("项目名称"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.ouName").$D("业务实体"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "srmRcvTrxNum",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.srmRcvTrxNum").$D("事务编码"),
      },
      {
        fieldCode: "srmRcvTrxLineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.srmRcvTrxLineNum").$D("事务行号"),
      },
      {
        fieldCode: "signRemark",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.remarks").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${tenantId}/pci-asn-sign-lines/{asnSignHeaderId}/lines`,
        method: "get",
      },
    },
  };
}

export { tableDs, headerDs, lineDs };
