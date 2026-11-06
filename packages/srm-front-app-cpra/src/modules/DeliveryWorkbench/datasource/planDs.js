// 计划
import { $T, SrmUtil } from "srm-mobile-ui";
// 待创建
function planDsByCreate(configAbc = "A") {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable:true, // 显示查询卡框右边的编辑（笔）
    enableQuery: true,
    // 筛选器
    filterCustomizeCode: `SMBL.DELIVERY_WORKBENCH.PLAN_${configAbc}.SEARCH.CREATE`,
    // 快速查询
    fastQueryField: {
      fieldName: $T("slod.common.model.common.deliveryHeaderAndLineNums").$D("来源订单号"),
      fieldCode: "deliveryHeaderAndLineNums",
      fieldType: "TEXT",
    },
    queryParameter: {
      nodeTemplateCode: null,
      nodeConfigId: null,
      customizeUnitCode: null,
      asyncCountFlag: "N",
    },
    pathParameter: {
      id: null,
    },
    // 模型字段
    fields: [
      {
        fieldCode: "itemName",
        fieldName: $T("slod.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("slod.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "displayUom",
        fieldName: $T("slod.common.model.common.displayUom").$D("单位"),
      },
      {
        fieldCode: "canCreateQuantity",
        fieldName: $T("slod.common.model.common.canCreateQuantity").$D("可创建数量"),
      },
      {
        fieldCode: "fromDisplayPoNum",
        fieldName: $T("slod.common.model.common.fromDisplayPoNum").$D("来源订单号-行号"),
      },
      {
        fieldCode: "neededDate",
        fieldName: $T("slod.common.model.common.neededDate").$D("需求日期"),
      },
      {
        fieldCode: "promisedDate",
        fieldName: $T("slod.common.model.common.promisedDate").$D("承诺交货日期"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("slod.common.model.common.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "sourceNodeConfigName",
        fieldName: $T("slod.common.model.common.sourceNodeConfigName").$D("来源单据类型"),
      },
      {
        fieldCode: "sourceDisplayNum",
        fieldName: $T("slod.common.model.common.sourceDisplayNum").$D("来源单据编号-行号"),
      },
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/wait-create/line/page?campKey=p`,
        method: "get",
      },
      submit: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/create?campKey=p`,
        method: "post",
      },
      update: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/create/condition?campKey=p`,
        method: "post",
      }
    },
  };
}
// 待提交
function planDsBySubmit(configAbc = "A") {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: true,
    // 筛选器
    filterCustomizeCode: `SMBL.DELIVERY_WORKBENCH.PLAN_${configAbc}.SEARCH.SUBMIT`,
    // 快速查询
    fastQueryField: {
      fieldName: $T("slod.common.model.common.deliveryHeaderAndLineNum").$D("订单号/单据编号"),
      fieldCode: "deliveryHeaderAndLineNums",
      fieldType: "TEXT",
    },
    queryParameter: {
      nodeTemplateCode: null,
      nodeConfigId: null,
      customizeUnitCode: null,
      asyncCountFlag: "N",
    },
    pathParameter: {
      id: null,
    },
    // 模型字段
    fields: [
      {
        fieldCode: "displayPlanNum",
        fieldName: $T("slod.common.model.common.displayAsnNum").$D("单据编号"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldName: $T("slod.common.model.common.statusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("slod.common.model.common.creationTime").$D("创建时间"),
      },
      {
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "operating",
        fieldName: $T("slod.common.model.common.operating").$D("操作记录"),
      }
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/wait-submit/header/page?campKey=p`,
        method: "get",
      },
      submit: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/submit/tabulation?campKey=p`,
        method: "put",
      },
      update: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/header?campKey=p`,
        method: "delete",
      }
    },
    // events: {
    //   beforeQuery(ds, params) {
    //     params["customizeFilterComparison"] = "companyId:=,createdName:LIKE,creationDate:~,statusCode:IN";
    //   }
    // }
  };
}
// 待确认
function planDsByAffirm(key = "", configAbc = "A") {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: true,
    // 筛选器
    filterCustomizeCode: `SMBL.DELIVERY_WORKBENCH.PLAN_${configAbc}.SEARCH.AFFIRM${key}`,
    // 快速查询
    fastQueryField: {
      fieldName: $T("slod.common.model.common.deliveryHeaderAndLineNum").$D("订单号/单据编号"),
      fieldCode: "deliveryHeaderAndLineNums",
      fieldType: "TEXT",
    },
    queryParameter: {
      nodeTemplateCode: null,
      nodeConfigId: null,
      customizeUnitCode: null,
      hdKey: null,
      asyncCountFlag: "N",
    },
    pathParameter: {
      id: null,
      type: null,
    },
    // 模型字段
    fields: [
      {
        fieldCode: "displayPlanNum",
        fieldName: $T("slod.common.model.common.displayAsnNum").$D("单据编号"),
      },
      {
        fieldCode: "displayPlanNumAndLineNum",
        fieldName: $T("slod.common.model.common.displayAsnNumAndLineNum").$D("单据编号-行号"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldName: $T("slod.common.model.common.statusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "lineStatusMeaning",
        fieldName: $T("slod.common.model.common.lineStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("slod.common.model.common.invOrganizationNames").$D("库存组织"),
      },
      {
        fieldCode: "itemNameAndCode",
        fieldName: $T("slod.common.model.common.itemCodeAndName").$D("物料编码|名称"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("slod.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("slod.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "actualQuantity",
        fieldName: $T("slod.common.model.common.planQuantity").$D("本次计划数量"),
      },
      {
        fieldCode: "plannedArrivalDate",
        fieldName: $T("slod.common.model.common.plannedArrivalDate").$D("本次计划到货日期"),
      },
      {
        fieldCode: "quantity",
        fieldName: $T("slod.common.model.common.quantity").$D("确认数量"),
      },
      {
        fieldCode: "confirmArrivalDate",
        fieldName: $T("slod.common.model.common.confirmArrivalDate").$D("确认到货日期"),
      },
      {
        fieldCode: "displayUom",
        fieldName: $T("slod.common.model.common.displayUom").$D("单位"),
      },
      {
        fieldCode: "unitPackageQuantity",
        fieldName: $T("slod.common.model.common.unitPackageQuantity").$D("单包装数"),
      },
      {
        fieldCode: "packageQuantity",
        fieldName: $T("slod.common.model.common.packages").$D("件数"),
      },
      {
        fieldCode: "remainderQuantity",
        fieldName: $T("slod.common.model.common.remainderQuantity").$D("尾数"),
      },
      {
        fieldCode: "netWeight",
        fieldName: $T("slod.common.model.common.netWeight").$D("净重（KG)"),
      },
      {
        fieldCode: "grossWeight",
        fieldName: $T("slod.common.model.common.grossWeight").$D("毛重（KG)"),
      },
      {
        fieldCode: "lotNum",
        fieldName: $T("slod.common.model.common.lotNum").$D("批次号"),
      },
      {
        fieldCode: "productionDate",
        fieldName: $T("slod.common.model.common.productionDate").$D("生产日期"),
      },
      {
        fieldCode: "shelfLife",
        fieldName: $T("slod.common.model.common.shelfLife").$D("保质期"),
      },
      {
        fieldCode: "lotExpirationDate",
        fieldName: $T("slod.common.model.common.lotExpirationDate").$D("批次有效期"),
      },
      {
        fieldCode: "serialNum",
        fieldName: $T("slod.common.model.common.serialNum").$D("序列号"),
      },
      {
        fieldCode: "neededDate",
        fieldName: $T("slod.common.model.common.neededDate").$D("需求日期"),
      },
      {
        fieldCode: "promisedDate",
        fieldName: $T("slod.common.model.common.promisedDate").$D("承诺交货日期"),
      },
      {
        fieldCode: "purchaseLineRemark",
        fieldName: $T("slod.common.model.common.purchaseLineRemark").$D("采购方行备注"),
      },
      {
        fieldCode: "supplierLineRemark",
        fieldName: $T("slod.common.model.common.supplierLineRemark").$D("供应商行备注"),
      },
      {
        fieldCode: "agentName",
        fieldName: $T("slod.common.model.common.agentName").$D("采购员"),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("slod.common.model.common.categoryNames").$D("品类"),
      },
      {
        fieldCode: "receiveAddress",
        fieldName: $T("slod.common.model.common.receiveAddres").$D("送货地址"),
      },
      {
        fieldCode: "fromDisplayPoNum",
        fieldName: $T("slod.common.model.common.fromDisplayPoNum").$D("来源订单号-行号"),
      },
      {
        fieldCode: "sourceDisplayNum",
        fieldName: $T("slod.common.model.common.sourceDisplayNum").$D("来源单据编号-行号"),
      },
      {
        fieldCode: "sourceNodeConfigName",
        fieldName: $T("slod.common.model.common.sourceNodeConfigName").$D("来源单据类型"),
      },
      {
        fieldCode: "shipToLocContName",
        fieldName: $T("slod.common.model.common.shipToLocContName").$D("联系人"),
      },
      {
        fieldCode: "shipToLocTelNum",
        fieldName: $T("slod.common.model.common.shipToLocTelNum").$D("联系电话"),
      },
      {
        fieldCode: "productNum",
        fieldName: $T("slod.common.model.common.productNum").$D("商品编码"),
      },
      {
        fieldCode: "productName",
        fieldName: $T("slod.common.model.common.productName").$D("商品名称"),
      },
      {
        fieldCode: "catalogName",
        fieldName: $T("slod.common.model.common.catalogName").$D("商品目录"),
      },
      {
        fieldCode: "splitFlagMeaning",
        fieldName: $T("slod.common.model.common.splitFlag").$D("拆分标记"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("slod.common.model.common.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "updatedName",
        fieldName: $T("slod.common.model.common.updatedName").$D("更新人"),
      },
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/wait-confirm/{type}/page?campKey=p`,
        method: "get",
      },
      submit: {
        url: key === "_H" ? `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/confirm-line/tabulation?campKey=p` : `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/confirm/tabulation?campKey=p`,
        method: "put",
      },
      update: {
        url: key === "_H" ? `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/refuse/line/tabulation?campKey=p` : `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/refuse/tabulation?campKey=p`,
        method: "put",
      }
    },
  };
}
// 全部
function planDsByAll(key = "", configAbc = "A") {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: true,
    // 筛选器
    filterCustomizeCode: `SMBL.DELIVERY_WORKBENCH.PLAN_${configAbc}.SEARCH.ALL${key}`,
    // 快速查询
    fastQueryField: {
      fieldName: $T("slod.common.model.common.deliveryHeaderAndLineNum").$D("订单号/单据编号"),
      fieldCode: "deliveryHeaderAndLineNums",
      fieldType: "TEXT",
    },
    queryParameter: {
      nodeTemplateCode: null,
      nodeConfigId: null,
      customizeUnitCode: null,
      hdKey: null,
      asyncCountFlag: "N",
    },
    pathParameter: {
      id: null,
      type: null,
    },
    // 模型字段
    fields: [
      {
        fieldCode: "displayPlanNum",
        fieldName: $T("slod.common.model.common.displayAsnNum").$D("单据编号"),
      },
      {
        fieldCode: "displayPlanNumAndLineNum",
        fieldName: $T("slod.common.model.common.displayAsnNumAndLineNum").$D("单据编号-行号"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldName: $T("slod.common.model.common.statusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "lineStatusMeaning",
        fieldName: $T("slod.common.model.common.lineStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "shipDate",
        fieldName: $T("slod.common.model.common.shipDate").$D("发货日期"),
      },
      {
        fieldCode: "expectedArriveDate",
        fieldName: $T("slod.common.model.common.expectedArriveDate").$D("预计到货时间"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("slod.common.model.common.invOrganizationNames").$D("库存组织"),
      },
      {
        fieldCode: "createCampCodeMeaning",
        fieldName: $T("slod.common.model.common.createCampCodeMeaning").$D("创建方"),
      },
      {
        fieldCode: "itemNameAndCode",
        fieldName: $T("slod.common.model.common.itemCodeAndName").$D("物料编码|名称"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("slod.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("slod.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "actualQuantity",
        fieldName: $T("slod.common.model.common.planQuantity").$D("本次计划数量"),
      },
      {
        fieldCode: "quantity",
        fieldName: $T("slod.common.model.common.quantity").$D("确认数量"),
      },
      {
        fieldCode: "displayUom",
        fieldName: $T("slod.common.model.common.displayUom").$D("单位"),
      },
      {
        fieldCode: "receiveQuantity",
        fieldName: $T("slod.common.model.common.receiveQuantity").$D("接收数量"),
      },
      {
        fieldCode: "receiveStatusMeaning",
        fieldName: $T("slod.common.model.common.receiveStatus").$D("接收状态"),
      },
      {
        fieldCode: "unitPackageQuantity",
        fieldName: $T("slod.common.model.common.unitPackageQuantity").$D("单包装数"),
      },
      {
        fieldCode: "packageQuantity",
        fieldName: $T("slod.common.model.common.packages").$D("件数"),
      },
      {
        fieldCode: "remainderQuantity",
        fieldName: $T("slod.common.model.common.remainderQuantity").$D("尾数"),
      },
      {
        fieldCode: "netWeight",
        fieldName: $T("slod.common.model.common.netWeight").$D("净重（KG)"),
      },
      {
        fieldCode: "grossWeight",
        fieldName: $T("slod.common.model.common.grossWeight").$D("毛重（KG)"),
      },
      {
        fieldCode: "lotNum",
        fieldName: $T("slod.common.model.common.lotNum").$D("批次号"),
      },
      {
        fieldCode: "productionDate",
        fieldName: $T("slod.common.model.common.productionDate").$D("生产日期"),
      },
      {
        fieldCode: "lotExpirationDate",
        fieldName: $T("slod.common.model.common.lotExpirationDate").$D("批次有效期"),
      },
      {
        fieldCode: "serialNum",
        fieldName: $T("slod.common.model.common.serialNum").$D("序列号"),
      },
      {
        fieldCode: "purchaseLineRemark",
        fieldName: $T("slod.common.model.common.purchaseLineRemark").$D("采购方行备注"),
      },
      {
        fieldCode: "supplierLineRemark",
        fieldName: $T("slod.common.model.common.supplierLineRemark").$D("供应商行备注"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "fromDisplayPoNum",
        fieldName: $T("slod.common.model.common.fromDisplayPoNum").$D("来源订单号-行号"),
      },
      {
        fieldCode: "sourceDisplayNum",
        fieldName: $T("slod.common.model.common.sourceDisplayNum").$D("来源单据编号-行号"),
      },
      {
        fieldCode: "sourceNodeConfigName",
        fieldName: $T("slod.common.model.common.sourceNodeConfigName").$D("来源单据类型"),
      },
      {
        fieldCode: "shipToLocContName",
        fieldName: $T("slod.common.model.common.shipToLocContName").$D("联系人"),
      },
      {
        fieldCode: "shipToLocTelNum",
        fieldName: $T("slod.common.model.common.shipToLocTelNum").$D("联系电话"),
      },
      {
        fieldCode: "splitFlagMeaning",
        fieldName: $T("slod.common.model.common.splitFlag").$D("拆分标记"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("slod.common.model.common.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "updatedName",
        fieldName: $T("slod.common.model.common.updatedName").$D("更新人"),
      },
      {
        fieldCode: "strategyName",
        fieldName: $T("slod.common.model.common.strategyName").$D("发货策略"),
      },
      {
        fieldCode: "strategyDataVersion",
        fieldName: $T("slod.common.model.common.strategyDataVersion").$D("发货策略版本"),
      },
      {
        fieldCode: "downstreamNodeInfoList",
        fieldName: $T("slod.common.model.common.downstreamNodeInfoList").$D("下游已确认数量"),
      },
      {
        fieldCode: "poTypeName",
        fieldName: $T("slod.common.model.common.poTypeName").$D("订单类型"),
      },
      {
        fieldCode: "neededDate",
        fieldName: $T("slod.common.model.common.neededDate").$D("需求日期"),
      },
      {
        fieldCode: "promisedDate",
        fieldName: $T("slod.common.model.common.promisedDate").$D("承诺交货日期"),
      },
      {
        fieldCode: "agentName",
        fieldName: $T("slod.common.model.common.agentName").$D("采购员"),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("slod.common.model.common.categoryNames").$D("品类"),
      },
      {
        fieldCode: "receiveAddress",
        fieldName: $T("slod.common.model.common.receiveAddres").$D("送货地址"),
      },
      {
        fieldCode: "plannedArrivalDate",
        fieldName: $T("slod.common.model.common.plannedArrivalDate").$D("本次计划到货日期"),
      },
      {
        fieldCode: "confirmArrivalDate",
        fieldName: $T("slod.common.model.common.confirmArrivalDate").$D("确认到货日期"),
      },
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/{id}/all/{type}/page?campKey=p`,
        method: "get",
      },
      submit: {
        url: key === "_H" ? `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/close-line?campKey=p` : `/slod/v1/${SrmUtil.getTenantId()}/delivery/PLAN/close?campKey=p`,
        method: "put",
      },
    },
    // events: {
    //   beforeQuery(ds, params) {
    //     params["customizeFilterComparison"] = key ? "itemCode:=,itemName:LIKE,companyId:=,lineStatus:=" : "statusCode:=,shipDate:~,expectedArriveDate:~,companyId:=";
    //   }
    // }
  };
}

export {
  planDsByCreate,
  planDsBySubmit,
  planDsByAffirm,
  planDsByAll
};
