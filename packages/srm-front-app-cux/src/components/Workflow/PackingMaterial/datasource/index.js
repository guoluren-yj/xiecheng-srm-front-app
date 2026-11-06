import { $T } from "srm-mobile-ui";

function lineDs(falg) {
  const path =
    falg === "delay" ?
      `/scux/v1/${localStorage.getItem(
        "organizationId"
      )}/jala-order-date-ls/delay/{orderDateHId}` :
      `/scux/v1/${localStorage.getItem(
        "organizationId"
      )}/jala-order-date-ls/advance/{orderDateHId}`;

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {},
    fields:
      falg !== "delay" ?
        [
          {
            fieldCode: "processNum",
            fieldName: $T("scux.PackingMaterial.model.processNum").$D(
              "流程号"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "supplierCompanyName",
            fieldName: $T(
              "scux.PackingMaterial.model.supplierCompanyName"
            ).$D("供应商名称"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: $T("scux.PackingMaterial.model.itemName").$D(
              "物料名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode:
                falg === "delay" ?
                  "delayDeliveryQuantity" :
                  "advanceDeliveryQuantity",
            fieldName:
                falg === "delay" ?
                  $T(
                    "scux.PackingMaterial.model.advanceDeliveryQuantitysdelay"
                  ).$D("延迟交货数量") :
                  $T(
                    "scux.PackingMaterial.model.advanceDeliveryQuantitys"
                  ).$D("提前交货数量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "deliveryDate",
            fieldName: $T("scux.PackingMaterial.model.deliveryDate").$D(
              "现交货日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestedDate",
            fieldName: $T("scux.PackingMaterial.model.requestedDate").$D(
              "要求交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseManagerWorkFlowOpinion",
            fieldName: $T(
              "scux.PackingMaterial.model.purchaseManagerOpinions"
            ).$D("采购经理工作流审批意见"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestDate",
            fieldName: $T("scux.PackingMaterial.model.requestDate").$D(
              "申请日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "reasonTypeMeaning",
            fieldName: $T(
              "scux.PackingMaterial.model.reasonTypeMeaningtq"
            ).$D("提前原因类别"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
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
            fieldCode: "orderNum",
            fieldName: $T("scux.PackingMaterial.model.orderNum").$D("订单量"),
            fieldType: "TEXT",
          },
        ] :
        [
          {
            fieldCode: "processNum",
            fieldName: $T("scux.PackingMaterial.model.processNum").$D(
              "流程号"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "supplierCompanyName",
            fieldName: $T(
              "scux.PackingMaterial.model.supplierCompanyName"
            ).$D("供应商名称"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: $T("scux.PackingMaterial.model.itemName").$D(
              "物料名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode:
                falg === "delay" ?
                  "delayDeliveryQuantity" :
                  "advanceDeliveryQuantity",
            fieldName:
                falg === "delay" ?
                  $T(
                    "scux.PackingMaterial.model.advanceDeliveryQuantitysdelay"
                  ).$D("延迟交货数量") :
                  $T(
                    "scux.PackingMaterial.model.advanceDeliveryQuantitys"
                  ).$D("提前交货数量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "deliveryDate",
            fieldName: $T("scux.PackingMaterial.model.deliveryDate").$D(
              "现交货日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestedDate",
            fieldName: $T("scux.PackingMaterial.model.requestedDate").$D(
              "要求交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "reasonTypeMeaning",
            fieldName: $T("scux.PackingMaterial.model.reasonTypeMeaning").$D(
              "延迟原因类别"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseManagerWorkFlowOpinion",
            fieldName: $T(
              "scux.PackingMaterial.model.purchaseManagerOpinions"
            ).$D("采购经理工作流审批意见"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestDate",
            fieldName: $T("scux.PackingMaterial.model.requestDate").$D(
              "申请日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
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
            fieldCode: "orderNum",
            fieldName: $T("scux.PackingMaterial.model.orderNum").$D("订单量"),
            fieldType: "TEXT",
          },
        ],
    transport: {
      read: {
        url: path,
        method: "get",
      },
    },
  };
}

function headerDs(flag) {
  return {
    autoQuery: false,
    queryParameter: {},
    // enableQuery: true,
    // editable: true,
    fields:
      flag !== "delay" ?
        [
          {
            fieldCode: "processNum",
            fieldName: $T("scux.PackingMaterial.model.processNum").$D(
              "流程号"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "serialNumber",
            fieldName: $T("scux.PackingMaterial.model.serialNumber").$D(
              "序号"
            ),
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
            fieldCode: "supplierCompanyName",
            fieldName: $T(
              "scux.PackingMaterial.model.supplierCompanyName"
            ).$D("供应商名称"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestDate",
            fieldName: $T("scux.PackingMaterial.model.requestDate").$D(
              "申请日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("scux.PackingMaterial.model.itemCode").$D(
              "物料编码"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: $T("scux.PackingMaterial.model.itemName").$D(
              "物料名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poNum",
            fieldName: $T("scux.PackingMaterial.model.poNum").$D("订单号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poLineNum",
            fieldName: $T("scux.PackingMaterial.model.poLineNum").$D("行号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poLineNum",
            fieldName: $T("scux.PackingMaterial.model.poLineNum").$D(
              "下单日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "specification",
            fieldName: $T("scux.PackingMaterial.model.specification").$D(
              "规格"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "orderNum",
            fieldName: $T("scux.PackingMaterial.model.orderNum").$D("订单量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestedDate",
            fieldName: $T("scux.PackingMaterial.model.requestedDate").$D(
              "要求交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "attributeDate3",
            fieldName: $T("scux.PackingMaterial.model.attributeDate3").$D(
              "供应商考核交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "deliveryDate",
            fieldName: $T("scux.PackingMaterial.model.deliveryDate").$D(
              "现交货日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "advanceDeliveryQuantity",
            fieldName: $T(
              "scux.PackingMaterial.model.advanceDeliveryQuantity"
            ).$D("提前交货数量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "boxQuantity",
            fieldName: $T("scux.PackingMaterial.model.boxQuantity").$D(
              "箱数"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "palletQuantity",
            fieldName: $T("scux.PackingMaterial.model.palletQuantity").$D(
              "栈板数"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "reasonTypeMeaning",
            fieldName: $T(
              "scux.PackingMaterial.model.reasonTypeMeaningtq"
            ).$D("提前原因类别"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseAgentName",
            fieldName: $T("scux.PackingMaterial.model.purchaseAgentName").$D(
              "采购员"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "planOpinion",
            fieldName: $T("scux.PackingMaterial.model.planOpinion").$D(
              "计划意见"
            ),
          },
          {
            fieldCode: "businessDate",
            fieldName: $T("scux.PackingMaterial.model.businessDate").$D(
              "下单日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseManagerOpinion",
            fieldName: $T(
              "scux.PackingMaterial.model.purchaseManagerOpinion"
            ).$D("采购经理意见"),
          },
        ] :
        [
          // {
          //   fieldCode: "requestedDate",
          //   fieldName: $T("scux.PackingMaterial.model.requestedDates").$D(
          //     "原交货日期"
          //   ),
          //   fieldType: "TEXT",
          // },
          {
            fieldCode: "orderTypeName",
            fieldName: $T("scux.AdvanceRawMaterials.model.orderTypeName").$D(
              "订单类型"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "businessDate",
            fieldName: $T("scux.PackingMaterial.model.businessDate").$D(
              "下单日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "produceCycle",
            fieldName: $T("scux.PackingMaterial.model.produceCycle").$D(
              "无备货生产周期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "deliveryCycle",
            fieldName: $T("scux.PackingMaterial.model.deliveryCycle").$D(
              "现交货周期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestedCycle",
            fieldName: $T("scux.PackingMaterial.model.requestedCycle").$D(
              "原交货周期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "processNum",
            fieldName: $T("scux.PackingMaterial.model.processNum").$D(
              "流程号"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "serialNumber",
            fieldName: $T("scux.PackingMaterial.model.serialNumber").$D(
              "序号"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "supplierCompanyName",
            fieldName: $T(
              "scux.PackingMaterial.model.supplierCompanyName"
            ).$D("供应商名称"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestDate",
            fieldName: $T("scux.PackingMaterial.model.requestDate").$D(
              "申请日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("scux.PackingMaterial.model.itemCode").$D(
              "物料编码"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: $T("scux.PackingMaterial.model.itemName").$D(
              "物料名称"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poNum",
            fieldName: $T("scux.PackingMaterial.model.poNum").$D("订单号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poLineNum",
            fieldName: $T("scux.PackingMaterial.model.poLineNum").$D("行号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "poLineNum",
            fieldName: $T("scux.PackingMaterial.model.poLineNum").$D(
              "下单日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "reasonTypeMeaning",
            fieldName: $T(
              "scux.PackingMaterial.model.reasonTypeMeaningyc"
            ).$D("延迟原因类别"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "specification",
            fieldName: $T("scux.PackingMaterial.model.specification").$D(
              "规格"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "orderNum",
            fieldName: $T("scux.PackingMaterial.model.orderNum").$D("订单量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "requestedDate",
            fieldName: $T("scux.PackingMaterial.model.requestedDate").$D(
              "要求交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "attributeDate3",
            fieldName: $T("scux.PackingMaterial.model.attributeDate3").$D(
              "供应商考核交期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "deliveryDate",
            fieldName: $T("scux.PackingMaterial.model.deliveryDate").$D(
              "现交货日期"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "delayDeliveryQuantity",
            fieldName: $T(
              "scux.PackingMaterial.model.delayDeliveryQuantity"
            ).$D("延迟交货数量"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "boxQuantity",
            fieldName: $T("scux.PackingMaterial.model.boxQuantity").$D(
              "箱数"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "palletQuantity",
            fieldName: $T("scux.PackingMaterial.model.palletQuantity").$D(
              "栈板数"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "detailsReason",
            fieldName: $T("scux.PackingMaterial.model.detailsReason").$D(
              "详细原因"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "purchaseAgentName",
            fieldName: $T("scux.PackingMaterial.model.purchaseAgentName").$D(
              "采购员"
            ),
            fieldType: "TEXT",
          },
          {
            fieldCode: "planOpinion",
            fieldName: $T("scux.PackingMaterial.model.planOpinion").$D(
              "计划意见"
            ),
          },
          {
            fieldCode: "purchaseManagerOpinion",
            fieldName: $T(
              "scux.PackingMaterial.model.purchaseManagerOpinion"
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

export { headerDs, lineDs };
