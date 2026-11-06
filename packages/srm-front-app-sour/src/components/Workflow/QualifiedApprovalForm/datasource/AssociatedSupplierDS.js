import { $T, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

function associatedSupplierDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
        fieldCode: "itemName",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${organizationId}/model-data/listTableData`,
        method: "post",
      },
    },
  };
}

export { associatedSupplierDS };
