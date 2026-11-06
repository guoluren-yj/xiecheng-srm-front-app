import { $T } from "srm-mobile-ui";

function itemDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: [
      {
        fieldCode: "changeType",
        fieldName: $T("scux.ecrChangeRequset.model.changeType").$D("变更类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "drawingNo",
        fieldName: $T("scux.ecrChangeRequset.model.drawingNo").$D(
          "图号"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "name",
        fieldName: $T("scux.ecrChangeRequset.model.name").$D("名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changeDescription",
        fieldName: $T("scux.ecrChangeRequset.model.changeDescription").$D("变更说明"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "needCountInventoryFlag",
        fieldName: $T("scux.ecrChangeRequset.model.needCountInventoryFlag").$D(
          "是否需要统计库存"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "finishedProduct",
        fieldName: $T("scux.ecrChangeRequset.model.finishedProduct").$D(
          "成品"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "semiFinishedProducts",
        fieldName: $T("scux.ecrChangeRequset.model.semiFinishedProducts").$D(
          "半成品"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "accessory",
        fieldName: $T("scux.ecrChangeRequset.model.accessory").$D(
          "备件"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "inGarage",
        fieldName: $T("scux.ecrChangeRequset.model.inGarage").$D("在库车"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "makingCars",
        fieldName: $T("scux.ecrChangeRequset.model.makingCars").$D(
          "在制车"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "outGarage",
        fieldName: $T("scux.ecrChangeRequset.model.outGarage").$D(
          "出库车"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purchaseAgentIdMeaning",
        fieldName: $T("scux.ecrChangeRequset.model.purchaseAgentIdMeaning").$D(
          "采购员"
        ),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem(
          "organizationId"
        )}/marmot-api/nTG2BVYwpX7De18kKrIBmhNpPkiciamYAmPoOGCNib2W8VlDtb5jwTCXYADQUvep5BP`,
        method: "get",
      },
    },
  };
}

function headerDs() {
  return {
    fields: [
      {
        fieldCode: "ecrNum",
        fieldName: $T("scux.ecrChangeRequset.model.ecrNum").$D(
          "PLM设计变更单号"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "name",
        fieldName: $T("scux.ecrChangeRequset.model.name").$D("名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "importanceLevel",
        fieldName: $T("scux.ecrChangeRequset.model.importanceLevel").$D(
          "重要度等级"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changeClassification",
        fieldName: $T("scux.ecrChangeRequset.model.changeClassification").$D(
          "变更分类"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changeModel",
        fieldName: $T("scux.ecrChangeRequset.model.changeModel").$D("变更机型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changeMmodelStatus",
        fieldName: $T("scux.ecrChangeRequset.model.changeMmodelStatus").$D(
          "变更机型状态"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "parametersAndAppearance",
        fieldName: $T("scux.ecrChangeRequset.model.parametersAndAppearance").$D(
          "参数、外观重大变更"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "priorityLevel",
        fieldName: $T("scux.ecrChangeRequset.model.priorityLevel").$D(
          "优先级别"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "statusMeaning",
        fieldName: $T("scux.ecrChangeRequset.model.statusMeaning").$D("状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changePurpose",
        fieldName: $T("scux.ecrChangeRequset.model.changePurpose").$D(
          "变更目的"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "changeDescription",
        fieldName: $T("scux.ecrChangeRequset.model.changeDescription").$D(
          "变更内容"
        ),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.ecrChangeRequset.model.creationDate").$D(
          "创建时间"
        ),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem(
          "organizationId"
        )}/marmot-api/nTG2BVYwpX7De18kKrIBmoLUbbg1Zm5baxEJRibok9eicSWXpibRFPpf3kXachNGia3q`,
        method: "get",
      },
    },
  };
}

function supplierDs() {
  return {
    fields: [
      {
        fieldCode: "drawingNo",
        fieldName: $T("scux.ecrChangeRequset.model.drawingNo").$D("图号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "name",
        fieldName: $T("scux.ecrChangeRequset.model.name").$D("名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purchaser",
        fieldName: $T("scux.ecrChangeRequset.model.purchaser").$D("采购员"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "approvalStatusMeaning",
        fieldName: $T("scux.ecrChangeRequset.model.approvalStatus").$D("审批状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldName: $T("scux.ecrChangeRequset.model.supplierCompanyNum").$D("供应商编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.ecrChangeRequset.model.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "feedbackStatusMeaning",
        fieldName: $T("scux.ecrChangeRequset.model.feedbackStatus").$D("供应商反馈状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "inventorySituation",
        fieldName: $T("scux.ecrChangeRequset.model.inventorySituation").$D("库存情况"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationMethodMeaning",
        fieldName: $T("scux.ecrChangeRequset.model.creationMethod").$D("创建方式"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem(
          "organizationId"
        )}/marmot-api/nTG2BVYwpX7De18kKrIBmm3ZnicKyr8G7MIPOBcVcNeCc2QypgWMGDzmQH8viaSHkb`,
        method: "get",
      },
    },
  };
}

export { headerDs, itemDs, supplierDs };
