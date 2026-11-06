import { $T } from "srm-mobile-ui";

function headerDs(params) {
  return {
    autoQuery: true,
    fields: [
      {
        fieldCode: "composeNum",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.composeNum").$D("合并开发申请单据编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "composeName",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.composeName").$D("组合单据名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.remark").$D("备注"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/2I6XchtxRfj5X3p2HZicpGxCia7eqx2V4SFDvwPvVxhUaap9hdvlLjTSdGicNZArTJg`,
        method: "get",
        params,
      },
    },
  };
}

function billInfoDs(params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "supplierAccessNum",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.accessNum").$D("单据编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "conSupCompanyName",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.conSupCompanyName").$D("合同供应商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "factoryName",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.factoryName").$D("准入工厂"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.categoryName").$D("准入品类"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "developmentPurpose",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.developmentPurpose").$D("开发目的"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "passProject",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.passProject").$D("是否通过项目会"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "range",
        fieldName: $T("scux.ConsolidatedPpprovalFrom.model.range").$D("范围"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/QlHPWXukDvQ2eItY24d3QtbNKMs8OCe41BsukiaEONrw`,
        method: "get",
        params,
      },
    },
  };
}

export { headerDs, billInfoDs };