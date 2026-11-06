import { $T, SrmUtil } from "srm-mobile-ui";

function detailLineDs(type) {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
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
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("scux.receipt.model.receipt.attachmentUuid").$D("查看附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.receipt.button.viewAttachments").$D("查看附件")}/>
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
        fieldCode: "inventoryCode",
        fieldType: "LOV",
        fieldName: $T("scux.receipt.model.receipt.inventoryName").$D("子库"),
        lovCode: "SCUX.PCI.INVENTORY",
        required: type === "1",
        editor: type === "1",
        // displayField: "inventoryName",
        options: {
          valueField: "inventoryCode",
          displayField: "inventoryName",
          subDisplayField: "inventoryCode",
          // queryParams: {
          //   ouId: item.ouId,
          // },
        },
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
        url: `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-lines/{asnSignHeaderId}/lines`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        setTimeout(() => {
          if (!ds.current) {
            return;
          }
          ds.records.forEach((item) => {
            const ouId = item.getField("inventoryCode");
            ouId.setLovParam({
              ouId: item.data.ouId
            });
          });
        }, 0);
        return data;
      }
    }
  };
}

function detailHeaderDs(type) {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldName: $T("scux.receipt.created.model.attributeVarchar7").$D("是否按时收货"),
        fieldType: "SELECT",
        lovCode: "SPCM.YN",
        fieldCode: "attributeVarchar7",
        errorMessage: $T("scux.receipt.created.submit.all.valte").$D("请输入必输项!"),
        // required: type === "2",
        required: (val, data, _, record) => {
          if (type === "2") {
            return true;
          }
          if (type === "1" && record?.get("asnAddressType") === "Goods_to_the_warehouse") {
            return true;
          }
        },
      },
      {
        fieldName: $T("scux.receipt.created.model.attributeVarchar7").$D("是否按时收货"),
        fieldCode: "attributeVarchar7Meaning",
      },
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
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.receipt.button.viewAttachments").$D("查看附件")} />,
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
        url: `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-headers/{asnSignHeaderId}`,
        method: "get",
      },
    },
  };
}

export { detailLineDs, detailHeaderDs };
