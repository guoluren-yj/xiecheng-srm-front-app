import { $T } from "srm-mobile-ui";

function lineDs(orderType) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {},
    fields: [
      {
        fieldCode: "detailsReason",
        fieldName: $T("scux.AdvanceRawMaterials.model.detailsReason").$D(
          "详细原因"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "reasonTypeMeaning",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.reasonTypeMeaningdelay"
        ).$D("延迟原因类别"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "advanceDeliveryQuantity",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.advanceDeliveryQuantity"
        ).$D("提前交货数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "processNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.processNum").$D("流程号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.AdvanceRawMaterials.model.supplierCompanyName").$D(
          "供应商名称"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.AdvanceRawMaterials.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "delayDeliveryQuantity",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.delayDeliveryQuantity"
        ).$D("延迟交货数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "deliveryDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.deliveryDate").$D(
          "现交货日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "requestedDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.requestedDates").$D(
          "原交货日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purchaseManagerWorkFlowOpinion",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.purchaseManagerOpinions"
        ).$D("采购经理工作流审批意见"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "orderTypeName",
        fieldName: $T("scux.AdvanceRawMaterials.model.orderTypeName").$D(
          "订单类型"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "requestDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.requestDate").$D(
          "申请日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "orderNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.orderNum").$D("订单量"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      // ${localStorage.getItem("organizationId")}
      read: {
        url: `/scux/v1/${localStorage.getItem(
          "organizationId"
        )}/jala-material-data-ls/${orderType}/{orderDateHId}`,
        method: "get",
      },
    },
  };
}

function headerDs() {
  return {
    autoQuery: false,
    editable: true,
    autoCreate: true,
    fields: [
      {
        fieldCode: "reasonTypeMeaning",
        fieldType: "TEXT",
      },
      {
        fieldCode: "delayDeliveryQuantity",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.delayDeliveryQuantity"
        ).$D("延迟交货数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "orderTypeName",
        fieldName: $T("scux.AdvanceRawMaterials.model.orderTypeName").$D(
          "订单类型"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "processNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.processNum").$D("流程号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "serialNumber",
        fieldName: $T("scux.AdvanceRawMaterials.model.serialNumber").$D("序号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.AdvanceRawMaterials.model.supplierCompanyName").$D(
          "供应商名称"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "requestDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.requestDate").$D(
          "申请日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.AdvanceRawMaterials.model.itemCode").$D("物料编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.AdvanceRawMaterials.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "poNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.poNum").$D("订单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "poLineNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.poLineNum").$D("行号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "businessDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.businessDate").$D(
          "下单日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sapPoNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.sapPoNum").$D(
          "sap订单号"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "secretLevel",
        fieldName: $T("scux.AdvanceRawMaterials.model.secretLevel").$D(
          "保密级别"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "specification",
        fieldName: $T("scux.AdvanceRawMaterials.model.specification").$D(
          "规格"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "orderNum",
        fieldName: $T("scux.AdvanceRawMaterials.model.orderNum").$D("订单量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "requestedDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.requestedDates").$D(
          "原交货日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "requestedCycle",
        fieldName: $T("scux.AdvanceRawMaterials.model.requestedCycle").$D(
          "原交货周期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "deliveryCycle",
        fieldName: $T("scux.AdvanceRawMaterials.model.deliveryCycle").$D(
          "现交货周期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "deliveryDate",
        fieldName: $T("scux.AdvanceRawMaterials.model.deliveryDate").$D(
          "现交货日期"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "advanceDeliveryQuantity",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.advanceDeliveryQuantity"
        ).$D("提前交货数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "boxQuantity",
        fieldName: $T("scux.AdvanceRawMaterials.model.boxQuantity").$D("箱数"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "palletQuantity",
        fieldName: $T("scux.AdvanceRawMaterials.model.palletQuantity").$D(
          "栈板数"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "reasonTypeMeaning",
        fieldName: $T("scux.AdvanceRawMaterials.model.reasonTypeMeanings").$D(
          "提前原因类别"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "detailsReason",
        fieldName: $T("scux.AdvanceRawMaterials.model.detailsReason").$D(
          "详细原因"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: $T("scux.AdvanceRawMaterials.model.purchaseAgentName").$D(
          "采购员"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "planOpinion",
        fieldName: $T("scux.AdvanceRawMaterials.model.planOpinion").$D(
          "计划意见"
        ),
      },
      {
        fieldCode: "purchaseManagerOpinion",
        fieldName: $T(
          "scux.AdvanceRawMaterials.model.purchaseManagerOpinion"
        ).$D("采购经理意见"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem(
          "organizationId"
        )}/marmot-api/vZkl8bIgKqL24bhSiaxfNhHc9bJiae3Yh09LRiaQ6MSHtM`,
        method: "get",
      },
    },
  };
}

export { lineDs, headerDs };
