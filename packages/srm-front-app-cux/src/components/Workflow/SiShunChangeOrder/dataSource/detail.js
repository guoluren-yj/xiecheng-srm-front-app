import { SrmUtil, $T } from "srm-mobile-ui";

function getFields(_, changeType = "") {
  return [
    {
      fieldCode: "changeHeaderNum",
      fieldName: $T("scux.changeOrder.model.common.changeHeaderNum").$D(
        "变更单单号",
      ),
    },
    {
      fieldCode: "changeTypeMeaning",
      fieldName: $T("scux.changeOrder.model.common.changeTypeMeaning").$D(
        "变更类型",
      ),
    },
    {
      fieldCode: "creationDate",
      fieldName: $T("scux.changeOrder.model.common.creationDate").$D(
        "创建时间",
      ),
    },
    {
      fieldCode: "approveEmployeeName",
      fieldName: $T("scux.changeOrder.model.common.approveEmployeeNum").$D(
        "指定审批人（采购运营组长）",
      ),
    },
    {
      fieldCode: "createdByName",
      fieldName: $T("scux.changeOrder.model.common.createdByName").$D("创建人"),
    },
    {
      fieldCode: "remark",
      fieldName: $T("scux.changeOrder.model.common.remark").$D("变更备注"),
    },
    {
      fieldCode: "lineStatusMeaning",
      fieldName: $T("scux.changeOrder.model.common.lineStatusMeaning").$D(
        "状态",
      ),
    },
    {
      fieldCode: "displayPoNum",
      fieldName: $T("scux.changeOrder.model.common.displayPoNum").$D("订单号"),
    },
    {
      fieldCode: "displayLineNum",
      fieldName: $T("scux.changeOrder.model.common.displayLineNum").$D("行号"),
    },
    {
      fieldCode: "itemCode",
      fieldName: $T("scux.changeOrder.model.common.itemCode").$D("SKU编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("scux.changeOrder.model.common.itemName").$D("SKU名称"),
    },
    {
      fieldCode: "supplierNum",
      fieldName: $T("scux.changeOrder.model.common.supplierNum").$D(
        "供应商编码",
      ),
    },
    {
      fieldCode: "supplierName",
      fieldName: $T("scux.changeOrder.model.common.supplierName").$D(
        "供应商名称",
      ),
    },
    {
      fieldCode: "uomName",
      fieldName: $T("scux.changeOrder.model.common.uomName").$D("单位"),
    },
    {
      fieldCode: "boxGauge",
      fieldName: $T("scux.changeOrder.model.common.boxGauge").$D("箱规"),
    },
    {
      fieldCode: "splitTypeMeaning",
      fieldName: $T("scux.changeOrder.model.common.splitTypeMeaning").$D(
        "拆单类型",
      ),
    },
    {
      fieldCode: "quantity",
      fieldName: $T("scux.changeOrder.model.common.quantity").$D("数量"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "expDomesticDeliveryDate",
      fieldName: $T("scux.changeOrder.model.common.expDomesticDeliveryDate").$D(
        "国内要求到货日期",
      ),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "freezeFlagMeaning",
      fieldName: $T("scux.changeOrder.model.common.freezeFlagMeaning").$D(
        "冻结/解冻标识",
      ),
    },
    {
      fieldCode: "earlyArrivalFlagMeaning",
      fieldName: $T("scux.changeOrder.model.common.earlyArrivalFlagMeaning").$D(
        "早到货/解除早到货标识",
      ),
    },
    {
      fieldCode: "refusalReason1Meaning",
      fieldName: [ "QUANTITY", "DELIVERY_DATE" ].includes(changeType) ? $T("scux.changeOrder.model.common.changeRefusalReason1").$D(
        "变更/拒单一级原因",
      ) : $T("scux.changeOrder.model.common.refusalReason1").$D("拒单一级原因"),
      // render: function (val) {
      //   return lookupMaps?.refusalReason1Map[val] || val || "";
      // },
    },
    {
      fieldCode: "refusalReason2Meaning",
      fieldName: [ "QUANTITY", "DELIVERY_DATE" ].includes(changeType) ? $T("scux.changeOrder.model.common.changeRefusalReason2").$D(
        "变更/拒单二级原因",
      ) : $T("scux.changeOrder.model.common.refusalReason2").$D("拒单二级原因"),
      // render: function (val) {
      //   return lookupMaps?.refusalReason2Map[val] || val || "";
      // },
    },
    {
      fieldCode: "refusalRemark",
      fieldName: [ "QUANTITY", "DELIVERY_DATE" ].includes(changeType) ? $T("scux.changeOrder.model.common.changeRefusalRemark").$D(
        "变更/拒单详细说明",
      ) : $T("scux.changeOrder.model.common.refusalRemark").$D("拒单详细说明"),
    },
    {
      fieldCode: "changeReasonMeaning",
      fieldName: $T("scux.changeOrder.model.common.changeReasonMeaning").$D(
        "变更原因",
      ),
    },
    {
      fieldCode: "removedFlagMeaning",
      fieldName: $T("scux.changeOrder.model.common.removedFlagMeaning").$D(
        "是否剔除",
      ),
    },
    {
      fieldCode: "lineRemark",
      fieldName: $T("scux.changeOrder.model.common.lineRemark").$D("行备注"),
    },
  ];
}

function orderHeaderDataSet(changeHeaderId, lookupMaps = {}) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    fields: getFields(lookupMaps),
  };
}

function orderLineDataSet(changeHeaderId, lookupMaps = {}, changeType) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    queryParameter: {
      changeHeaderId,
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/hx4pZQibFnQh84iaiclfYI8TEjZ9BaREAgasoss90hic7M8`,
        method: "get",
      },
    },
    fields: getFields(lookupMaps, changeType),
  };
}

function orderLineDetailDataSet(lookupMaps = {}, changeType = "") {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    fields: getFields(lookupMaps, changeType),
  };
}

export { orderHeaderDataSet, orderLineDataSet, orderLineDetailDataSet };
